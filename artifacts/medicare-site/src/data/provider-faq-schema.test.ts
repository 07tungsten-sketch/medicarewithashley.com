/**
 * Provider page FAQ schema guard
 *
 * For each provider page that declares a `faqSchema` in providerPages.ts:
 *   1. Every Answer must include an absolute `url` field pointing to the
 *      page's canonical URL (https://medicarewithashley.com/<slug>/).
 *   2. The page's body HTML must NOT contain a duplicate inline
 *      `<script type="application/ld+json">` FAQPage block, which would
 *      create conflicting structured data and may cause Google to surface
 *      the URL-less version.
 *
 * HOW TO USE: When you add or update `faqSchema` on a provider page, make
 * sure every `acceptedAnswer` object has a `url` field matching the page's
 * canonical URL, and remove any corresponding inline JSON-LD script from
 * the bodyHtml source.
 *
 * COVERAGE GUARD: The "all provider pages must have faqSchema" describe block
 * below iterates every entry in providerPages. Pages that have not yet
 * received their faqSchema entry are listed in PENDING_FAQ_SLUGS with a note
 * pointing to the work item that will add it. Remove a slug from that list
 * once its faqSchema is in place — the test will then enforce it going forward.
 */

import { describe, it, expect } from "vitest";
import { providerPages } from "./providerPages";

const SITE_BASE = "https://medicarewithashley.com";

/** Shape of a FAQPage JSON-LD object as used in providerPages. */
interface FaqAnswer {
  "@type": string;
  text: string;
  url?: string;
}
interface FaqQuestion {
  "@type": string;
  name: string;
  acceptedAnswer: FaqAnswer;
}
interface FaqSchema {
  "@type": string;
  mainEntity: FaqQuestion[];
}

/** Pages that must have faqSchema (the five fixed in task #92). */
const REQUIRED_FAQ_SLUGS = [
  "scripps-health-medicare-san-diego",
  "uc-san-diego-health-medicare",
  "kaiser-permanente-medicare-san-diego",
  "palomar-health-medicare-san-diego",
  "medicare-dental-vision-hearing-san-diego",
];

describe("provider page FAQ schema", () => {
  it("providerPages list is non-empty", () => {
    expect(providerPages.length).toBeGreaterThan(0);
  });

  for (const slug of REQUIRED_FAQ_SLUGS) {
    describe(`/${slug}/`, () => {
      const page = providerPages.find((p) => p.slug === slug);

      it("has a faqSchema entry in providerPages", () => {
        expect(
          page,
          `No provider page found for slug "${slug}" in providerPages.ts`,
        ).toBeDefined();
        expect(
          page?.faqSchema,
          `"${slug}" is missing a faqSchema entry.\n\n` +
            `Add a faqSchema object to its entry in src/data/providerPages.ts.\n` +
            `See the Scripps or Alvarado entries for the expected shape.`,
        ).toBeDefined();
      });

      if (!page?.faqSchema) return;

      const schema = page.faqSchema as FaqSchema;
      const canonicalUrl = `${SITE_BASE}/${slug}/`;

      it("faqSchema has at least one question", () => {
        expect(
          Array.isArray(schema.mainEntity) && schema.mainEntity.length > 0,
          `faqSchema.mainEntity for "${slug}" must be a non-empty array of questions`,
        ).toBe(true);
      });

      for (const question of schema.mainEntity ?? []) {
        describe(`answer to "${question.name}"`, () => {
          it("has an acceptedAnswer.url field", () => {
            expect(
              question.acceptedAnswer?.url,
              `FAQ answer for "${question.name}" on /${slug}/ is missing the ` +
                `"url" field.\n\n` +
                `Add:\n  url: "${canonicalUrl}"\n` +
                `inside acceptedAnswer in src/data/providerPages.ts.`,
            ).toBeDefined();
          });

          it(`acceptedAnswer.url is the canonical page URL (${canonicalUrl})`, () => {
            expect(
              question.acceptedAnswer?.url,
              `FAQ answer for "${question.name}" on /${slug}/ has the wrong url.\n\n` +
                `Expected: "${canonicalUrl}"\n` +
                `Got:      "${question.acceptedAnswer?.url}"`,
            ).toBe(canonicalUrl);
          });
        });
      }

      it("bodyHtml does NOT contain a duplicate inline FAQPage JSON-LD script", () => {
        const hasInlineScript =
          page.bodyHtml.includes('<script type="application/ld+json">') &&
          page.bodyHtml.includes('"FAQPage"');
        expect(
          hasInlineScript,
          `/${slug}/ still has an inline FAQPage JSON-LD block in its bodyHtml.\n\n` +
            `Remove the <script type="application/ld+json"> block from the ` +
            `corresponding entry in src/data/providerBodyHtml.ts.\n` +
            `The head-level faqSchema (via SEOHead) is now the single source of truth.`,
        ).toBe(false);
      });
    });
  }
});

/**
 * Coverage guard: every provider page must have a head-level faqSchema.
 *
 * When a new provider page is added to providerPages.ts without a `faqSchema`
 * entry, its FAQ structured data is silently absent from Google's Rich Results.
 * This test catches that omission at CI time.
 *
 * HOW TO FIX A FAILURE: Add a `faqSchema` object to the failing page's entry
 * in src/data/providerPages.ts. See the Scripps or Alvarado entries for the
 * expected shape (FAQPage JSON-LD with at least one mainEntity question and a
 * `url` field on every acceptedAnswer pointing to the page's canonical URL).
 *
 * PENDING_FAQ_SLUGS lists pages that have not yet received their faqSchema.
 * Remove a slug from this list once its faqSchema is added — the test will
 * then enforce it permanently.
 */

/**
 * Slugs whose faqSchema is tracked by an open work item.
 * Each entry should be removed once the faqSchema is added to providerPages.ts.
 */
const PENDING_FAQ_SLUGS = new Set<string>([]);

