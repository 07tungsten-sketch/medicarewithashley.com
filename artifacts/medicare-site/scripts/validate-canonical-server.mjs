import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const artifactDir = path.resolve(__dirname, "..");
const port = 32174;
const baseUrl = `http://127.0.0.1:${port}`;
const canonicalOrigin = "https://medicarewithashley.com";

function fail(message) {
  throw new Error(message);
}

function extractCanonical(html) {
  return html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1] ?? null;
}

function extractRobots(html) {
  return [...html.matchAll(/<meta\s+name="robots"\s+content="([^"]+)"/gi)].map(
    (match) => match[1],
  );
}

async function waitForServer(child) {
  const timeoutAt = Date.now() + 15_000;
  while (Date.now() < timeoutAt) {
    if (child.exitCode !== null) fail(`Server exited early with code ${child.exitCode}`);
    try {
      const response = await fetch(`${baseUrl}/`);
      if (response.status === 200) return;
    } catch {
      // The child process is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  fail("Timed out waiting for the production server");
}

async function request(pathname, options = {}) {
  return fetch(`${baseUrl}${pathname}`, {
    redirect: "manual",
    ...options,
  });
}

const child = spawn(process.execPath, ["server.mjs"], {
  cwd: artifactDir,
  env: { ...process.env, PORT: String(port), NODE_ENV: "production" },
  stdio: ["ignore", "pipe", "pipe"],
});

let childOutput = "";
child.stdout.on("data", (chunk) => { childOutput += chunk; });
child.stderr.on("data", (chunk) => { childOutput += chunk; });

try {
  await waitForServer(child);

  const manifest = JSON.parse(
    fs.readFileSync(path.resolve(artifactDir, "dist/public/route-manifest.json"), "utf-8"),
  );

  for (const canonicalPath of manifest.canonicalRoutes) {
    const response = await request(canonicalPath);
    if (response.status !== 200) {
      fail(`${canonicalPath} returned ${response.status}; expected 200`);
    }
    const html = await response.text();
    const expectedCanonical = `${canonicalOrigin}${canonicalPath}`;
    const actualCanonical = extractCanonical(html);
    if (actualCanonical !== expectedCanonical) {
      fail(`${canonicalPath} canonical was ${actualCanonical}; expected ${expectedCanonical}`);
    }
  }

  const trailingSlash = await request("/about/?source=canonical-test");
  if (trailingSlash.status !== 301) {
    fail(`/about/ returned ${trailingSlash.status}; expected 301`);
  }
  if (trailingSlash.headers.get("location") !== "/about?source=canonical-test") {
    fail(`/about/ redirected to ${trailingSlash.headers.get("location")}; expected slashless URL`);
  }

  const wwwAndTrailingSlash = await request("/about/?source=canonical-test", {
    headers: { "x-forwarded-host": "www.medicarewithashley.com" },
  });
  const expectedWwwLocation =
    "https://medicarewithashley.com/about?source=canonical-test";
  if (wwwAndTrailingSlash.status !== 301) {
    fail(`www /about/ returned ${wwwAndTrailingSlash.status}; expected 301`);
  }
  if (wwwAndTrailingSlash.headers.get("location") !== expectedWwwLocation) {
    fail(
      `www /about/ redirected to ${wwwAndTrailingSlash.headers.get("location")}; ` +
      `expected ${expectedWwwLocation}`,
    );
  }

  const httpHomepage = await request("/", {
    headers: {
      "x-forwarded-host": "medicarewithashley.com",
      "x-forwarded-proto": "http",
    },
  });
  if (httpHomepage.status !== 301) {
    fail(`HTTP homepage returned ${httpHomepage.status}; expected 301`);
  }
  if (httpHomepage.headers.get("location") !== "https://medicarewithashley.com/") {
    fail(`HTTP homepage redirected to ${httpHomepage.headers.get("location")}`);
  }

  const missingWithSlash = await request("/definitely-not-a-real-page/");
  if (missingWithSlash.status !== 301) {
    fail(`Trailing-slash unknown route returned ${missingWithSlash.status}; expected 301`);
  }
  if (missingWithSlash.headers.get("location") !== "/definitely-not-a-real-page") {
    fail(
      `Trailing-slash unknown route redirected to ${missingWithSlash.headers.get("location")}`,
    );
  }

  const missing = await request("/definitely-not-a-real-page");
  if (missing.status !== 404) {
    fail(`Unknown route returned ${missing.status}; expected 404`);
  }
  const missingHtml = await missing.text();
  const robots = extractRobots(missingHtml);
  if (robots.length !== 1 || robots[0].toLowerCase() !== "noindex, nofollow") {
    fail(`404 robots metadata was ${JSON.stringify(robots)}; expected one noindex directive`);
  }
  if (extractCanonical(missingHtml) !== null) {
    fail("404 page must not emit a canonical link");
  }
  if (!missingHtml.includes("Page Not Found")) {
    fail("404 response does not contain the branded not-found page");
  }

  console.log(
    `Canonical server validation passed for ${manifest.canonicalRoutes.length} routes, ` +
    "host/path redirects, and the 404 response.",
  );
} catch (error) {
  console.error(childOutput);
  console.error(error.message);
  process.exitCode = 1;
} finally {
  child.kill("SIGTERM");
}