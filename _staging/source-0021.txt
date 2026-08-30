/**
 * Hybrid static + dynamic server for the Medicare site.
 *
 * Most routes are served directly from the pre-rendered dist/public tree,
 * including RFC-9110-compliant Accept-Encoding negotiation for the .br/.gz
 * files emitted by the Vite compression build.
 *
 * The AEP page (/medicare-annual-enrollment-period-san-diego) is rendered
 * at request time so the AEP year and coverage year are always correct
 * without requiring a manual redeploy each October.
 */

import http from "node:http";
import fs   from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const distPublic = path.resolve(__dirname, "dist/public");
const CANONICAL_HOST = "medicarewithashley.com";

// AEP route (served dynamically at its slashless canonical path)
const AEP_SLUG = "/medicare-annual-enrollment-period-san-diego";

// Load the untouched Vite HTML shell saved by prerender.mjs. Using the
// prerendered homepage here would duplicate its body and canonical metadata in
// the dynamically rendered AEP page.
const template = fs.readFileSync(
  path.resolve(__dirname, "dist/server/page-template.html"),
  "utf-8",
);
const { canonicalRoutes } = JSON.parse(
  fs.readFileSync(path.resolve(distPublic, "route-manifest.json"), "utf-8"),
);
const canonicalRouteSet = new Set(canonicalRoutes);

// Import the SSR entry built by `vite build --config vite.ssr.config.ts`.
const { render } = await import("./dist/server/entry-server.js");

// ---------------------------------------------------------------------------
// Accept-Encoding negotiation (RFC 9110 §12.5.3)
// ---------------------------------------------------------------------------

/**
 * Parse an Accept-Encoding header value into a list of { encoding, q } pairs
 * sorted by descending q-value.  An absent or empty header returns [] which
 * means "any content coding is acceptable".
 */
function parseAcceptEncoding(header) {
  if (!header) return [];
  return header
    .split(",")
    .map(part => {
      const segs    = part.trim().split(";");
      const encoding = segs[0].trim().toLowerCase();
      let q = 1;
      for (const seg of segs.slice(1)) {
        const m = seg.match(/^\s*q\s*=\s*([0-9.]+)\s*$/i);
        if (m) { q = Math.min(1, Math.max(0, parseFloat(m[1]))); break; }
      }
      return { encoding, q };
    })
    .filter(({ encoding }) => encoding.length > 0)
    .sort((a, b) => b.q - a.q);
}

/**
 * Return whether `encoding` is acceptable given the parsed directives.
 *
 * Rules (RFC 9110 §12.5.3):
 *   - Explicit match takes priority.
 *   - A wildcard (*) applies to encodings not explicitly listed.
 *   - `identity` is acceptable by default unless explicitly forbidden.
 *   - An absent header (empty parsed array) means any encoding is OK.
 */
function isAcceptable(encoding, parsed) {
  if (parsed.length === 0) return true;                        // no header → anything OK

  const exact    = parsed.find(p => p.encoding === encoding);
  if (exact    !== undefined) return exact.q > 0;

  const wildcard = parsed.find(p => p.encoding === "*");
  if (wildcard !== undefined) return wildcard.q > 0;

  // Not listed, no wildcard: identity is acceptable by default, others are not.
  return encoding === "identity";
}

/**
 * Effective q-value of an encoding for sorting server-side candidates by
 * client preference.
 */
function qValue(encoding, parsed) {
  const exact    = parsed.find(p => p.encoding === encoding);
  if (exact    !== undefined) return exact.q;
  const wildcard = parsed.find(p => p.encoding === "*");
  if (wildcard !== undefined) return wildcard.q;
  return encoding === "identity" ? 1 : 0;
}

// ---------------------------------------------------------------------------
// Static-file helpers
// ---------------------------------------------------------------------------

/** MIME types keyed by the real (non-encoding) file extension. */
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript",
  ".mjs":  "application/javascript",
  ".css":  "text/css",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".webp": "image/webp",
  ".txt":  "text/plain",
  ".xml":  "text/xml",
  ".webmanifest": "application/manifest+json",
};

/**
 * Locate the best file to serve for `urlPath` given the client's
 * Accept-Encoding preferences.
 *
 * Returns one of:
 *   { filePath, mime, encoding }     — serve this file with these headers
 *   { notAcceptable: true }          — no acceptable representation → 406
 *   null                             — file not found
 */
function resolveFile(urlPath, parsed) {
  // Build candidate base paths (no encoding suffix yet)
  const base = path.join(distPublic, urlPath);

  // Prevent path traversal
  const normalized = path.normalize(base);
  if (!normalized.startsWith(distPublic)) return null;

  const candidates = [
    normalized,
    normalized.endsWith(path.sep) ? normalized + "index.html" : null,
    normalized + path.sep + "index.html",
    normalized + ".html",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) continue;

    const ext  = path.extname(candidate);
    const mime = MIME[ext] ?? "application/octet-stream";

    // Compressed variants available for this file
    const available = [
      { encoding: "br",   filePath: candidate + ".br"  },
      { encoding: "gzip", filePath: candidate + ".gz"  },
    ].filter(v => fs.existsSync(v.filePath));

    // Filter to variants the client will accept, then sort by client preference
    const acceptable = available
      .filter(v => isAcceptable(v.encoding, parsed))
      .sort((a, b) => qValue(b.encoding, parsed) - qValue(a.encoding, parsed));

    if (acceptable.length > 0) {
      return { filePath: acceptable[0].filePath, mime, encoding: acceptable[0].encoding };
    }

    // No compressed variant acceptable — fall back to identity
    if (!isAcceptable("identity", parsed)) {
      return { notAcceptable: true };   // explicit identity;q=0 or *;q=0
    }
    return { filePath: candidate, mime, encoding: null };
  }

  return null; // file not found
}