describe("all provider pages must have a head-level faqSchema", () => {
  it("providerPages list is non-empty", () => {
    expect(providerPages.length).toBeGreaterThan(0);
  });

  for (const page of providerPages) {
    const { slug } = page;

    // Pages listed in PENDING_FAQ_SLUGS are tracked by open work items; skip
    // them so the build stays green while the schema is being added. Remove a
    // slug from the set once its faqSchema lands in providerPages.ts.
    if (!PENDING_FAQ_SLUGS.has(slug)) {
      describe(`/${slug}/`, () => {
        const canonicalUrl = `${SITE_BASE}/${slug}/`;

        it("has a faqSchema entry", () => {
          expect(
            page.faqSchema,
            `"${slug}" is missing a faqSchema entry in src/data/providerPages.ts.\n\n` +
              `Add a faqSchema object to this page's entry. See the Scripps or ` +
              `Alvarado entries for the expected shape.\n` +
              `Every acceptedAnswer must include:\n` +
              `  url: "${canonicalUrl}"`,
          ).toBeDefined();
        });

        const schema = page.faqSchema as FaqSchema | undefined;

        if (schema) {
          it("faqSchema has at least one mainEntity question", () => {
            expect(
              Array.isArray(schema.mainEntity) && schema.mainEntity.length > 0,
              `faqSchema.mainEntity for "${slug}" must be a non-empty array of questions`,
            ).toBe(true);
          });

          it(`faqSchema top-level url is the canonical page URL (${canonicalUrl})`, () => {
            const schemaWithUrl = page.faqSchema as FaqSchema & { url?: string };
            expect(
              schemaWithUrl.url,
              `faqSchema for "${slug}" is missing the top-level "url" field.\n\n` +
                `Add:\n  url: "${canonicalUrl}"\n` +
                `at the top level of the faqSchema object in src/data/providerPages.ts.`,
            ).toBe(canonicalUrl);
          });

          for (const question of schema.mainEntity ?? []) {
            describe(`answer to "${question.name}"`, () => {
              it("has an acceptedAnswer.url field", () => {
                expect(
                  question.acceptedAnswer?.url,
                  `FAQ answer for "${question.name}" on /${slug}/ is missing the ` +
                    `"url" field.\n\n` +
                    `Add:\n  url: "${canonicalUrl}"\n` +
                    `inside acceptedAnswer in src/data/providerPages.ts.`,
                ).toBeDefined();
              });

              it(`acceptedAnswer.url equals the canonical page URL (${canonicalUrl})`, () => {
                expect(
                  question.acceptedAnswer?.url,
                  `FAQ answer for "${question.name}" on /${slug}/ has the wrong url.\n\n` +
                    `Expected: "${canonicalUrl}"\n` +
                    `Got:      "${question.acceptedAnswer?.url}"`,
                ).toBe(canonicalUrl);
              });
            });
          }
        }
      });
    }
  }
});

/**
 * Parse the visible FAQ entries from a body HTML string.
 *
 * Locates the "Frequently asked questions" <h2> heading, then extracts every
 * <h3>question</h3><p>answer</p> pair that follows it (up to the next <h2> or
 * end of string). HTML tags are stripped from both question and answer text so
 * comparisons work against plain-text schema values.
 */
function parseVisibleFaqEntries(
  bodyHtml: string,
): Array<{ question: string; answer: string }> {
  const headingMatch = bodyHtml.match(
    /<h2[^>]*>\s*Frequently asked questions\s*<\/h2>/i,
  );
  if (!headingMatch) return [];

  // Only look at the portion of the HTML after the FAQ heading.
  const afterHeading = bodyHtml.slice(
    (headingMatch.index ?? 0) + headingMatch[0].length,
  );

  // Stop at the next <h2> so we don't bleed into unrelated sections.
  const nextH2Index = afterHeading.search(/<h2[^>]*>/i);
  const faqSection =
    nextH2Index === -1 ? afterHeading : afterHeading.slice(0, nextH2Index);

  const entries: Array<{ question: string; answer: string }> = [];
  const pairRegex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = pairRegex.exec(faqSection)) !== null) {
    entries.push({
      question: match[1].replace(/<[^>]+>/g, "").trim(),
      answer: match[2].replace(/<[^>]+>/g, "").trim(),
    });
  }
  return entries;
}

/**
 * Tri-City Medical Center FAQ schema ↔ body HTML sync guard
 *
 * Enforces a bidirectional sync between the faqSchema defined in
 * providerPages.ts and the visible FAQ section rendered in the body HTML:
 *
 *   • Question count must match — catches a visible FAQ added without a schema
 *     entry, or a schema entry added without a visible question.
 *   • Every schema answer text must be non-empty.
 *   • Every schema question must have a matching visible <h3> question, and the
 *     schema answer text must appear inside the stripped visible <p> answer.
 *   • Every visible <h3> question must have a matching schema question.
 *
 * HOW TO FIX A FAILURE:
 *   - Updated faqSchema answer text? Also update the matching <p> inside the
 *     "Frequently asked questions" section of triCityMedicalCenterMedicareBodyHtml
 *     in src/data/providerBodyHtml.ts.
 *   - Updated the body HTML answer? Also update acceptedAnswer.text for that
 *     question in the tri-city-medical-center-medicare faqSchema entry in
 *     src/data/providerPages.ts.
 *   - Added a visible FAQ? Add the matching entry to faqSchema.mainEntity.
 *   - Added a schema entry? Add the matching <h3>/<p> pair to the body HTML.
 */
