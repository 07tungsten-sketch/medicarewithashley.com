/**
 * Sitemap city-coverage guard
 *
 * Reads public/sitemap.xml and asserts that every city page registered in
 * src/data/cityPages.ts has a corresponding <loc> entry.
 *
 * HOW TO USE: When you add a new city page to cityPages.ts, also add its URL
 * to public/sitemap.xml. This test will fail loudly if the sitemap entry is
 * missing.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { cityPages } from "./cityPages";

const SITE_BASE = "https://medicarewithashley.com";

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

describe("sitemap city coverage", () => {
  const sitemapLocs = loadSitemapLocs();

  it("sitemap.xml contains at least one <loc> entry (sanity check)", () => {
    expect(sitemapLocs.size).toBeGreaterThan(0);
  });

  it("cityPages list is non-empty", () => {
    expect(cityPages.length).toBeGreaterThan(0);
  });

  /**
   * One sub-test per city page — each fails independently so it's immediately
   * clear which slug is missing from the sitemap.
   */
  for (const page of cityPages) {
    const expectedUrl = `${SITE_BASE}/${page.slug}`;

    it(`sitemap includes /${page.slug}`, () => {
      expect(
        sitemapLocs.has(expectedUrl),
        `sitemap.xml is missing an entry for "${page.slug}".\n` +
          `Add the following block to public/sitemap.xml:\n\n` +
          `  <url>\n` +
          `    <loc>${expectedUrl}</loc>\n` +
          `    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n` +
          `    <changefreq>monthly</changefreq>\n` +
          `    <priority>0.9</priority>\n` +
          `  </url>`,
      ).toBe(true);
    });
  }
});
