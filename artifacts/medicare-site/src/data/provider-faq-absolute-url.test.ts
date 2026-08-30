/**
 * Provider page FAQ absolute-URL guard
 *
 * For every provider page registered in providerPages.ts, at least one FAQ
 * answer must contain the page's own absolute URL —
 * https://medicarewithashley.com/<slug>/ — either:
 *   (a) in the `acceptedAnswer.url` field of a head-level faqSchema, or
 *   (b) in the `acceptedAnswer.text` of an inline FAQPage JSON-LD block
 *       embedded in bodyHtml.
 *
 * WHY: Google can surface FAQ rich results only when the schema anchors the
 * answer back to the canonical page URL. A provider page added without the
 * URL anywhere in its FAQ answers would be silently ineligible for rich
 * results and the omission would go undetected without this guard.
 *
 * HOW TO FIX A FAILURE:
 *   • Pages with faqSchema in providerPages.ts — add
 *       url: "https://medicarewithashley.com/<slug>/"
 *     to at least one acceptedAnswer object.
 *   • Pages whose FAQ lives in bodyHtml as an inline <script> — include the
 *     full page URL in at least one answer's "text" value, e.g.:
 *       "...visit https://medicarewithashley.com/<slug>/ for details."
 *
 * PENDING_ABSOLUTE_URL_SLUGS: pages currently tracked by open work items
 * that will add the URL. Remove a slug here once the URL is present.
 */

import { describe, it, expect } from "vitest";
import { providerPages } from "./providerPages";
import type { ProviderPageConfig } from "./providerPages";

const SITE_BASE = "https://medicarewithashley.com";

/**
 * Pages whose FAQ schema does not yet include the absolute URL in any answer.
 * Each entry has an open work item that will add it; the test skips them in
 * the meantime so CI stays green.  Remove a slug once the URL is in place.
 */
const PENDING_ABSOLUTE_URL_SLUGS = new Set<string>([
  // Add slugs here only while an open work item is actively adding the URL.
  // Remove the slug once the URL appears in faqSchema or bodyHtml — the
  // inverse guard below will fail and remind you to clean up.
]);

/** Minimal shape we need from a JSON-LD Answer node. */
interface LdAnswer {
  text?: string;
  url?: string;
}
interface LdQuestion {
  acceptedAnswer?: LdAnswer;
}
interface LdFaqPage {
  "@type": string;
  mainEntity?: LdQuestion[];
}

/**
 * Extract the first FAQPage JSON-LD object embedded in raw HTML, or null if
 * none is found.
 */
function extractInlineFaqSchema(html: string): LdFaqPage | null {
  const scriptMatch = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i.exec(
    html,
  );
  if (!scriptMatch) return null;
  try {
    const parsed = JSON.parse(scriptMatch[1]) as LdFaqPage;
    if (parsed["@type"] === "FAQPage") return parsed;
  } catch {
    // Malformed JSON — let the test report a missing schema rather than crash.
  }
  return null;
}

/**
 * Return true when at least one answer node in a mainEntity array contains
 * `canonicalUrl` in its `url` field or `text` field.
 */
function hasCanonicalUrlInAnswers(
  questions: LdQuestion[],
  canonicalUrl: string,
): boolean {
  return questions.some((q) => {
    const answer = q.acceptedAnswer ?? {};
    return (
      answer.url === canonicalUrl ||
      (answer.text ?? "").includes(canonicalUrl)
    );
  });
}