describe("Tri-City Medical Center FAQ schema ↔ body HTML sync", () => {
  const TRICTY_SLUG = "tri-city-medical-center-medicare";
  const triCityPage = providerPages.find((p) => p.slug === TRICTY_SLUG);

  it("Tri-City page exists in providerPages", () => {
    expect(
      triCityPage,
      `No provider page found for slug "${TRICTY_SLUG}" in providerPages.ts`,
    ).toBeDefined();
  });

  it("Tri-City page has a faqSchema", () => {
    expect(
      triCityPage?.faqSchema,
      `"${TRICTY_SLUG}" is missing a faqSchema. Add one to providerPages.ts.`,
    ).toBeDefined();
  });

  if (!triCityPage?.faqSchema) return;

  const triCitySchema = triCityPage.faqSchema as FaqSchema;

  it("Tri-City faqSchema has at least one question", () => {
    expect(
      Array.isArray(triCitySchema.mainEntity) &&
        triCitySchema.mainEntity.length > 0,
      "faqSchema.mainEntity for tri-city-medical-center-medicare must be a non-empty array",
    ).toBe(true);
  });

  it("Tri-City body HTML does NOT contain a duplicate inline FAQPage JSON-LD script", () => {
    const hasInlineScript =
      triCityPage.bodyHtml.includes('<script type="application/ld+json">') &&
      triCityPage.bodyHtml.includes('"FAQPage"');
    expect(
      hasInlineScript,
      `/tri-city-medical-center-medicare/ still has an inline FAQPage JSON-LD block in its bodyHtml.\n\n` +
        `Remove the <script type="application/ld+json"> block from triCityMedicalCenterMedicareBodyHtml ` +
        `in src/data/providerBodyHtml.ts. The head-level faqSchema is the single source of truth.`,
    ).toBe(false);
  });

  // Parse the visible FAQ section once so all subsequent checks share it.
  const visibleEntries = parseVisibleFaqEntries(triCityPage.bodyHtml);

  it('body HTML contains a "Frequently asked questions" section with at least one entry', () => {
    expect(
      visibleEntries.length,
      `Could not find a "Frequently asked questions" <h2> section with <h3>/<p> pairs ` +
        `in triCityMedicalCenterMedicareBodyHtml.\n\n` +
        `Make sure the body HTML includes an <h2>Frequently asked questions</h2> heading ` +
        `followed by <h3>question</h3><p>answer</p> pairs.`,
    ).toBeGreaterThan(0);
  });

  it("visible FAQ question count matches faqSchema.mainEntity count (bidirectional sync)", () => {
    expect(
      visibleEntries.length,
      `Visible FAQ entries in body HTML (${visibleEntries.length}) does not match ` +
        `faqSchema.mainEntity length (${triCitySchema.mainEntity.length}).\n\n` +
        `Add or remove entries on both sides to keep them in sync.\n` +
        `Visible questions found: ${visibleEntries.map((e) => `"${e.question}"`).join(", ")}\n` +
        `Schema questions: ${triCitySchema.mainEntity.map((q) => `"${q.name}"`).join(", ")}`,
    ).toBe(triCitySchema.mainEntity.length);
  });

  // --- Schema → body direction: every schema entry must appear visibly ---
  for (const question of triCitySchema.mainEntity) {
    describe(`schema → body: "${question.name}"`, () => {
      it("schema answer text is non-empty", () => {
        expect(
          question.acceptedAnswer?.text,
          `faqSchema answer text for "${question.name}" is empty or missing.\n\n` +
            `Set a non-empty text value in the tri-city-medical-center-medicare faqSchema ` +
            `entry in src/data/providerPages.ts.`,
        ).toBeTruthy();
      });

      it("has a matching visible <h3> question in the FAQ section", () => {
        const match = visibleEntries.find(
          (e) => e.question === question.name,
        );
        expect(
          match,
          `No visible <h3> question matching "${question.name}" was found in the ` +
            `"Frequently asked questions" section of triCityMedicalCenterMedicareBodyHtml.\n\n` +
            `Add a matching <h3>${question.name}</h3> heading to the body HTML FAQ section, ` +
            `or update the schema question name to match the existing visible heading.`,
        ).toBeDefined();
      });

      it("schema answer text is contained in the visible answer paragraph", () => {
        const schemaText = question.acceptedAnswer?.text ?? "";
        const visibleAnswer =
          visibleEntries.find((e) => e.question === question.name)?.answer ??
          "";
        expect(
          visibleAnswer.includes(schemaText),
          `Schema answer text for "${question.name}" does not appear inside the ` +
            `visible answer paragraph.\n\n` +
            `Schema text (from providerPages.ts):\n  "${schemaText}"\n\n` +
            `Visible answer (from providerBodyHtml.ts, tags stripped):\n  "${visibleAnswer}"\n\n` +
            `Update one side so they are in sync. The schema text must be a substring ` +
            `of the visible answer (the body may append extra context such as a link).`,
        ).toBe(true);
      });
    });
  }

  // --- Body → schema direction: every visible question must have a schema entry ---
  for (const entry of visibleEntries) {
    describe(`body → schema: "${entry.question}"`, () => {
      it("has a matching schema question in faqSchema.mainEntity", () => {
        const match = triCitySchema.mainEntity.find(
          (q) => q.name === entry.question,
        );
        expect(
          match,
          `Visible FAQ question "${entry.question}" in the body HTML has no matching entry ` +
            `in faqSchema.mainEntity.\n\n` +
            `Add a new Question entry for "${entry.question}" to the ` +
            `tri-city-medical-center-medicare faqSchema in src/data/providerPages.ts, ` +
            `or remove the visible question from providerBodyHtml.ts if it was added by mistake.`,
        ).toBeDefined();
      });
    });
  }
});

/**
 * San Diego Hospitals Medicare FAQ schema ↔ body HTML sync guard
 *
 * Enforces a bidirectional sync between the faqSchema defined in
 * providerPages.ts and the visible FAQ section rendered in the body HTML for
 * the san-diego-hospitals-medicare hub page:
 *
 *   • Question count must match.
 *   • Every schema answer text must be non-empty.
 *   • Every schema question must have a matching visible <h3> question, and the
 *     schema answer text must appear inside the stripped visible <p> answer.
 *   • Every visible <h3> question must have a matching schema question.
 *
 * HOW TO FIX A FAILURE:
 *   - Updated faqSchema answer text? Also update the matching <p> inside the
 *     "Frequently asked questions" section of sanDiegoHospitalsMedicareBodyHtml
 *     in src/data/providerBodyHtml.ts.
 *   - Updated the body HTML answer? Also update acceptedAnswer.text for that
 *     question in the san-diego-hospitals-medicare faqSchema entry in
 *     src/data/providerPages.ts.
 *   - Added a visible FAQ? Add the matching entry to faqSchema.mainEntity.
 *   - Added a schema entry? Add the matching <h3>/<p> pair to the body HTML.
 */
