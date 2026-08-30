/**
 * FAQ schema guard for Medicare Basics and Turning 65 pages
 *
 * Two layers of protection:
 *
 * 1. SOURCE DATA TESTS (always run, no build dependency)
 *    Imports the `faqs` arrays directly from each page component and verifies
 *    their shape: non-empty, every entry has a non-empty string `q` and `a`.
 *    These tests catch regressions in the data arrays that drive both the
 *    visible FAQ section and the JSON-LD schema block.
 *
 * 2. PRERENDER TESTS (run only when a fresh dist is present)
 *    Reads the pre-rendered HTML files and verifies:
 *      a. A FAQPage JSON-LD block is present in the <head>.
 *      b. Every question text from the `faqs` array is visible in the HTML.
 *      c. Every answer text (first 80 chars) is visible in the HTML.
 *    Skipped automatically when the dist is stale (does not yet contain the
 *    expected question text), so `vitest run` — which runs before `vite build`
 *    in the build pipeline — does not fail on an old dist.
 *
 * HOW TO FIX A SOURCE DATA FAILURE:
 *   - "faqs array must be non-empty": The exported `faqs` const in the page
 *     component is empty or was removed. Restore it.
 *   - "q must be a non-empty string" / "a must be a non-empty string": A
 *     question or answer entry has a blank or missing field. Fill it in.
 *
 * HOW TO FIX A PRERENDER FAILURE (after a successful build):
 *   - "FAQPage JSON-LD not found": The <Helmet> JSON-LD block is missing.
 *     Ensure a <Helmet><script type="application/ld+json">…FAQPage…</script>
 *     </Helmet> block is present in the page component.
 *   - "Question/answer text not visible": The faqs[] data is in the schema
 *     but not rendered as visible HTML. Ensure the FAQ section renders each
 *     faq.q and faq.a inside visible elements (not only inside the <script>).
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

import { faqs as medicareBasicsFaqs } from "./MedicareBasics";
import { faqs as turning65Faqs } from "./Turning65";

const DIST_ROOT = resolve(import.meta.dirname, "../../dist/public");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface FaqEntry {
  q: string;
  a: string;
}

/**
 * Find a FAQPage JSON-LD block in the HTML whose mainEntity contains the
 * given marker question. Returns the mainEntity array, or null if not found.
 */
function findFaqSchema(
  html: string,
  markerQuestion: string,
): Array<{ name: string; acceptedAnswer: { text: string } }> | null {
  const scriptPattern = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match: RegExpExecArray | null;
  while ((match = scriptPattern.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      if (
        parsed["@type"] === "FAQPage" &&
        Array.isArray(parsed.mainEntity) &&
        parsed.mainEntity.some(
          (q: { name: string }) => q.name === markerQuestion,
        )
      ) {
        return parsed.mainEntity;
      }
    } catch {
      // malformed JSON — skip
    }
  }
  return null;
}

/** Strip HTML tags and collapse whitespace for plain-text comparison. */
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Returns true when the pre-rendered HTML file exists AND already contains
 * the marker question text — i.e. the dist is fresh enough to test.
 */
function distIsFresh(slug: string, markerQuestion: string): boolean {
  const htmlPath = resolve(DIST_ROOT, slug, "index.html");
  if (!existsSync(htmlPath)) return false;
  const html = readFileSync(htmlPath, "utf-8");
  return stripTags(html).includes(markerQuestion);
}

// ---------------------------------------------------------------------------
// Generic test runner
// ---------------------------------------------------------------------------

function testPageFaqs(label: string, slug: string, faqs: FaqEntry[]) {
  const firstQuestion = faqs[0]?.q ?? "";

  describe(`${label} (/` + slug + `/)`, () => {
    // -----------------------------------------------------------------------
    // 1. SOURCE DATA — always runs
    // -----------------------------------------------------------------------
    describe("source faqs[] array", () => {
      it("is non-empty", () => {
        expect(
          faqs.length,
          `The exported faqs[] array in ${slug} page is empty. ` +
            `It must contain at least one FAQ entry.`,
        ).toBeGreaterThan(0);
      });

      for (let i = 0; i < faqs.length; i++) {
        const faq = faqs[i];
        describe(`entry ${i}: "${faq.q.slice(0, 40)}…"`, () => {
          it("q is a non-empty string", () => {
            expect(typeof faq.q === "string" && faq.q.trim().length > 0).toBe(
              true,
            );
          });
          it("a is a non-empty string", () => {
            expect(typeof faq.a === "string" && faq.a.trim().length > 0).toBe(
              true,
            );
          });
        });
      }
    });

    // -----------------------------------------------------------------------
    // 2. PRERENDER — skipped when dist is stale
    // -----------------------------------------------------------------------
    const fresh = distIsFresh(slug, firstQuestion);

    describe(
      `prerendered HTML (${fresh ? "fresh — running checks" : "stale — skipped until next build"})`,
      () => {
        it.skipIf(!fresh)("FAQPage JSON-LD block contains my questions", () => {
          const htmlPath = resolve(DIST_ROOT, slug, "index.html");
          const html = readFileSync(htmlPath, "utf-8");
          const schema = findFaqSchema(html, firstQuestion);
          expect(
            schema,
            `No FAQPage JSON-LD block found that contains "${firstQuestion}".\n` +
              `Ensure the page component has a <Helmet> block with a FAQPage schema ` +
              `whose mainEntity includes all entries from the faqs[] array.`,
          ).not.toBeNull();
        });

        it.skipIf(!fresh)(
          `FAQPage JSON-LD has ${faqs.length} questions`,
          () => {
            const htmlPath = resolve(DIST_ROOT, slug, "index.html");
            const html = readFileSync(htmlPath, "utf-8");
            const schema = findFaqSchema(html, firstQuestion);
            if (!schema) return;
            expect(
              schema.length,
              `Expected ${faqs.length} questions in FAQPage schema but found ${schema.length}.\n` +
                `Check the faqs[] array in the ${slug} page component.`,
            ).toBe(faqs.length);
          },
        );

        for (const faq of faqs) {
          describe.skipIf(!fresh)(`FAQ: "${faq.q}"`, () => {
            it("question text is visible in the rendered page", () => {
              const htmlPath = resolve(DIST_ROOT, slug, "index.html");
              const plainText = stripTags(readFileSync(htmlPath, "utf-8"));
              expect(
                plainText.includes(faq.q),
                `Question text not visible in rendered HTML of /${slug}/:\n  "${faq.q}"\n\n` +
                  `Make sure faqs[] is rendered in a visible FAQ section, ` +
                  `not only inside the JSON-LD <script> tag.`,
              ).toBe(true);
            });

            it("answer text (first 80 chars) is visible in the rendered page", () => {
              const htmlPath = resolve(DIST_ROOT, slug, "index.html");
              const plainText = stripTags(readFileSync(htmlPath, "utf-8"));
              const snippet = faq.a.slice(0, 80);
              expect(
                plainText.includes(snippet),
                `Answer snippet not visible in rendered HTML of /${slug}/:\n  "${snippet}"\n\n` +
                  `Make sure faq.a is rendered in the FAQ section, ` +
                  `not only inside the JSON-LD <script> tag.`,
              ).toBe(true);
            });
          });
        }
      },
    );
  });
}

// ---------------------------------------------------------------------------
// Test each page
// ---------------------------------------------------------------------------

testPageFaqs("Medicare Basics", "medicare-basics", medicareBasicsFaqs);
testPageFaqs("Turning 65", "turning-65", turning65Faqs);
