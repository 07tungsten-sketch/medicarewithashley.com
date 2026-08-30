import { execFile, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { representativeInnerRoutes } from "./representative-inner-routes.mjs";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const artifactDir = path.resolve(__dirname, "..");
const distPublic = path.resolve(artifactDir, "dist/public");
const port = 32175;
const baseUrl = `http://127.0.0.1:${port}`;
const blogRoute = "/blog/family-pharmacy-center-san-diego";

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForServer(child) {
  const deadline = Date.now() + 15_000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`server.mjs exited before it was ready (code ${child.exitCode})`);
    }

    try {
      const response = await fetch(`${baseUrl}/`, {
        headers: { "Accept-Encoding": "identity" },
      });
      if (response.status === 200) return;
    } catch {
      // The server may still be starting.
    }

    await delay(100);
  }

  throw new Error("Timed out waiting for server.mjs to start");
}

async function curlResponse(pathname, acceptEncoding, decompress) {
  const headersFile = path.join(
    os.tmpdir(),
    `verify-prerender-${process.pid}-${Date.now()}.headers`,
  );
  const args = [
    "--fail-with-body",
    "--silent",
    "--show-error",
    "--max-time",
    "15",
    "--header",
    `Accept-Encoding: ${acceptEncoding}`,
    "--dump-header",
    headersFile,
    `${baseUrl}${pathname}`,
  ];
  if (decompress) args.unshift("--compressed");

  try {
    const { stdout } = await execFileAsync("curl", args, {
      cwd: artifactDir,
      encoding: "utf8",
      maxBuffer: 5 * 1024 * 1024,
    });
    const headers = fs.readFileSync(headersFile, "utf8");
    return { body: stdout, headers };
  } finally {
    fs.rmSync(headersFile, { force: true });
  }
}

function getHeader(headers, name) {
  return headers
    .split(/\r?\n/)
    .find((line) => line.toLowerCase().startsWith(`${name.toLowerCase()}:`))
    ?.slice(name.length + 1)
    .trim();
}

function getStatusCode(headers) {
  const statusCodes = headers
    .split(/\r?\n/)
    .map((line) => line.match(/^HTTP\/\S+\s+(\d{3})\b/i)?.[1])
    .filter(Boolean);
  return Number(statusCodes.at(-1));
}

function assertPrerenderedHtml(
  pathname,
  encodingLabel,
  html,
  expectedHtml,
  requiredText,
) {
  if (!html.includes("<h1")) {
    throw new Error(
      `${pathname} ${encodingLabel} response is missing <h1; prerendered content may be empty`,
    );
  }

  if (requiredText && !html.includes(requiredText)) {
    throw new Error(
      `${pathname} ${encodingLabel} response is missing "${requiredText}"; ` +
        "a stale or invalid representation may be served",
    );
  }

  if (html !== expectedHtml) {
    throw new Error(
      `${pathname} ${encodingLabel} response differs from dist/public HTML; ` +
        "a stale or invalid representation may be served",
    );
  }
}

async function verifyRoute(pathname, requiredText) {
  const expectedPath =
    pathname === "/"
      ? path.resolve(distPublic, "index.html")
      : path.resolve(distPublic, pathname.slice(1), "index.html");
  if (!fs.existsSync(expectedPath)) {
    throw new Error(`${expectedPath} not found; run the production build first`);
  }
  const expectedHtml = fs.readFileSync(expectedPath, "utf8");

  const modes = [
    {
      label: "Brotli",
      acceptEncoding: "br",
      contentEncoding: "br",
      decompress: true,
    },
    {
      label: "gzip",
      acceptEncoding: "gzip",
      contentEncoding: "gzip",
      decompress: true,
    },
    {
      label: "identity",
      acceptEncoding: "identity",
      contentEncoding: undefined,
      decompress: false,
    },
  ];

  for (const mode of modes) {
    const response = await curlResponse(
      pathname,
      mode.acceptEncoding,
      mode.decompress,
    );
    const statusCode = getStatusCode(response.headers);
    if (statusCode !== 200) {
      throw new Error(
        `${pathname} ${mode.label} response returned HTTP ${statusCode || "unknown"} instead of 200`,
      );
    }

    const contentEncoding = getHeader(response.headers, "content-encoding");
    if (contentEncoding !== mode.contentEncoding) {
      throw new Error(
        `${pathname} ${mode.label} response returned Content-Encoding: ` +
          `${contentEncoding ?? "(none)"}; expected ${mode.contentEncoding ?? "(none)"}`,
      );
    }

    if (!getHeader(response.headers, "content-type")?.startsWith("text/html")) {
      throw new Error(
        `${pathname} ${mode.label} response did not return an HTML content type`,
      );
    }

    assertPrerenderedHtml(
      pathname,
      mode.label,
      response.body,
      expectedHtml,
      requiredText,
    );
  }
}

const child = spawn(process.execPath, ["server.mjs"], {
  cwd: artifactDir,
  env: { ...process.env, PORT: String(port), NODE_ENV: "production" },
  stdio: ["ignore", "pipe", "pipe"],
});

let childOutput = "";
child.stdout.on("data", (chunk) => {
  childOutput += chunk;
});
child.stderr.on("data", (chunk) => {
  childOutput += chunk;
});

try {
  await waitForServer(child);

  await verifyRoute("/", "Medicare Is Confusing");
  console.log(
    "  ✓ homepage serves valid prerendered HTML with Brotli, gzip, and identity",
  );

  await verifyRoute(
    blogRoute,
    "Why We&#x27;re Partnering with Family Pharmacy Center",
  );
  console.log(
    `  ✓ ${blogRoute} serves valid prerendered HTML with Brotli, gzip, and identity`,
  );

  for (const route of representativeInnerRoutes) {
    await verifyRoute(route);
    console.log(
      `  ✓ ${route} serves valid prerendered HTML with Brotli, gzip, and identity`,
    );
  }

  console.log("\nPrerender verification passed.");
} catch (error) {
  console.error("\nPrerender verification failed.");
  if (childOutput.trim()) console.error(childOutput.trim());
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  child.kill("SIGTERM");
}