describe("San Diego Hospitals Medicare FAQ schema ↔ body HTML sync", () => {
  const SD_HOSPITALS_SLUG = "san-diego-hospitals-medicare";
  const sdHospitalsPage = providerPages.find((p) => p.slug === SD_HOSPITALS_SLUG);

  it("San Diego Hospitals page exists in providerPages", () => {
    expect(
      sdHospitalsPage,
      `No provider page found for slug "${SD_HOSPITALS_SLUG}" in providerPages.ts`,
    ).toBeDefined();
  });

  it("San Diego Hospitals page has a faqSchema", () => {
    expect(
      sdHospitalsPage?.faqSchema,
      `"${SD_HOSPITALS_SLUG}" is missing a faqSchema. Add one to providerPages.ts.`,
    ).toBeDefined();
  });

  if (!sdHospitalsPage?.faqSchema) return;

  const sdHospitalsSchema = sdHospitalsPage.faqSchema as FaqSchema;

  it("San Diego Hospitals faqSchema has at least one question", () => {
    expect(
      Array.isArray(sdHospitalsSchema.mainEntity) &&
        sdHospitalsSchema.mainEntity.length > 0,
      "faqSchema.mainEntity for san-diego-hospitals-medicare must be a non-empty array",
    ).toBe(true);
  });

  it("San Diego Hospitals body HTML does NOT contain a duplicate inline FAQPage JSON-LD script", () => {
    const hasInlineScript =
      sdHospitalsPage.bodyHtml.includes('<script type="application/ld+json">') &&
      sdHospitalsPage.bodyHtml.includes('"FAQPage"');
    expect(
      hasInlineScript,
      `/san-diego-hospitals-medicare/ still has an inline FAQPage JSON-LD block in its bodyHtml.\n\n` +
        `Remove the <script type="application/ld+json"> block from sanDiegoHospitalsMedicareBodyHtml ` +
        `in src/data/providerBodyHtml.ts. The head-level faqSchema is the single source of truth.`,
    ).toBe(false);
  });

  const sdVisibleEntries = parseVisibleFaqEntries(sdHospitalsPage.bodyHtml);

  it('body HTML contains a "Frequently asked questions" section with at least one entry', () => {
    expect(
      sdVisibleEntries.length,
      `Could not find a "Frequently asked questions" <h2> section with <h3>/<p> pairs ` +
        `in sanDiegoHospitalsMedicareBodyHtml.\n\n` +
        `Make sure the body HTML includes an <h2>Frequently asked questions</h2> heading ` +
        `followed by <h3>question</h3><p>answer</p> pairs.`,
    ).toBeGreaterThan(0);
  });

  it("visible FAQ question count matches faqSchema.mainEntity count (bidirectional sync)", () => {
    expect(
      sdVisibleEntries.length,
      `Visible FAQ entries in body HTML (${sdVisibleEntries.length}) does not match ` +
        `faqSchema.mainEntity length (${sdHospitalsSchema.mainEntity.length}).\n\n` +
        `Add or remove entries on both sides to keep them in sync.\n` +
        `Visible questions found: ${sdVisibleEntries.map((e) => `"${e.question}"`).join(", ")}\n` +
        `Schema questions: ${sdHospitalsSchema.mainEntity.map((q) => `"${q.name}"`).join(", ")}`,
    ).toBe(sdHospitalsSchema.mainEntity.length);
  });

  // --- Schema → body direction ---
  for (const question of sdHospitalsSchema.mainEntity) {
    describe(`schema → body: "${question.name}"`, () => {
      it("schema answer text is non-empty", () => {
        expect(
          question.acceptedAnswer?.text,
          `faqSchema answer text for "${question.name}" is empty or missing.\n\n` +
            `Set a non-empty text value in the san-diego-hospitals-medicare faqSchema ` +
            `entry in src/data/providerPages.ts.`,
        ).toBeTruthy();
      });

      it("has a matching visible <h3> question in the FAQ section", () => {
        const match = sdVisibleEntries.find((e) => e.question === question.name);
        expect(
          match,
          `No visible <h3> question matching "${question.name}" was found in the ` +
            `"Frequently asked questions" section of sanDiegoHospitalsMedicareBodyHtml.\n\n` +
            `Add a matching <h3>${question.name}</h3> heading to the body HTML FAQ section, ` +
            `or update the schema question name to match the existing visible heading.`,
        ).toBeDefined();
      });

      it("schema answer text is contained in the visible answer paragraph", () => {
        const schemaText = question.acceptedAnswer?.text ?? "";
        const visibleAnswer =
          sdVisibleEntries.find((e) => e.question === question.name)?.answer ?? "";
        expect(
          visibleAnswer.includes(schemaText),
          `Schema answer text for "${question.name}" does not appear inside the ` +
            `visible answer paragraph.\n\n` +
            `Schema text (from providerPages.ts):\n  "${schemaText}"\n\n` +
            `Visible answer (from providerBodyHtml.ts, tags stripped):\n  "${visibleAnswer}"\n\n` +
            `Update one side so they are in sync. The schema text must be a substring ` +
            `of the visible answer (the body may append extra context such as a link).`,
        ).toBe(true);
      });
    });
  }

  // --- Body → schema direction ---
  for (const entry of sdVisibleEntries) {
    describe(`body → schema: "${entry.question}"`, () => {
      it("has a matching schema question in faqSchema.mainEntity", () => {
        const match = sdHospitalsSchema.mainEntity.find(
          (q) => q.name === entry.question,
        );
        expect(
          match,
          `Visible FAQ question "${entry.question}" in the body HTML has no matching entry ` +
            `in faqSchema.mainEntity.\n\n` +
            `Add a new Question entry for "${entry.question}" to the ` +
            `san-diego-hospitals-medicare faqSchema in src/data/providerPages.ts, ` +
            `or remove the visible question from providerBodyHtml.ts if it was added by mistake.`,
        ).toBeDefined();
      });
    });
  }
});

