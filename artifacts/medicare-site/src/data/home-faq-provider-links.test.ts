/**
 * Home FAQ provider-link guard
 *
 * Each entry in `answerJsxMap` (Home.tsx) contains a `<Link href="...">` that
 * points to a provider page slug.  If a slug is mistyped, or a provider page
 * is later removed or renamed, the home FAQ accordion renders a link that
 * leads to a 404.
 *
 * This test reads the href values from ANSWER_JSX_HREFS (src/data/answerJsxKeys.ts
 * — a plain TS record kept in sync with the <Link> values in Home.tsx) and
 * verifies that every slug resolves to a registered entry in providerPages.ts.
 *
 * One sub-test per entry so the specific offending question is immediately
 * obvious when a check fails.
 *
 * HOW TO FIX A FAILURE:
 *  - If a slug was mistyped in Home.tsx, correct the <Link href="..."> there
 *    and update the matching value in ANSWER_JSX_HREFS in answerJsxKeys.ts.
 *  - If a provider page was renamed or removed, either restore the slug in
 *    providerPages.ts or update the link to point to the new slug.
 */

import { describe, it, expect } from "vitest";
import { ANSWER_JSX_HREFS } from "./answerJsxKeys";
import { providerPages } from "./providerPages";

/** Strip leading and trailing slashes so "/foo-bar/" → "foo-bar" */
function stripSlashes(href: string): string {
  return href.replace(/^\/|\/$/g, "");
}

const registeredSlugs = new Set(providerPages.map((p) => p.slug));

describe("home FAQ provider-link guard", () => {
  it("ANSWER_JSX_HREFS is non-empty (sanity check)", () => {
    expect(Object.keys(ANSWER_JSX_HREFS).length).toBeGreaterThan(0);
  });

  it("providerPages is non-empty (sanity check)", () => {
    expect(providerPages.length).toBeGreaterThan(0);
  });

  /**
   * One sub-test per answerJsxMap entry — each fails independently so it is
   * immediately clear which question has a broken link.
   */
  for (const [question, href] of Object.entries(ANSWER_JSX_HREFS)) {
    it(`"${question}" links to a registered provider page`, () => {
      const slug = stripSlashes(href);
      expect(
        registeredSlugs.has(slug),
        `The home FAQ answer for:\n` +
          `  "${question}"\n` +
          `links to href "${href}" (slug: "${slug}"), but that slug is not ` +
          `registered in src/data/providerPages.ts.\n\n` +
          `Either the href in answerJsxMap (Home.tsx) and ANSWER_JSX_HREFS ` +
          `(answerJsxKeys.ts) is mistyped, or the provider page was removed or ` +
          `renamed.\n\n` +
          `Registered slugs:\n` +
          `  ${[...registeredSlugs].join("\n  ")}`,
      ).toBe(true);
    });
  }
});