/**
 * Try to serve a static file.  Returns true on success, false if not found.
 * Writes a 406 and returns true if the file exists but no encoding is acceptable.
 */
function serveStatic(urlPath, parsed, res, statusCode = 200) {
  const resolved = resolveFile(urlPath, parsed);
  if (!resolved) return false;

  if (resolved.notAcceptable) {
    res.writeHead(406, { "Content-Type": "text/plain" });
    res.end("406 Not Acceptable");
    return true;
  }

  const { filePath, mime, encoding } = resolved;
  const headers = { "Content-Type": mime, "Vary": "Accept-Encoding" };
  if (encoding) headers["Content-Encoding"] = encoding;

  // Long-lived immutable cache for hashed assets; conservative for HTML
  if (mime.startsWith("text/html")) {
    headers["Cache-Control"] = "public, max-age=0, must-revalidate";
  } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
    headers["Cache-Control"] = "public, max-age=31536000, immutable";
  }

  res.writeHead(statusCode, headers);
  res.end(fs.readFileSync(filePath));
  return true;
}

function getRequestHost(req) {
  const forwarded = req.headers["x-forwarded-host"];
  const rawHost = Array.isArray(forwarded)
    ? forwarded[0]
    : (forwarded ?? req.headers.host ?? "");
  return rawHost.split(",")[0].trim().split(":")[0].toLowerCase();
}

function getCanonicalRoute(urlPath) {
  if (urlPath === "/") return "/";
  const candidate = urlPath.replace(/\/+$/, "");
  return canonicalRouteSet.has(candidate) ? candidate : null;
}

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

// ---------------------------------------------------------------------------
// Dynamic AEP renderer
// ---------------------------------------------------------------------------

/**
 * Assemble the AEP page HTML at request time using the SSR entry.
 * Replicates the same head-injection logic used by prerender.mjs so the
 * result is identical in structure to a pre-rendered page.
 */
function renderAepPage(url) {
  const { appHtml } = render(url);

  // react-helmet-async v3 emits head tags inline before the first block element
  const contentStart = appHtml.search(/<(?:div|header|main|section|nav|footer|article|aside)[^>]*>/);
  const headTagsHtml = contentStart > 0 ? appHtml.substring(0, contentStart) : "";
  const bodyHtml = canonicalizeInternalLinks(
    contentStart > 0 ? appHtml.substring(contentStart) : appHtml,
  );

  let html = template.replace(
    `<div id="root"></div>`,
    `<div id="root">${bodyHtml}</div>`
  );

  // Swap in the page-specific <title>
  const titleMatch = headTagsHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/);
  if (titleMatch) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${titleMatch[1]}</title>`);
  }

  const robotsMatch = headTagsHtml.match(/<meta[^>]+name="robots"[^>]*>/i);
  if (robotsMatch) {
    html = html.replace(/<meta[^>]+name="robots"[^>]*>/i, robotsMatch[0]);
  }

  // Append remaining head tags (meta, link, script[ld+json], …)
  const extraTags = headTagsHtml
    .replace(/<title[^>]*>[\s\S]*?<\/title>/g, "")
    .replace(/<meta[^>]+name="robots"[^>]*>/gi, "")
    .trim();
  if (extraTags) {
    html = html.replace("</head>", `    ${extraTags}\n  </head>`);
  }

  return canonicalizeInternalLinks(html);
}

// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------

const PORT = parseInt(process.env.PORT ?? "25970", 10);

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url ?? "/", "http://localhost");
  const urlPath = requestUrl.pathname;
  const parsed  = parseAcceptEncoding(req.headers["accept-encoding"]);
  const requestHost = getRequestHost(req);
  const canonicalRoute = getCanonicalRoute(urlPath);
  const forwardedProto = String(req.headers["x-forwarded-proto"] ?? "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  const targetPath = urlPath === "/" ? "/" : urlPath.replace(/\/+$/, "");

  // Collapse protocol, host, and trailing-slash variants in one server-level
  // redirect so crawlers never have to follow a redirect chain.
  if (
    forwardedProto === "http" ||
    requestHost === `www.${CANONICAL_HOST}`
  ) {
    res.writeHead(301, {
      "Location": `https://${CANONICAL_HOST}${targetPath}${requestUrl.search}`,
      "Cache-Control": "public, max-age=3600",
    });
    res.end();
    return;
  }

  // The homepage keeps "/", while every other URL is slashless. Apply this to
  // unknown paths too so "/missing/" cannot remain a separately crawlable URL.
  if (urlPath !== "/" && urlPath.endsWith("/")) {
    res.writeHead(301, {
      "Location": `${targetPath}${requestUrl.search}`,
      "Cache-Control": "public, max-age=3600",
    });
    res.end();
    return;
  }

  if (canonicalRoute === AEP_SLUG) {
    try {
      const html = renderAepPage(AEP_SLUG);
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        // No-store so proxies always re-render; revisit TTL if caching is desired.
        "Cache-Control": "no-store",
      });
      res.end(html);
    } catch (err) {
      console.error("AEP SSR error:", err);
      // Graceful degradation: fall back to the pre-rendered static file
      if (!serveStatic(urlPath, parsed, res)) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    }
    return;
  }

  // All other routes: serve from the pre-rendered static tree
  if (!serveStatic(urlPath, parsed, res)) {
    // Production has a complete prerender manifest, so an unknown path is a
    // genuine 404 rather than a homepage-shaped SPA fallback.
    if (!serveStatic("/404.html", parsed, res, 404)) {
      res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      });
      res.end("404 Page Not Found");
    }
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Medicare site listening on port ${PORT}`);
});