/**
 * Normalize a text string for FAQ sync comparisons.
 *
 * Decodes common named and numeric HTML entities, collapses all runs of
 * whitespace (including newlines) to a single space, and maps curly/smart
 * apostrophes and quotation marks to their ASCII equivalents. This allows
 * schema text authored as plain Unicode to match equivalent visible body text
 * stored with HTML entities.
 */
function normalizeTextForComparison(text: string): string {
  return text
    .replace(
      /&(#x[\da-f]+|#\d+|amp|apos|quot|lsquo|rsquo|ldquo|rdquo|ndash|mdash|nbsp);/gi,
      (entity, value: string) => {
        if (value.startsWith("#x")) {
          return String.fromCodePoint(Number.parseInt(value.slice(2), 16));
        }
        if (value.startsWith("#")) {
          return String.fromCodePoint(Number.parseInt(value.slice(1), 10));
        }

        const namedEntities: Record<string, string> = {
          amp: "&",
          apos: "'",
          quot: '"',
          lsquo: "'",
          rsquo: "'",
          ldquo: '"',
          rdquo: '"',
          ndash: "–",
          mdash: "—",
          nbsp: " ",
        };
        return namedEntities[value.toLowerCase()] ?? entity;
      },
    )
    .replace(/\s+/g, " ")
    .replace(/[\u2018\u2019\u02BC]/g, "'") // curly/modifier apostrophes → straight
    .replace(/[\u201C\u201D]/g, '"') // curly double quotes → straight
    .trim();
}

/**
 * Sharp HealthCare FAQ schema ↔ body HTML sync guard
 *
 * Enforces a bidirectional sync between the faqSchema defined in
 * providerPages.ts and the visible FAQ section rendered in the body HTML for
 * the sharp-healthcare-medicare-san-diego page:
 *
 *   • Question count must match — catches a visible FAQ added without a schema
 *     entry, or a schema entry added without a visible question.
 *   • Every schema answer text must be non-empty.
 *   • Every schema question must have a matching visible <h3> question, and the
 *     schema answer text must appear inside the stripped visible <p> answer
 *     (after normalizing whitespace and apostrophe style).
 *   • Every visible <h3> question must have a matching schema question.
 *
 * HOW TO FIX A FAILURE:
 *   - Updated faqSchema answer text? Also update the matching <p> inside the
 *     "Frequently asked questions" section of sharpHealthcareSanDiegoBodyHtml
 *     in src/data/providerBodyHtml.ts.
 *   - Updated the body HTML answer? Also update acceptedAnswer.text for that
 *     question in the sharp-healthcare-medicare-san-diego faqSchema entry in
 *     src/data/providerPages.ts.
 *   - Added a visible FAQ? Add the matching entry to faqSchema.mainEntity.
 *   - Added a schema entry? Add the matching <h3>/<p> pair to the body HTML.
 */
describe("Sharp HealthCare FAQ schema ↔ body HTML sync", () => {
  const SHARP_SLUG = "sharp-healthcare-medicare-san-diego";
  const sharpPage = providerPages.find((p) => p.slug === SHARP_SLUG);

  it("Sharp page exists in providerPages", () => {
    expect(
      sharpPage,
      `No provider page found for slug "${SHARP_SLUG}" in providerPages.ts`,
    ).toBeDefined();
  });

  it("Sharp page has a faqSchema", () => {
    expect(
      sharpPage?.faqSchema,
      `"${SHARP_SLUG}" is missing a faqSchema. Add one to providerPages.ts.`,
    ).toBeDefined();
  });

  if (!sharpPage?.faqSchema) return;

  const sharpSchema = sharpPage.faqSchema as FaqSchema;

  it("Sharp faqSchema has at least one question", () => {
    expect(
      Array.isArray(sharpSchema.mainEntity) && sharpSchema.mainEntity.length > 0,
      "faqSchema.mainEntity for sharp-healthcare-medicare-san-diego must be a non-empty array",
    ).toBe(true);
  });

  it("Sharp body HTML does NOT contain a duplicate inline FAQPage JSON-LD script", () => {
    const hasInlineScript =
      sharpPage.bodyHtml.includes('<script type="application/ld+json">') &&
      sharpPage.bodyHtml.includes('"FAQPage"');
    expect(
      hasInlineScript,
      `/sharp-healthcare-medicare-san-diego/ still has an inline FAQPage JSON-LD block in its bodyHtml.\n\n` +
        `Remove the <script type="application/ld+json"> block from sharpHealthcareSanDiegoBodyHtml ` +
        `in src/data/providerBodyHtml.ts. The head-level faqSchema is the single source of truth.`,
    ).toBe(false);
  });

  const sharpVisibleEntries = parseVisibleFaqEntries(sharpPage.bodyHtml);

  it('body HTML contains a "Frequently asked questions" section with at least one entry', () => {
    expect(
      sharpVisibleEntries.length,
      `Could not find a "Frequently asked questions" <h2> section with <h3>/<p> pairs ` +
        `in sharpHealthcareSanDiegoBodyHtml.\n\n` +
        `Make sure the body HTML includes an <h2>Frequently asked questions</h2> heading ` +
        `followed by <h3>question</h3><p>answer</p> pairs.`,
    ).toBeGreaterThan(0);
  });

  it("visible FAQ question count matches faqSchema.mainEntity count (bidirectional sync)", () => {
    expect(
      sharpVisibleEntries.length,
      `Visible FAQ entries in body HTML (${sharpVisibleEntries.length}) does not match ` +
        `faqSchema.mainEntity length (${sharpSchema.mainEntity.length}).\n\n` +
        `Add or remove entries on both sides to keep them in sync.\n` +
        `Visible questions found: ${sharpVisibleEntries.map((e) => `"${e.question}"`).join(", ")}\n` +
        `Schema questions: ${sharpSchema.mainEntity.map((q) => `"${q.name}"`).join(", ")}`,
    ).toBe(sharpSchema.mainEntity.length);
  });

  // --- Schema → body direction: every schema entry must appear visibly ---
  for (const question of sharpSchema.mainEntity) {
    describe(`schema → body: "${question.name}"`, () => {
      it("schema answer text is non-empty", () => {
        expect(
          question.acceptedAnswer?.text,
          `faqSchema answer text for "${question.name}" is empty or missing.\n\n` +
            `Set a non-empty text value in the sharp-healthcare-medicare-san-diego faqSchema ` +
            `entry in src/data/providerPages.ts.`,
        ).toBeTruthy();
      });

      it("has a matching visible <h3> question in the FAQ section", () => {
        const schemaQ = normalizeTextForComparison(question.name);
        const match = sharpVisibleEntries.find(
          (e) => normalizeTextForComparison(e.question) === schemaQ,
        );
        expect(
          match,
          `No visible <h3> question matching "${question.name}" was found in the ` +
            `"Frequently asked questions" section of sharpHealthcareSanDiegoBodyHtml.\n\n` +
            `Add a matching <h3>${question.name}</h3> heading to the body HTML FAQ section, ` +
            `or update the schema question name to match the existing visible heading.`,
        ).toBeDefined();
      });

      it("schema answer text is contained in the visible answer paragraph", () => {
        const schemaQ = normalizeTextForComparison(question.name);
        const schemaText = normalizeTextForComparison(
          question.acceptedAnswer?.text ?? "",
        );
        const visibleAnswer = normalizeTextForComparison(
          sharpVisibleEntries.find(
            (e) => normalizeTextForComparison(e.question) === schemaQ,
          )?.answer ?? "",
        );
        expect(
          visibleAnswer.includes(schemaText),
          `Schema answer text for "${question.name}" does not appear inside the ` +
            `visible answer paragraph (after normalizing whitespace and apostrophe style).\n\n` +
            `Schema text (from providerPages.ts, normalized):\n  "${schemaText}"\n\n` +
            `Visible answer (from providerBodyHtml.ts, normalized):\n  "${visibleAnswer}"\n\n` +
            `Update one side so they are in sync. The schema text must be a substring ` +
            `of the visible answer (the body may append extra context such as a link).`,
        ).toBe(true);
      });
    });
  }

  // --- Body → schema direction: every visible question must have a schema entry ---
  for (const entry of sharpVisibleEntries) {
    describe(`body → schema: "${entry.question}"`, () => {
      it("has a matching schema question in faqSchema.mainEntity", () => {
        const visibleQ = normalizeTextForComparison(entry.question);
        const match = sharpSchema.mainEntity.find(
          (q) => normalizeTextForComparison(q.name) === visibleQ,
        );
        expect(
          match,
          `Visible FAQ question "${entry.question}" in the body HTML has no matching entry ` +
            `in faqSchema.mainEntity.\n\n` +
            `Add a new Question entry for "${entry.question}" to the ` +
            `sharp-healthcare-medicare-san-diego faqSchema in src/data/providerPages.ts, ` +
            `or remove the visible question from providerBodyHtml.ts if it was added by mistake.`,
        ).toBeDefined();
      });
    });
  }
});

/**
 * Paradise Valley Hospital Medicare FAQ schema ↔ body HTML sync guard
 *
 * Enforces a bidirectional sync between the faqSchema defined in
 * providerPages.ts and the visible FAQ section rendered in the body HTML for
 * the paradise-valley-hospital-medicare page:
 *
 *   • Question count must match.
 *   • Every schema answer text must be non-empty.
 *   • Every schema question must have a matching visible <h3> question, and the
 *     schema answer text must appear inside the stripped visible <p> answer.
 *   • Every visible <h3> question must have a matching schema question.
 *
 * HOW TO FIX A FAILURE:
 *   - Updated faqSchema answer text? Also update the matching <p> inside the
 *     "Frequently asked questions" section of paradiseValleyHospitalMedicareBodyHtml
 *     in src/data/providerBodyHtml.ts.
 *   - Updated the body HTML answer? Also update acceptedAnswer.text for that
 *     question in the paradise-valley-hospital-medicare faqSchema entry in
 *     src/data/providerPages.ts.
 *   - Added a visible FAQ? Add the matching entry to faqSchema.mainEntity.
 *   - Added a schema entry? Add the matching <h3>/<p> pair to the body HTML.
 */
describe("Paradise Valley Hospital Medicare FAQ schema ↔ body HTML sync", () => {
  const PV_SLUG = "paradise-valley-hospital-medicare";
  const pvPage = providerPages.find((p) => p.slug === PV_SLUG);

  it("Paradise Valley page exists in providerPages", () => {
    expect(
      pvPage,
      `No provider page found for slug "${PV_SLUG}" in providerPages.ts`,
    ).toBeDefined();
  });

  it("Paradise Valley page has a faqSchema", () => {
    expect(
      pvPage?.faqSchema,
      `"${PV_SLUG}" is missing a faqSchema. Add one to providerPages.ts.`,
    ).toBeDefined();
  });

  if (!pvPage?.faqSchema) return;

  const pvSchema = pvPage.faqSchema as FaqSchema;

  it("Paradise Valley faqSchema has at least one question", () => {
    expect(
      Array.isArray(pvSchema.mainEntity) && pvSchema.mainEntity.length > 0,
      "faqSchema.mainEntity for paradise-valley-hospital-medicare must be a non-empty array",
    ).toBe(true);
  });

  it("Paradise Valley body HTML does NOT contain a duplicate inline FAQPage JSON-LD script", () => {
    const hasInlineScript =
      pvPage.bodyHtml.includes('<script type="application/ld+json">') &&
      pvPage.bodyHtml.includes('"FAQPage"');
    expect(
      hasInlineScript,
      `/paradise-valley-hospital-medicare/ still has an inline FAQPage JSON-LD block in its bodyHtml.\n\n` +
        `Remove the <script type="application/ld+json"> block from paradiseValleyHospitalMedicareBodyHtml ` +
        `in src/data/providerBodyHtml.ts. The head-level faqSchema is the single source of truth.`,
    ).toBe(false);
  });

  const pvVisibleEntries = parseVisibleFaqEntries(pvPage.bodyHtml);

  it('body HTML contains a "Frequently asked questions" section with at least one entry', () => {
    expect(
      pvVisibleEntries.length,
      `Could not find a "Frequently asked questions" <h2> section with <h3>/<p> pairs ` +
        `in paradiseValleyHospitalMedicareBodyHtml.\n\n` +
        `Make sure the body HTML includes an <h2>Frequently asked questions</h2> heading ` +
        `followed by <h3>question</h3><p>answer</p> pairs.`,
    ).toBeGreaterThan(0);
  });

  it("visible FAQ question count matches faqSchema.mainEntity count (bidirectional sync)", () => {
    expect(
      pvVisibleEntries.length,
      `Visible FAQ entries in body HTML (${pvVisibleEntries.length}) does not match ` +
        `faqSchema.mainEntity length (${pvSchema.mainEntity.length}).\n\n` +
        `Add or remove entries on both sides to keep them in sync.\n` +
        `Visible questions found: ${pvVisibleEntries.map((e) => `"${e.question}"`).join(", ")}\n` +
        `Schema questions: ${pvSchema.mainEntity.map((q) => `"${q.name}"`).join(", ")}`,
    ).toBe(pvSchema.mainEntity.length);
  });

  // --- Schema → body direction ---
  for (const question of pvSchema.mainEntity) {
    describe(`schema → body: "${question.name}"`, () => {
      it("schema answer text is non-empty", () => {
        expect(
          question.acceptedAnswer?.text,
          `faqSchema answer text for "${question.name}" is empty or missing.\n\n` +
            `Set a non-empty text value in the paradise-valley-hospital-medicare faqSchema ` +
            `entry in src/data/providerPages.ts.`,
        ).toBeTruthy();
      });

      it("has a matching visible <h3> question in the FAQ section", () => {
        const match = pvVisibleEntries.find((e) => e.question === question.name);
        expect(
          match,
          `No visible <h3> question matching "${question.name}" was found in the ` +
            `"Frequently asked questions" section of paradiseValleyHospitalMedicareBodyHtml.\n\n` +
            `Add a matching <h3>${question.name}</h3> heading to the body HTML FAQ section, ` +
            `or update the schema question name to match the existing visible heading.`,
        ).toBeDefined();
      });

      it("schema answer text is contained in the visible answer paragraph", () => {
        const schemaText = question.acceptedAnswer?.text ?? "";
        const visibleAnswer =
          pvVisibleEntries.find((e) => e.question === question.name)?.answer ?? "";
        expect(
          visibleAnswer.includes(schemaText),
          `Schema answer text for "${question.name}" does not appear inside the ` +
            `visible answer paragraph.\n\n` +
            `Schema text (from providerPages.ts):\n  "${schemaText}"\n\n` +
            `Visible answer (from providerBodyHtml.ts, tags stripped):\n  "${visibleAnswer}"\n\n` +
            `Update one side so they are in sync. The schema text must be a substring ` +
            `of the visible answer (the body may append extra context such as a link).`,
        ).toBe(true);
      });
    });
  }

  // --- Body → schema direction ---
  for (const entry of pvVisibleEntries) {
    describe(`body → schema: "${entry.question}"`, () => {
      it("has a matching schema question in faqSchema.mainEntity", () => {
        const match = pvSchema.mainEntity.find((q) => q.name === entry.question);
        expect(
          match,
          `Visible FAQ question "${entry.question}" in the body HTML has no matching entry ` +
            `in faqSchema.mainEntity.\n\n` +
            `Add a new Question entry for "${entry.question}" to the ` +
            `paradise-valley-hospital-medicare faqSchema in src/data/providerPages.ts, ` +
            `or remove the visible question from providerBodyHtml.ts if it was added by mistake.`,
        ).toBeDefined();
      });
    });
  }
});

function registerProviderFaqSyncDescribe(
  providerName: string,
  slug: string,
): void {
  describe(`${providerName} FAQ schema ↔ body HTML sync`, () => {
    const page = providerPages.find((candidate) => candidate.slug === slug);
    const schema = page?.faqSchema as FaqSchema | undefined;
    const visibleEntries = page
      ? parseVisibleFaqEntries(page.bodyHtml)
      : [];

    it("has both a provider page and a non-empty faqSchema", () => {
      expect(
        page,
        `No provider page found for slug "${slug}" in providerPages.ts.`,
      ).toBeDefined();
      expect(
        schema?.mainEntity?.length,
        `"${slug}" must have a non-empty faqSchema.mainEntity array.`,
      ).toBeGreaterThan(0);
    });

    it('has a visible "Frequently asked questions" section', () => {
      expect(
        visibleEntries.length,
        `Could not find visible <h3>/<p> FAQ pairs after the "Frequently asked questions" ` +
          `heading for "${slug}" in providerBodyHtml.ts.`,
      ).toBeGreaterThan(0);
    });

    it("has the same number of visible and schema FAQ entries", () => {
      expect(
        visibleEntries.length,
        `FAQ count drift for "${slug}".\n\n` +
          `Visible questions: ${visibleEntries.map((entry) => `"${entry.question}"`).join(", ")}\n` +
          `Schema questions: ${(schema?.mainEntity ?? []).map((question) => `"${question.name}"`).join(", ")}`,
      ).toBe(schema?.mainEntity?.length);
    });

    for (const question of schema?.mainEntity ?? []) {
      describe(`schema → body: "${question.name}"`, () => {
        const normalizedQuestion = normalizeTextForComparison(question.name);
        const visibleEntry = visibleEntries.find(
          (entry) =>
            normalizeTextForComparison(entry.question) === normalizedQuestion,
        );

        it("has a non-empty schema answer", () => {
          expect(
            normalizeTextForComparison(question.acceptedAnswer?.text ?? ""),
            `faqSchema answer text for "${question.name}" on "${slug}" is empty.`,
          ).not.toBe("");
        });

        it("has a matching visible question", () => {
          expect(
            visibleEntry,
            `No visible FAQ question matching "${question.name}" was found for "${slug}". ` +
              `Update providerPages.ts and providerBodyHtml.ts together.`,
          ).toBeDefined();
        });

        it("keeps the schema answer in sync with the visible answer", () => {
          const schemaAnswer = normalizeTextForComparison(
            question.acceptedAnswer?.text ?? "",
          );
          const visibleAnswer = normalizeTextForComparison(
            visibleEntry?.answer ?? "",
          );

          expect(
            visibleAnswer.includes(schemaAnswer),
            `FAQ answer drift for "${question.name}" on "${slug}".\n\n` +
              `Schema answer:\n  "${schemaAnswer}"\n\n` +
              `Visible answer:\n  "${visibleAnswer}"\n\n` +
              `Update acceptedAnswer.text in providerPages.ts and the matching visible ` +
              `<p> in providerBodyHtml.ts together.`,
          ).toBe(true);
        });
      });
    }

    for (const entry of visibleEntries) {
      it(`body → schema: "${entry.question}" has a matching schema question`, () => {
        const normalizedQuestion = normalizeTextForComparison(entry.question);
        const schemaQuestion = schema?.mainEntity.find(
          (question) =>
            normalizeTextForComparison(question.name) === normalizedQuestion,
        );

        expect(
          schemaQuestion,
          `Visible FAQ question "${entry.question}" on "${slug}" has no matching ` +
            `faqSchema entry in providerPages.ts.`,
        ).toBeDefined();
      });
    }
  });
}

registerProviderFaqSyncDescribe(
  "UC San Diego Health",
  "uc-san-diego-health-medicare",
);
registerProviderFaqSyncDescribe(
  "Palomar Health",
  "palomar-health-medicare-san-diego",
);
registerProviderFaqSyncDescribe(
  "Kaiser Permanente",
  "kaiser-permanente-medicare-san-diego",
);
registerProviderFaqSyncDescribe(
  "Alvarado Hospital",
  "alvarado-hospital-medicare",
);

const REMAINING_PROVIDER_FAQ_SYNC_SLUGS = [
  "scripps-health-medicare-san-diego",
  "medicare-dental-vision-hearing-san-diego",
] as const;

describe("remaining provider FAQ schema ↔ body HTML sync", () => {
  for (const slug of REMAINING_PROVIDER_FAQ_SYNC_SLUGS) {
    describe(`/${slug}/`, () => {
      const page = providerPages.find((candidate) => candidate.slug === slug);
      const schema = page?.faqSchema as FaqSchema | undefined;
      const visibleEntries = page
        ? parseVisibleFaqEntries(page.bodyHtml)
        : [];

      it("has both a provider page and a non-empty faqSchema", () => {
        expect(
          page,
          `No provider page found for slug "${slug}" in providerPages.ts.`,
        ).toBeDefined();
        expect(
          schema?.mainEntity?.length,
          `"${slug}" must have a non-empty faqSchema.mainEntity array.`,
        ).toBeGreaterThan(0);
      });

      it('has a visible "Frequently asked questions" section', () => {
        expect(
          visibleEntries.length,
          `Could not find visible <h3>/<p> FAQ pairs after the "Frequently asked questions" ` +
            `heading for "${slug}" in providerBodyHtml.ts.`,
        ).toBeGreaterThan(0);
      });

      it("has the same number of visible and schema FAQ entries", () => {
        expect(
          visibleEntries.length,
          `FAQ count drift for "${slug}".\n\n` +
            `Visible questions: ${visibleEntries.map((entry) => `"${entry.question}"`).join(", ")}\n` +
            `Schema questions: ${(schema?.mainEntity ?? []).map((question) => `"${question.name}"`).join(", ")}`,
        ).toBe(schema?.mainEntity?.length);
      });

      for (const question of schema?.mainEntity ?? []) {
        describe(`schema → body: "${question.name}"`, () => {
          const normalizedQuestion = normalizeTextForComparison(question.name);
          const visibleEntry = visibleEntries.find(
            (entry) =>
              normalizeTextForComparison(entry.question) === normalizedQuestion,
          );

          it("has a non-empty schema answer", () => {
            expect(
              normalizeTextForComparison(question.acceptedAnswer?.text ?? ""),
              `faqSchema answer text for "${question.name}" on "${slug}" is empty.`,
            ).not.toBe("");
          });

          it("has a matching visible question", () => {
            expect(
              visibleEntry,
              `No visible FAQ question matching "${question.name}" was found for "${slug}". ` +
                `Update providerPages.ts and providerBodyHtml.ts together.`,
            ).toBeDefined();
          });

          it("keeps the schema answer in sync with the visible answer", () => {
            const schemaAnswer = normalizeTextForComparison(
              question.acceptedAnswer?.text ?? "",
            );
            const visibleAnswer = normalizeTextForComparison(
              visibleEntry?.answer ?? "",
            );

            expect(
              visibleAnswer.includes(schemaAnswer),
              `FAQ answer drift for "${question.name}" on "${slug}".\n\n` +
                `Schema answer:\n  "${schemaAnswer}"\n\n` +
                `Visible answer:\n  "${visibleAnswer}"\n\n` +
                `Update acceptedAnswer.text in providerPages.ts and the matching visible ` +
                `<p> in providerBodyHtml.ts together.`,
            ).toBe(true);
          });
        });
      }

      for (const entry of visibleEntries) {
        it(`body → schema: "${entry.question}" has a matching schema question`, () => {
          const normalizedQuestion = normalizeTextForComparison(entry.question);
          const schemaQuestion = schema?.mainEntity.find(
            (question) =>
              normalizeTextForComparison(question.name) === normalizedQuestion,
          );

          expect(
            schemaQuestion,
            `Visible FAQ question "${entry.question}" on "${slug}" has no matching ` +
              `faqSchema entry in providerPages.ts.`,
          ).toBeDefined();
        });
      }
    });
  }
});
