/**
 * Sitemap static-route coverage guard
 *
 * Checks that every static route defined in App.tsx's <Switch> block has a
 * corresponding <loc> entry in public/sitemap.xml.
 *
 * HOW TO USE: When you add a new static <Route path="..."> to App.tsx, also
 * add its URL to public/sitemap.xml, and add the slug to STATIC_ROUTES below.
 * This test will fail loudly if a route is in the list but missing from the
 * sitemap — along with a copy-pasteable XML snippet.
 *
 * ALLOWLISTED routes (intentionally excluded from the sitemap):
 *   /blog/:slug  — dynamic route, individual posts are listed separately
 *   (404 fallback has no path and is never listed)
 *
 * NOTE: The root "/" keeps its slash; every inner canonical URL is slashless.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const SITE_BASE = "https://medicarewithashley.com";

/**
 * Canonical list of static routes from App.tsx that must appear in the sitemap.
 * Keep this in sync with the <Route path="..."> entries in src/App.tsx.
 * Dynamic routes (/blog/:slug) and the 404 fallback are intentionally omitted.
 */
const STATIC_ROUTES: string[] = [
  "/",
  "/about",
  "/free-consultation",
  "/medicare-basics",
  "/turning-65",
  "/medicare-advantage",
  "/medicare-supplements",
  "/prescription-drug-plans",
  "/faq",
  "/contact",
  "/schedule",
  "/services",
  "/san-diego-medicare-broker",
  "/blog",
  "/carriers",
  "/san-diego-senior-resources",
  "/privacy-policy",
  "/terms-and-conditions",
  "/part-d-penalty-calculator",
  "/part-b-penalty-calculator",
  "/medicare-irmaa-calculator-san-diego",
  "/medicare-medi-cal-dual-eligible-san-diego",
  "/medicare-annual-enrollment-period-san-diego",
];

function loadSitemapLocs(): Set<string> {
  const sitemapPath = resolve(__dirname, "../../public/sitemap.xml");
  const xml = readFileSync(sitemapPath, "utf-8");

  // Extract every <loc>…</loc> value
  const locs = new Set<string>();
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xml)) !== null) {
    locs.add(match[1].trim());
  }
  return locs;
}

/** Convert a route slug to its canonical sitemap URL (slashless except root). */
function routeToUrl(route: string): string {
  if (route === "/") return `${SITE_BASE}/`;
  const slug = route.replace(/^\//, "");
  return `${SITE_BASE}/${slug}`;
}

/**
 * Extract static Route paths declared as path="..." string literals in
 * App.tsx. Dynamic routes that contain ":" (e.g. /blog/:slug) and city/
 * provider routes that use template literals are automatically excluded.
 */
function loadAppTsxStaticPaths(): string[] {
  const appPath = resolve(__dirname, "../App.tsx");
  const source = readFileSync(appPath, "utf-8");

  const paths: string[] = [];
  // Match only double-quoted path props on Route elements — template-literal
  // paths use backticks and are skipped automatically. Anchoring the match to
  // the element prevents unrelated path props or comments from being treated
  // as application routes.
  const routeRegex = /<Route\b[^>]*\bpath="([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = routeRegex.exec(source)) !== null) {
    const p = match[1].trim();
    // Skip dynamic segments — they are intentionally not in STATIC_ROUTES.
    if (!p.includes(":")) {
      paths.push(p);
    }
  }
  return paths;
}

/**
 * STATIC_ROUTES sync guard
 *
 * Verifies that STATIC_ROUTES and the static Route paths in App.tsx are
 * identical. Any drift between the two lists invalidates the sitemap reverse
 * guard, so this test must stay green before that guard is trustworthy.
 *
 * Allowlisted in App.tsx but NOT in STATIC_ROUTES:
 *   /blog/:slug  — dynamic route (filtered out above)
 */
describe("STATIC_ROUTES is in sync with App.tsx static <Route> paths", () => {
  const appPaths = loadAppTsxStaticPaths();
  const appPathSet = new Set(appPaths);
  const staticRouteSet = new Set(STATIC_ROUTES);

  it("App.tsx has at least one static route (sanity check)", () => {
    expect(appPaths.length).toBeGreaterThan(0);
  });

  it("every App.tsx static route appears in STATIC_ROUTES", () => {
    const missing = appPaths.filter((p) => !staticRouteSet.has(p));
    expect(
      missing,
      `These routes exist in App.tsx but are missing from STATIC_ROUTES:\n` +
        missing.map((p) => `  "${p}"`).join("\n") +
        `\n\nAdd them to the STATIC_ROUTES array in this test file.`,
    ).toHaveLength(0);
  });

  it("every STATIC_ROUTES entry appears in App.tsx", () => {
    const orphaned = STATIC_ROUTES.filter((p) => !appPathSet.has(p));
    expect(
      orphaned,
      `These STATIC_ROUTES entries no longer exist as static <Route path="..."> in App.tsx:\n` +
        orphaned.map((p) => `  "${p}"`).join("\n") +
        `\n\nRemove them from STATIC_ROUTES in this test file (and from sitemap.xml if applicable).`,
    ).toHaveLength(0);
  });
});

