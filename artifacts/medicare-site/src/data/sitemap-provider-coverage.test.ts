/**
 * Sitemap provider-coverage guard
 *
 * Reads public/sitemap.xml and asserts that every provider page registered in
 * src/data/providerPages.ts has a corresponding <loc> entry.
 *
 * HOW TO USE: When you add a new provider page to providerPages.ts, also add
 * its URL to public/sitemap.xml. This test will fail loudly if the sitemap
 * entry is missing.
 *
 * PENDING_PROVIDER_SLUGS: If the sitemap entry for a new provider page isn't
 * ready yet, add the slug here to defer the forward-coverage check. But note:
 * the inverse guard below will FAIL if you leave a slug here after its sitemap
 * entry has been added, forcing you to clean up promptly.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { providerPages } from "./providerPages";
import { cityPages } from "./cityPages";

const SITE_BASE = "https://medicarewithashley.com";

/**
 * Slugs whose sitemap entries have not yet been added.
 * Remove a slug from this set as soon as its sitemap entry lands —
 * the inverse guard below will fail if you forget.
 */
const PENDING_PROVIDER_SLUGS: ReadonlySet<string> = new Set([
  // example (remove once sitemap entry is added):
  // "new-provider-slug",
]);

/**
 * Slugs whose sitemap entries have not yet been added.
 * Remove a slug from this set as soon as its sitemap entry lands —
 * the inverse guard below will fail if you forget.
 */
const PENDING_CITY_SLUGS: ReadonlySet<string> = new Set([
  // example (remove once sitemap entry is added):
  // "medicare-broker-poway",
]);

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

function loadCitySectionLocs(): string[] {
  const sitemapPath = resolve(__dirname, "../../public/sitemap.xml");
  const xml = readFileSync(sitemapPath, "utf-8");

  const MARKER = "<!-- City landing pages -->";
  const sectionStart = xml.indexOf(MARKER);
  if (sectionStart === -1) {
    throw new Error(
      `Could not find "${MARKER}" comment in public/sitemap.xml. ` +
        `The city-coverage guard requires this comment to delimit the city section.`,
    );
  }

  // Slice up to the next HTML comment so we only inspect city <loc> entries.
  const afterMarker = sectionStart + MARKER.length;
  const nextCommentIndex = xml.indexOf("<!--", afterMarker);
  const citySection =
    nextCommentIndex === -1
      ? xml.slice(afterMarker)
      : xml.slice(afterMarker, nextCommentIndex);

  const locs: string[] = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(citySection)) !== null) {
    locs.push(match[1].trim());
  }
  return locs;
}

describe("sitemap provider coverage", () => {
  const sitemapLocs = loadSitemapLocs();

  it("sitemap.xml contains at least one <loc> entry (sanity check)", () => {
    expect(sitemapLocs.size).toBeGreaterThan(0);
  });

  it("providerPages list is non-empty", () => {
    expect(providerPages.length).toBeGreaterThan(0);
  });

  /**
   * One sub-test per provider page — each fails independently so it's
   * immediately clear which slug is missing from the sitemap.
   * Slugs in PENDING_PROVIDER_SLUGS are deferred until their sitemap entry lands.
   */
  for (const page of providerPages) {
    if (PENDING_PROVIDER_SLUGS.has(page.slug)) continue;

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
          `    <priority>0.8</priority>\n` +
          `  </url>`,
      ).toBe(true);
    });
  }

  /**
   * Inverse guard: every slug in PENDING_PROVIDER_SLUGS must genuinely be
   * absent from the sitemap. If a sitemap entry is added for a pending slug
   * without removing it from the set, this test fails — forcing cleanup.
   * These tests live in the parent describe so the suite is never empty when
   * PENDING_PROVIDER_SLUGS is empty.
   */
  for (const slug of PENDING_PROVIDER_SLUGS) {
    const url = `${SITE_BASE}/${slug}`;
    it(`PENDING provider slug "${slug}" is not yet in sitemap (remove from PENDING_PROVIDER_SLUGS once its sitemap entry is added)`, () => {
      expect(
        sitemapLocs.has(url),
        `"${slug}" is listed in PENDING_PROVIDER_SLUGS but its sitemap entry already exists.\n` +
          `Remove "${slug}" from PENDING_PROVIDER_SLUGS in sitemap-provider-coverage.test.ts\n` +
          `so the forward-coverage check is re-enabled.`,
      ).toBe(false);
    });
  }
});

/**
 * Reverse guard: every <loc> listed under the "Provider landing pages" section
 * of public/sitemap.xml must correspond to a slug that actually exists in
 * providerPages.ts.
 *
 * This catches the case where a provider page is removed or renamed but its
 * sitemap entry is left behind, which would cause search engines to crawl a
 * dead link.
 */
