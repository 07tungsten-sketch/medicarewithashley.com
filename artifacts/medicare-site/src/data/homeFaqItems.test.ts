/**
 * Home FAQ schema URL guard
 *
 * For every FAQ answer on the home page that links to a provider page
 * (heuristic: `a` contains "Learn more on the"), the corresponding
 * `schemaText` field MUST contain a full canonical URL in the form
 *   medicare-with-ashley.com/<provider-slug>/
 *
 * This catches a missing or incomplete `schemaText` before it ships, which
 * would cause Google's rich results to surface the answer without a clickable
 * provider-page link.
 *
 * HOW TO USE: When you add a new provider FAQ entry to homeFaqItems.ts whose
 * answer text contains "Learn more on the", also add a `schemaText` field
 * that ends with the full canonical URL, e.g.:
 *   …visit the Foo Health Medicare page at medicare-with-ashley.com/foo-health-medicare-san-diego/.
 */

import { describe, it, expect } from "vitest";
import { homeFaqItems } from "./homeFaqItems";
import { ANSWER_JSX_QUESTION_KEYS } from "./answerJsxKeys";

/** Heuristic: answers that link out to a provider page. */
function isProviderAnswer(a: string): boolean {
  return a.includes("Learn more on the");
}

/** The full-URL pattern Google needs to surface in rich results. */
const CANONICAL_URL_RE = /medicare-with-ashley\.com\/[a-z0-9-]+\//;

describe("home FAQ schema URL guard", () => {
  it("homeFaqItems is non-empty", () => {
    expect(homeFaqItems.length).toBeGreaterThan(0);
  });

  const providerItems = homeFaqItems.filter((item) =>
    isProviderAnswer(item.a),
  );

  it("at least one provider FAQ entry exists (sanity check)", () => {
    expect(providerItems.length).toBeGreaterThan(0);
  });

  /**
   * One sub-test per provider FAQ entry — each fails independently so it is
   * immediately clear which question is missing its schemaText URL.
   */
  for (const item of providerItems) {
    describe(`"${item.q}"`, () => {
      it("has a schemaText field (not relying on the plain `a` text)", () => {
        expect(
          item.schemaText,
          `FAQ answer for "${item.q}" contains "Learn more on the" but has no ` +
            `schemaText override.\n\n` +
            `Add a schemaText field to this entry in src/data/homeFaqItems.ts ` +
            `that ends with the full canonical URL, e.g.:\n` +
            `  …visit the <Provider> Medicare page at medicare-with-ashley.com/<slug>/.`,
        ).toBeDefined();
      });

      it("schemaText contains the full medicare-with-ashley.com URL", () => {
        expect(
          CANONICAL_URL_RE.test(item.schemaText ?? ""),
          `FAQ schemaText for "${item.q}" does not contain a full ` +
            `medicare-with-ashley.com/<slug>/ URL.\n\n` +
            `Current schemaText:\n  ${item.schemaText ?? "(undefined)"}\n\n` +
            `Append the canonical URL to schemaText in src/data/homeFaqItems.ts, e.g.:\n` +
            `  …visit the <Provider> Medicare page at medicare-with-ashley.com/<slug>/.`,
        ).toBe(true);
      });
    });
  }
});

/**
 * answerJsxMap sync guard
 *
 * Every home FAQ item whose answer contains "Learn more on the" is a
 * provider-linked entry that MUST also appear in answerJsxMap (Home.tsx) so
 * the rendered accordion item includes the clickable <Link> to the provider
 * page — not just the plain-text schema version.
 *
 * The canonical list of answerJsxMap keys is maintained in
 * src/data/answerJsxKeys.ts (plain TS, no JSX) so this test file can import
 * it without a JSX transform.
 *
 * HOW TO FIX A FAILURE:
 *  1. Add a JSX entry for the new question in the answerJsxMap object inside
 *     src/pages/Home.tsx.
 *  2. Add the same question string to ANSWER_JSX_QUESTION_KEYS in
 *     src/data/answerJsxKeys.ts.
 * Both steps are required — TypeScript's `satisfies` on answerJsxMap will
 * error if (2) is done without (1), and this test will fail if (1) is done
 * without (2).
 */
describe("answerJsxMap sync guard", () => {
  const answerJsxKeySet = new Set<string>(ANSWER_JSX_QUESTION_KEYS);

  const providerItems = homeFaqItems.filter((item) =>
    item.a.includes("Learn more on the"),
  );

  it("at least one provider FAQ entry exists (sanity check)", () => {
    expect(providerItems.length).toBeGreaterThan(0);
  });

  /**
   * One sub-test per provider FAQ entry — each fails independently so it is
   * immediately clear which question is missing its answerJsx link.
   */
  for (const item of providerItems) {
    it(`answerJsxMap has an entry for "${item.q}"`, () => {
      expect(
        answerJsxKeySet.has(item.q),
        `"${item.q}" has "Learn more on the" in its answer but is missing from ` +
          `ANSWER_JSX_QUESTION_KEYS (src/data/answerJsxKeys.ts).\n\n` +
          `This means the rendered FAQ accordion item will show plain text ` +
          `instead of a clickable provider-page link.\n\n` +
          `To fix:\n` +
          `  1. Add a JSX entry for this question to answerJsxMap in ` +
          `src/pages/Home.tsx.\n` +
          `  2. Add the same question string to ANSWER_JSX_QUESTION_KEYS in ` +
          `src/data/answerJsxKeys.ts.`,
      ).toBe(true);
    });
  }
});
