/**
 * Bidirectional backlink integrity check.
 *
 * For every city page that a provider page links to (inside a
 * <!-- city-backlinks* --> block), the city page's
 * <!-- city-hospital-links --> section must contain a link back to
 * that provider page.
 *
 * This catches accidental omissions in cityBodyHtml.ts before they ship.
 *
 * The city slug → HTML map is derived automatically from the named exports
 * in cityBodyHtml.ts: any export whose name ends in "BodyHtml" is treated as
 * a city page and its slug is inferred by converting the camelCase prefix to
 * kebab-case and prepending "medicare-broker-".  Adding a new city export to
 * cityBodyHtml.ts is therefore picked up by this test with no manual step.
 */

import { describe, it, expect } from "vitest";

import * as cityBodyHtmlModule from "../data/cityBodyHtml";
import {
  providerPages,
  type ProviderPageConfig,
} from "../data/providerPages";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalize a URL slug: strip leading slash and trailing slash. */
function normalizeSlug(href: string): string {
  return href.replace(/^\//, "").replace(/\/$/, "");
}

/**
 * Convert a body HTML export name to its URL slug.
 *
 * Examples:
 *   chulaVistaBodyHtml  → medicare-broker-chula-vista
 *   nationalCityBodyHtml → medicare-broker-national-city
 *   southBayBodyHtml    → medicare-broker-south-bay
 */
function exportNameToSlug(exportName: string): string {
  // Strip the BodyHtml suffix, then convert camelCase → kebab-case.
  const base = exportName.replace(/BodyHtml$/, "");
  const kebab = base
    .replace(/([A-Z])/g, (ch) => `-${ch.toLowerCase()}`)
    .replace(/^-/, ""); // guard against a leading capital (shouldn't happen)
  return `medicare-broker-${kebab}`;
}

/**
 * Extract all href slugs that appear inside a <!-- city-backlinks* --> block.
 * Handles all variants: city-backlinks, city-backlinks-scripps, etc.
 */
function extractCityBacklinkSlugs(providerHtml: string): string[] {
  // Match the content between <!-- city-backlinks... --> and <!-- /city-backlinks... -->
  // Use \S* so that suffixes like -scripps, -ucsd, -alvarado, -paradise-valley are matched.
  const sectionMatch = providerHtml.match(
    /<!--\s*city-backlinks\S*\s*-->([\s\S]*?)<!--\s*\/city-backlinks\S*\s*-->/
  );
  if (!sectionMatch) return [];

  const section = sectionMatch[1];
  const slugs: string[] = [];
  const hrefRegex = /href="(\/[^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = hrefRegex.exec(section)) !== null) {
    slugs.push(normalizeSlug(m[1]));
  }
  return slugs;
}

/**
 * Extract the raw HTML inside <!-- city-hospital-links --> … <!-- /city-hospital-links -->.
 * Returns an empty string if the section is missing.
 */
function extractCityHospitalLinksSection(cityHtml: string): string {
  const match = cityHtml.match(
    /<!--\s*city-hospital-links\s*-->([\s\S]*?)<!--\s*\/city-hospital-links\s*-->/
  );
  return match ? match[1] : "";
}

// ---------------------------------------------------------------------------
// Data tables
// ---------------------------------------------------------------------------

/**
 * City slug (no leading/trailing slash) → city body HTML export.
 *
 * Derived automatically from every named export in cityBodyHtml.ts whose name
 * ends in "BodyHtml".  No manual registration required when adding a new city.
 */
const citySlugToHtml: Record<string, string> = Object.fromEntries(
  Object.entries(cityBodyHtmlModule)
    .filter(([name]) => name.endsWith("BodyHtml"))
    .map(([name, html]) => [exportNameToSlug(name), html as string])
);

type BacklinkProvider = {
  name: string;
  providerUrl: string;
  html: string;
};

/**
 * Find registered provider pages with city backlinks.
 *
 * providerPages.ts is the source of truth for provider routes. Pages without
 * a city-backlinks block (such as the hospital hub and unrelated insurance
 * pages) have no city ↔ provider relationship for this test to validate.
 */
function getProvidersWithCityBacklinks(
  pages: ReadonlyArray<Pick<ProviderPageConfig, "slug" | "title" | "bodyHtml">>
): BacklinkProvider[] {
  return pages
    .filter(
      (page) => /<!--\s*city-backlinks\S*\s*-->/.test(page.bodyHtml)
    )
    .map((page) => ({
      name: page.title,
      providerUrl: `/${page.slug}`,
      html: page.bodyHtml,
    }));
}

const providers = getProvidersWithCityBacklinks(providerPages);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("City ↔ provider bidirectional backlink integrity", () => {
  it("uses each registered provider route, even with a non-conventional body export name", () => {
    const [provider] = getProvidersWithCityBacklinks([
      {
        slug: "preferred-provider-route",
        title: "Preferred Provider",
        bodyHtml:
          '<!-- city-backlinks --><a href="/medicare-broker-example/">Example</a><!-- /city-backlinks -->',
      },
    ]);

    expect(provider).toMatchObject({
      name: "Preferred Provider",
      providerUrl: "/preferred-provider-route",
    });
  });

  for (const provider of providers) {
    const linkedCitySlugs = extractCityBacklinkSlugs(provider.html);

    it(`${provider.name} city-backlinks block is present and non-empty`, () => {
      expect(linkedCitySlugs.length).toBeGreaterThan(0);
    });

    for (const citySlug of linkedCitySlugs) {
      const cityHtml = citySlugToHtml[citySlug];

      it(`${citySlug} — city-hospital-links section exists`, () => {
        expect(
          cityHtml,
          `No city body HTML found for slug "${citySlug}" — ` +
            `add an export named "${citySlug
              .replace(/^medicare-broker-/, "")
              .replace(/-([a-z])/g, (_, c) => c.toUpperCase())}BodyHtml" ` +
            `to cityBodyHtml.ts`
        ).toBeDefined();

        const hospitalLinksSection = extractCityHospitalLinksSection(cityHtml);
        expect(
          hospitalLinksSection,
          `/${citySlug}/ is missing a <!-- city-hospital-links --> section in cityBodyHtml.ts`
        ).not.toBe("");
      });

      it(`${citySlug} — links back to ${provider.name} (${provider.providerUrl})`, () => {
        expect(
          cityHtml,
          `No city body HTML found for slug "${citySlug}" — ` +
            `add an export named "${citySlug
              .replace(/^medicare-broker-/, "")
              .replace(/-([a-z])/g, (_, c) => c.toUpperCase())}BodyHtml" ` +
            `to cityBodyHtml.ts`
        ).toBeDefined();

        const hospitalLinksSection = extractCityHospitalLinksSection(cityHtml);

        // Match both with and without trailing slash
        const providerSlug = normalizeSlug(provider.providerUrl);
        const linkPattern = new RegExp(
          `href="/${providerSlug}/?"`
        );

        expect(
          linkPattern.test(hospitalLinksSection),
          `/${citySlug}/ city-hospital-links is missing a link to ` +
            `${provider.providerUrl} (required because ${provider.name} ` +
            `links to this city in its city-backlinks block)`
        ).toBe(true);
      });
    }
  }
});