describe("provider page FAQ: at least one answer contains the absolute page URL", () => {
  it("providerPages list is non-empty", () => {
    expect(providerPages.length).toBeGreaterThan(0);
  });

  for (const page of providerPages) {
    const { slug } = page;
    const canonicalUrl = `${SITE_BASE}/${slug}/`;

    if (PENDING_ABSOLUTE_URL_SLUGS.has(slug)) {
      // Skipped — open work item will add the URL; remove from the set once done.
      continue;
    }

    describe(`/${slug}/`, () => {
      it(`has at least one FAQ answer containing ${canonicalUrl}`, () => {
        // --- Path A: head-level faqSchema in providerPages.ts ---
        if (page.faqSchema) {
          const schema = page.faqSchema as LdFaqPage;
          const questions: LdQuestion[] = schema.mainEntity ?? [];

          expect(
            questions.length,
            `faqSchema.mainEntity for "${slug}" must be a non-empty array`,
          ).toBeGreaterThan(0);

          expect(
            hasCanonicalUrlInAnswers(questions, canonicalUrl),
            `No FAQ answer on /${slug}/ references the page's absolute URL.\n\n` +
              `At least one acceptedAnswer must include either:\n` +
              `  url: "${canonicalUrl}"\n` +
              `or mention "${canonicalUrl}" in its text field.\n\n` +
              `Edit the faqSchema for this page in src/data/providerPages.ts.`,
          ).toBe(true);
          return;
        }

        // --- Path B: inline FAQPage JSON-LD embedded in bodyHtml ---
        const inlineSchema = extractInlineFaqSchema(page.bodyHtml);
        expect(
          inlineSchema,
          `/${slug}/ has neither a faqSchema in providerPages.ts nor an inline\n` +
            `FAQPage JSON-LD in bodyHtml.\n\n` +
            `Add a faqSchema to this page's entry in src/data/providerPages.ts.\n` +
            `Every acceptedAnswer should include:\n` +
            `  url: "${canonicalUrl}"`,
        ).not.toBeNull();

        if (!inlineSchema) return; // narrowing — expect above already fails

        const questions: LdQuestion[] = inlineSchema.mainEntity ?? [];
        expect(
          questions.length,
          `Inline FAQPage mainEntity for "${slug}" must be a non-empty array`,
        ).toBeGreaterThan(0);

        expect(
          hasCanonicalUrlInAnswers(questions, canonicalUrl),
          `No FAQ answer in the inline JSON-LD on /${slug}/ references the page's absolute URL.\n\n` +
            `Include the full URL in at least one answer's "text" field in\n` +
            `src/data/providerBodyHtml.ts, for example:\n` +
            `  "...visit ${canonicalUrl} for details."`,
        ).toBe(true);
      });
    });
  }
});

/**
 * Inverse guard: every slug in PENDING_ABSOLUTE_URL_SLUGS must genuinely
 * lack the canonical URL in its FAQ answers.
 *
 * WHY: If a slug stays in the set after its URL has been added, the primary
 * guard above silently skips that page forever. This block catches the stale
 * entry — it fails as soon as the URL appears, forcing the developer to remove
 * the slug from PENDING_ABSOLUTE_URL_SLUGS and re-activate the primary guard.
 *
 * HOW TO FIX A FAILURE HERE:
 *   The page now has its canonical URL in an FAQ answer — great! Remove the
 *   slug from PENDING_ABSOLUTE_URL_SLUGS at the top of this file so the
 *   primary guard above starts enforcing it again.
 */
describe("PENDING_ABSOLUTE_URL_SLUGS inverse guard: pending slugs must not yet have the URL", () => {
  it("PENDING_ABSOLUTE_URL_SLUGS set is recognized (may be empty)", () => {
    expect(PENDING_ABSOLUTE_URL_SLUGS instanceof Set).toBe(true);
  });

  for (const slug of PENDING_ABSOLUTE_URL_SLUGS) {
    const canonicalUrl = `${SITE_BASE}/${slug}/`;

    describe(`/${slug}/ (pending)`, () => {
      it(`does NOT yet have the canonical URL ${canonicalUrl} in any FAQ answer — remove from PENDING_ABSOLUTE_URL_SLUGS once added`, () => {
        const page: ProviderPageConfig | undefined = providerPages.find(
          (p) => p.slug === slug,
        );

        expect(
          page,
          `Slug "${slug}" is in PENDING_ABSOLUTE_URL_SLUGS but not found in providerPages. ` +
            `Remove it from the set.`,
        ).toBeDefined();

        if (!page) return; // narrowing — expect above already fails

        // Check head-level faqSchema first.
        if (page.faqSchema) {
          const schema = page.faqSchema as LdFaqPage;
          const questions: LdQuestion[] = schema.mainEntity ?? [];
          const alreadyPresent = hasCanonicalUrlInAnswers(questions, canonicalUrl);

          expect(
            alreadyPresent,
            `"${slug}" is in PENDING_ABSOLUTE_URL_SLUGS but its faqSchema already ` +
              `contains the canonical URL ${canonicalUrl}.\n\n` +
              `Remove "${slug}" from PENDING_ABSOLUTE_URL_SLUGS so the primary guard ` +
              `enforces this page.`,
          ).toBe(false);
          return;
        }

        // Check inline JSON-LD in bodyHtml.
        const inlineSchema = extractInlineFaqSchema(page.bodyHtml);
        if (inlineSchema) {
          const questions: LdQuestion[] = inlineSchema.mainEntity ?? [];
          const alreadyPresent = hasCanonicalUrlInAnswers(questions, canonicalUrl);

          expect(
            alreadyPresent,
            `"${slug}" is in PENDING_ABSOLUTE_URL_SLUGS but its inline JSON-LD already ` +
              `contains the canonical URL ${canonicalUrl}.\n\n` +
              `Remove "${slug}" from PENDING_ABSOLUTE_URL_SLUGS so the primary guard ` +
              `enforces this page.`,
          ).toBe(false);
        }
        // If neither schema exists, the page is legitimately pending — nothing to assert.
      });
    });
  }
});