describe("sitemap static-route coverage", () => {
  const sitemapLocs = loadSitemapLocs();

  it("sitemap.xml contains at least one <loc> entry (sanity check)", () => {
    expect(sitemapLocs.size).toBeGreaterThan(0);
  });

  it("STATIC_ROUTES list is non-empty", () => {
    expect(STATIC_ROUTES.length).toBeGreaterThan(0);
  });

  /**
   * One sub-test per static route — each fails independently so it's
   * immediately clear which slug is missing from the sitemap.
   */
  for (const route of STATIC_ROUTES) {
    const expectedUrl = routeToUrl(route);

    it(`sitemap includes ${route}`, () => {
      expect(
        sitemapLocs.has(expectedUrl),
        `sitemap.xml is missing an entry for "${route}".\n` +
          `Add the following block to public/sitemap.xml:\n\n` +
          `  <url>\n` +
          `    <loc>${expectedUrl}</loc>\n` +
          `    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n` +
          `    <changefreq>monthly</changefreq>\n` +
          `    <priority>0.8</priority>\n` +
          `  </url>`,
      ).toBe(true);
    });
  }
});

/**
 * Reverse guard: every <loc> listed in the "static" portion of
 * public/sitemap.xml (the entries above the "<!-- City landing pages -->"
 * comment) must correspond to a slug that actually exists in STATIC_ROUTES.
 *
 * This catches the case where a static page is removed from App.tsx and
 * STATIC_ROUTES but its sitemap entry is left behind, which would cause
 * search engines to crawl a dead URL.
 *
 * Blog-post <loc> entries (under "<!-- Blog posts") are not part of the
 * static section and are excluded automatically by the section slice.
 */
describe("sitemap reverse static-route coverage (no orphaned entries)", () => {
  function loadStaticSectionLocs(): string[] {
    const sitemapPath = resolve(__dirname, "../../public/sitemap.xml");
    const xml = readFileSync(sitemapPath, "utf-8");

    // The static section is everything before the first section comment.
    // City pages, provider pages, and blog posts all follow that comment.
    const CITY_MARKER = "<!-- City landing pages -->";
    const cityMarkerIndex = xml.indexOf(CITY_MARKER);
    if (cityMarkerIndex === -1) {
      throw new Error(
        `Could not find "${CITY_MARKER}" comment in public/sitemap.xml. ` +
          `The reverse static-route guard requires this comment to delimit the ` +
          `end of the static section.`,
      );
    }

    // Only look at <loc> entries that appear before the city section.
    const staticSection = xml.slice(0, cityMarkerIndex);

    const locs: string[] = [];
    const locRegex = /<loc>(.*?)<\/loc>/g;
    let match: RegExpExecArray | null;
    while ((match = locRegex.exec(staticSection)) !== null) {
      locs.push(match[1].trim());
    }
    return locs;
  }

  const staticSectionLocs = loadStaticSectionLocs();
  const knownUrls = new Set(STATIC_ROUTES.map(routeToUrl));

  it("static section has at least one <loc> entry (sanity check)", () => {
    expect(staticSectionLocs.length).toBeGreaterThan(0);
  });

  /**
   * One sub-test per sitemap entry — each fails independently so it's
   * immediately clear which slug has been orphaned.
   */
  for (const loc of staticSectionLocs) {
    it(`sitemap static entry ${loc.replace("https://medicarewithashley.com", "")} maps to a known static route`, () => {
      expect(
        knownUrls.has(loc),
        `sitemap.xml has an orphaned entry for "${loc}" in the static section.\n` +
          `The URL no longer maps to any route in STATIC_ROUTES.\n` +
          `Either restore the route in App.tsx and add it back to STATIC_ROUTES, ` +
          `or remove this entry from public/sitemap.xml:\n\n` +
          `  <url>\n` +
          `    <loc>${loc}</loc>\n` +
          `    ...\n` +
          `  </url>`,
      ).toBe(true);
    });
  }
});