describe("sitemap reverse provider coverage (no orphaned entries)", () => {
  function loadProviderSectionLocs(): string[] {
    const sitemapPath = resolve(__dirname, "../../public/sitemap.xml");
    const xml = readFileSync(sitemapPath, "utf-8");

    const MARKER = "<!-- Provider landing pages -->";
    const sectionStart = xml.indexOf(MARKER);
    if (sectionStart === -1) {
      throw new Error(
        `Could not find "${MARKER}" comment in public/sitemap.xml. ` +
          `The reverse-coverage guard requires this comment to delimit the provider section.`,
      );
    }

    // Slice up to the next HTML comment (e.g. "<!-- Blog posts …") so we only
    // inspect provider <loc> entries and not the rest of the sitemap.
    const afterMarker = sectionStart + MARKER.length;
    const nextCommentIndex = xml.indexOf("<!--", afterMarker);
    const providerSection =
      nextCommentIndex === -1
        ? xml.slice(afterMarker)
        : xml.slice(afterMarker, nextCommentIndex);

    const locs: string[] = [];
    const locRegex = /<loc>(.*?)<\/loc>/g;
    let match: RegExpExecArray | null;
    while ((match = locRegex.exec(providerSection)) !== null) {
      locs.push(match[1].trim());
    }
    return locs;
  }

  const providerSectionLocs = loadProviderSectionLocs();
  const knownSlugs = new Set(providerPages.map((p) => p.slug));

  it("provider landing pages section has at least one <loc> entry (sanity check)", () => {
    expect(providerSectionLocs.length).toBeGreaterThan(0);
  });

  /**
   * One sub-test per sitemap entry — each fails independently so it's
   * immediately clear which slug has been orphaned.
   */
  for (const loc of providerSectionLocs) {
    // Derive the slug by stripping the base URL and any trailing slash.
    const slug = loc
      .replace(`${SITE_BASE}/`, "")
      .replace(/\/$/, "");

    it(`sitemap entry /${slug} maps to a known provider page`, () => {
      expect(
        knownSlugs.has(slug),
        `sitemap.xml has an orphaned entry for "${slug}" under "Provider landing pages".\n` +
          `The slug no longer exists in src/data/providerPages.ts.\n` +
          `Either restore the provider page or remove this entry from public/sitemap.xml:\n\n` +
          `  <url>\n` +
          `    <loc>${loc}</loc>\n` +
          `    ...\n` +
          `  </url>`,
      ).toBe(true);
    });
  }
});

/**
 * Forward coverage: every city page registered in src/data/cityPages.ts must
 * have a corresponding <loc> entry in public/sitemap.xml.
 *
 * HOW TO USE: When you add a new city page to cityPages.ts, also add its URL
 * to public/sitemap.xml. This test will fail loudly if the sitemap entry is
 * missing.
 *
 * If the sitemap entry isn't ready yet, add the slug to PENDING_CITY_SLUGS
 * (defined at the top of this file). The inverse guard inside this describe
 * block will fail as soon as the sitemap entry lands, reminding you to remove
 * the slug from the exemption set.
 */
describe("sitemap city coverage", () => {
  const citySectionLocs = new Set(loadCitySectionLocs());

  it("cityPages list is non-empty", () => {
    expect(cityPages.length).toBeGreaterThan(0);
  });

  /**
   * One sub-test per city page — each fails independently so it's
   * immediately clear which slug is missing from the sitemap.
   * Slugs in PENDING_CITY_SLUGS are deferred until their sitemap entry lands.
   */
  for (const page of cityPages) {
    if (PENDING_CITY_SLUGS.has(page.slug)) continue;

    const expectedUrl = `${SITE_BASE}/${page.slug}`;

    it(`sitemap includes /${page.slug}`, () => {
      expect(
        citySectionLocs.has(expectedUrl),
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

  /**
   * Inverse guard: every slug in PENDING_CITY_SLUGS must genuinely be absent
   * from the sitemap. If a sitemap entry is added for a pending slug without
   * removing it from the set, this test fails — forcing cleanup.
   * These tests live in the parent describe so the suite is never empty when
   * PENDING_CITY_SLUGS is empty.
   */
  for (const slug of PENDING_CITY_SLUGS) {
    const url = `${SITE_BASE}/${slug}`;
    it(`PENDING city slug "${slug}" is not yet in sitemap (remove from PENDING_CITY_SLUGS once its sitemap entry is added)`, () => {
      expect(
        sitemapLocs.has(url),
        `"${slug}" is listed in PENDING_CITY_SLUGS but its sitemap entry already exists.\n` +
          `Remove "${slug}" from PENDING_CITY_SLUGS in sitemap-provider-coverage.test.ts\n` +
          `so the forward-coverage check is re-enabled.`,
      ).toBe(false);
    });
  }
});

/**
 * Reverse guard: every <loc> listed under the "City landing pages" section
 * of public/sitemap.xml must correspond to a slug that actually exists in
 * src/data/cityPages.ts.
 *
 * This catches the case where a city page is removed or renamed but its
 * sitemap entry is left behind, which would cause search engines to crawl a
 * dead link.
 */
describe("sitemap reverse city coverage (no orphaned entries)", () => {
  const citySectionLocs = loadCitySectionLocs();
  const knownCitySlugs = new Set(cityPages.map((p) => p.slug));

  it("city landing pages section has at least one <loc> entry (sanity check)", () => {
    expect(citySectionLocs.length).toBeGreaterThan(0);
  });

  /**
   * One sub-test per sitemap entry — each fails independently so it's
   * immediately clear which slug has been orphaned.
   */
  for (const loc of citySectionLocs) {
    // Derive the slug by stripping the base URL and any trailing slash.
    const slug = loc
      .replace(`${SITE_BASE}/`, "")
      .replace(/\/$/, "");

    it(`sitemap entry /${slug} maps to a known city page`, () => {
      expect(
        knownCitySlugs.has(slug),
        `sitemap.xml has an orphaned entry for "${slug}" under "City landing pages".\n` +
          `The slug no longer exists in src/data/cityPages.ts.\n` +
          `Either restore the city page or remove this entry from public/sitemap.xml:\n\n` +
          `  <url>\n` +
          `    <loc>${loc}</loc>\n` +
          `    ...\n` +
          `  </url>`,
      ).toBe(true);
    });
  }
});
