import fs from "fs";
import path from "path";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPublic = path.resolve(__dirname, "dist/public");
const template = fs.readFileSync(path.resolve(distPublic, "index.html"), "utf-8");
const sitemap = fs.readFileSync(path.resolve(__dirname, "public/sitemap.xml"), "utf-8");
fs.writeFileSync(path.resolve(__dirname, "dist/server/page-template.html"), template, "utf-8");

const { render } = await import("./dist/server/entry-server.js");

function loadCanonicalRoutes(xml) {
  const canonicalRoutes = [];
  const locPattern = /<loc>(.*?)<\/loc>/g;
  let match;

  while ((match = locPattern.exec(xml)) !== null) {
    const url = new URL(match[1].trim());
    if (url.origin !== "https://medicarewithashley.com") {
      throw new Error(`Sitemap URL must use the canonical origin: ${url.href}`);
    }
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      throw new Error(`Sitemap URL must not use a trailing slash: ${url.href}`);
    }
    canonicalRoutes.push(url.pathname);
  }

  if (canonicalRoutes.length === 0) {
    throw new Error("No canonical routes found in public/sitemap.xml");
  }

  const uniqueRoutes = new Set(canonicalRoutes);
  if (uniqueRoutes.size !== canonicalRoutes.length) {
    throw new Error("Duplicate canonical routes found in public/sitemap.xml");
  }

  return canonicalRoutes;
}

const ROUTES = loadCanonicalRoutes(sitemap);
const canonicalRouteSet = new Set(ROUTES);

function canonicalizeInternalLinks(html) {
  let canonicalHtml = html.replace(
    /\bhref=(["'])(\/[^"'?#]*)([?#][^"']*)?\1/g,
    (match, quote, pathname, suffix = "") => {
      if (pathname === "/") return match;
      const canonicalPath = pathname.replace(/\/+$/, "");
      if (!canonicalRouteSet.has(canonicalPath) || pathname === canonicalPath) {
        return match;
      }
      return `href=${quote}${canonicalPath}${suffix}${quote}`;
    },
  );
  canonicalHtml = canonicalHtml.replace(
    /(["'])https:\/\/medicarewithashley\.com(\/[^"'?#\s]*)\1/g,
    (match, quote, pathname) => {
      if (pathname === "/") return match;
      const canonicalPath = pathname.replace(/\/+$/, "");
      return canonicalRouteSet.has(canonicalPath)
        ? `${quote}https://medicarewithashley.com${canonicalPath}${quote}`
        : match;
    },
  );
  return canonicalHtml;
}

function renderPage(route) {
  const { appHtml } = render(route);

  // react-helmet-async v3 renders head tags inline at the start of appHtml
  // rather than capturing them in the SSR context. We split them out here:
  //   • headTagsHtml — everything before the first block element (title, meta, link)
  //   • bodyHtml     — the actual page markup starting at the first block element
  const contentStart = appHtml.search(/<(?:div|header|main|section|nav|footer|article|aside)[^>]*>/);
  const suspenseStart =
    contentStart > 0 ? appHtml.lastIndexOf("<!--$-->", contentStart) : -1;
  const suspenseMarker = "<!--$-->";
  const headTagsHtml =
    suspenseStart >= 0
      ? appHtml.substring(0, suspenseStart) +
        appHtml.substring(suspenseStart + suspenseMarker.length, contentStart)
      : contentStart > 0
        ? appHtml.substring(0, contentStart)
        : "";
  const bodyHtml = canonicalizeInternalLinks(
    contentStart > 0
      ? (suspenseStart >= 0 ? suspenseMarker : "") +
        appHtml.substring(contentStart)
      : appHtml,
  );

  let html = template.replace(
    `<div id="root"></div>`,
    `<div id="root">${bodyHtml}</div>`
  );

  // Replace the shell <title> with the page-specific one from headTagsHtml.
  const titleMatch = headTagsHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/);
  if (titleMatch) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${titleMatch[1]}</title>`);
  }

  // Page-level robots metadata must replace the shell default so 404 pages
  // cannot accidentally carry a conflicting "index, follow" directive.
  const robotsMatch = headTagsHtml.match(/<meta[^>]+name="robots"[^>]*>/i);
  if (robotsMatch) {
    html = html.replace(/<meta[^>]+name="robots"[^>]*>/i, robotsMatch[0]);
  }

  // Append all remaining head tags, excluding values already replaced above.
  const extraTags = headTagsHtml
    .replace(/<title[^>]*>[\s\S]*?<\/title>/g, "")
    .replace(/<meta[^>]+name="robots"[^>]*>/gi, "")
    .trim();
  if (extraTags) {
    html = html.replace("</head>", `    ${extraTags}\n  </head>`);
  }

  return canonicalizeInternalLinks(html);
}

let ok = 0;
let fail = 0;

for (const route of ROUTES) {
  try {
    const html = renderPage(route);
    let outFile;
    if (route === "/") {
      outFile = path.resolve(distPublic, "index.html");
      fs.writeFileSync(outFile, html, "utf-8");
    } else {
      const dir = path.resolve(distPublic, route.slice(1));
      fs.mkdirSync(dir, { recursive: true });
      outFile = path.resolve(dir, "index.html");
      fs.writeFileSync(outFile, html, "utf-8");
    }

    // Regenerate compressed variants from this freshly prerendered HTML so
    // the server never serves a stale Vite-generated SPA shell.
    const htmlBuffer = Buffer.from(html, "utf-8");
    fs.writeFileSync(outFile + ".br", brotliCompressSync(htmlBuffer));
    fs.writeFileSync(outFile + ".gz", gzipSync(htmlBuffer));

    ok++;
    process.stdout.write(`  ✓ ${route}\n`);
  } catch (err) {
    fail++;
    process.stderr.write(`  ✗ ${route}: ${err.message}\n`);
  }
}

try {
  const notFoundHtml = renderPage("/__not-found__/");
  const notFoundFile = path.resolve(distPublic, "404.html");
  fs.writeFileSync(notFoundFile, notFoundHtml, "utf-8");
  const notFoundBuffer = Buffer.from(notFoundHtml, "utf-8");
  fs.writeFileSync(notFoundFile + ".br", brotliCompressSync(notFoundBuffer));
  fs.writeFileSync(notFoundFile + ".gz", gzipSync(notFoundBuffer));
  fs.writeFileSync(
    path.resolve(distPublic, "route-manifest.json"),
    JSON.stringify({ canonicalRoutes: ROUTES }, null, 2) + "\n",
    "utf-8",
  );
  process.stdout.write("  ✓ 404 page and canonical route manifest\n");
} catch (err) {
  fail++;
  process.stderr.write(`  ✗ 404 page or route manifest: ${err.message}\n`);
}

console.log(`\nPre-rendering done: ${ok} succeeded, ${fail} failed.`);
if (fail > 0) process.exit(1);
