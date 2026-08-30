/**
 * Provider home FAQ ↔ provider page sync guards for all seven providers
 * (Sharp, Scripps, UCSD, Kaiser, Palomar, Tri-City, and Paradise Valley)
 *
 * Each provider home FAQ entry in homeFaqItems.ts makes a factual claim about
 * that health system's Medicare Advantage participation. The same claim must
 * also appear verbatim in the corresponding provider page body HTML so that
 * both pages stay factually consistent.
 *
 * HOW THIS WORKS
 * The base answer text for each provider is held in a named constant exported
 * from homeFaqItems.ts (e.g. SHARP_HOME_FAQ_ANSWER_BASE). Each provider FAQ
 * entry's `a` and `schemaText` fields are built from this constant. The same
 * base text is also embedded in the provider page body HTML
 * (providerBodyHtml.ts) so a grep-style check here can flag any divergence.
 *
 * IF A TEST FAILS
 * Either:
 *  a) Someone changed the base constant in homeFaqItems.ts without updating
 *     the corresponding sentence in providerBodyHtml.ts — fix by updating both
 *     to match.
 *  b) Someone edited the provider page body HTML and removed or changed the
 *     shared sentence — fix by restoring it or updating the constant and the
 *     home FAQ entry together.
 *
 * ADDING A NEW PROVIDER
 * 1. Export a new *_HOME_FAQ_ANSWER_BASE constant from homeFaqItems.ts.
 * 2. Use it in that provider's `a` and `schemaText` fields.
 * 3. Embed the same text verbatim in the provider page body in providerBodyHtml.ts.
 * 4. Add a new describe block below following the existing pattern.
 */

import { describe, it, expect } from "vitest";
import {
  homeFaqItems,
  SHARP_HOME_FAQ_ANSWER_BASE,
  SCRIPPS_HOME_FAQ_ANSWER_BASE,
  UCSD_HOME_FAQ_ANSWER_BASE,
  KAISER_HOME_FAQ_ANSWER_BASE,
  PALOMAR_HOME_FAQ_ANSWER_BASE,
  TRI_CITY_HOME_FAQ_ANSWER_BASE,
  PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE,
} from "./homeFaqItems";
import {
  sharpHealthcareSanDiegoBodyHtml,
  scrippsHealthSanDiegoBodyHtml,
  ucSanDiegoHealthMedicareBodyHtml,
  kaiserPermanenteSanDiegoBodyHtml,
  palomarHealthMedicareSanDiegoBodyHtml,
  triCityMedicalCenterMedicareBodyHtml,
  paradiseValleyHospitalMedicareBodyHtml,
} from "./providerBodyHtml";

/** Escape a string for use in a RegExp constructor. */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------------------------------------------------------------------------
// Sharp
// ---------------------------------------------------------------------------

const SHARP_QUESTION = "Does Sharp HealthCare accept Medicare Advantage?";

describe("Sharp home FAQ ↔ Sharp provider page sync", () => {
  const sharpEntry = homeFaqItems.find((item) => item.q === SHARP_QUESTION);

  it("Sharp entry exists in homeFaqItems", () => {
    expect(
      sharpEntry,
      `No home FAQ entry found for "${SHARP_QUESTION}".\n\n` +
        `Add an entry with this question to src/data/homeFaqItems.ts.`,
    ).toBeDefined();
  });

  it("SHARP_HOME_FAQ_ANSWER_BASE is non-empty and starts with the expected factual claim", () => {
    expect(SHARP_HOME_FAQ_ANSWER_BASE.length).toBeGreaterThan(0);
    expect(
      SHARP_HOME_FAQ_ANSWER_BASE,
      "SHARP_HOME_FAQ_ANSWER_BASE no longer starts with the expected factual claim.\n\n" +
        "If the claim has changed, update both SHARP_HOME_FAQ_ANSWER_BASE in homeFaqItems.ts " +
        "AND the corresponding sentence in providerBodyHtml.ts (sharpHealthcareSanDiegoBodyHtml).",
    ).toMatch(
      /^Yes — Sharp HealthCare participates in many Medicare Advantage plans available to San Diego beneficiaries, but not every plan\./,
    );
  });

  it("Sharp home FAQ `a` field is built from SHARP_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      sharpEntry?.a,
      `Sharp home FAQ \`a\` text does not start with SHARP_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  a: \`\${SHARP_HOME_FAQ_ANSWER_BASE} Learn more on the Sharp HealthCare Medicare Advantage page.\``,
    ).toMatch(new RegExp(`^${escapeRegExp(SHARP_HOME_FAQ_ANSWER_BASE)}`));
  });

  it("Sharp home FAQ `schemaText` is built from SHARP_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      sharpEntry?.schemaText,
      `Sharp home FAQ \`schemaText\` does not start with SHARP_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  schemaText: \`\${SHARP_HOME_FAQ_ANSWER_BASE} For a full overview, visit…\``,
    ).toMatch(new RegExp(`^${escapeRegExp(SHARP_HOME_FAQ_ANSWER_BASE)}`));
  });

  it("Sharp provider page body HTML contains the base answer text verbatim", () => {
    expect(
      sharpHealthcareSanDiegoBodyHtml,
      "The Sharp provider page body (providerBodyHtml.ts, sharpHealthcareSanDiegoBodyHtml) " +
        "no longer contains SHARP_HOME_FAQ_ANSWER_BASE verbatim.\n\n" +
        "The two sources have diverged. Fix by:\n" +
        "  1. Updating providerBodyHtml.ts to restore/update the shared sentence, OR\n" +
        "  2. Updating SHARP_HOME_FAQ_ANSWER_BASE in homeFaqItems.ts to match the " +
        "new provider page wording AND updating the `a` and `schemaText` fields accordingly.",
    ).toContain(SHARP_HOME_FAQ_ANSWER_BASE);
  });
});

// ---------------------------------------------------------------------------
// Scripps
// ---------------------------------------------------------------------------

const SCRIPPS_QUESTION = "Does Scripps Health accept Medicare Advantage?";

describe("Scripps home FAQ ↔ Scripps provider page sync", () => {
  const scrippsEntry = homeFaqItems.find((item) => item.q === SCRIPPS_QUESTION);

  it("Scripps entry exists in homeFaqItems", () => {
    expect(
      scrippsEntry,
      `No home FAQ entry found for "${SCRIPPS_QUESTION}".\n\n` +
        `Add an entry with this question to src/data/homeFaqItems.ts.`,
    ).toBeDefined();
  });

  it("SCRIPPS_HOME_FAQ_ANSWER_BASE is non-empty", () => {
    expect(SCRIPPS_HOME_FAQ_ANSWER_BASE.length).toBeGreaterThan(0);
  });

  it("Scripps home FAQ `a` field is built from SCRIPPS_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      scrippsEntry?.a,
      `Scripps home FAQ \`a\` text does not start with SCRIPPS_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  a: \`\${SCRIPPS_HOME_FAQ_ANSWER_BASE} Learn more on the Scripps Health Medicare page.\``,
    ).toMatch(new RegExp(`^${escapeRegExp(SCRIPPS_HOME_FAQ_ANSWER_BASE)}`));
  });

  it("Scripps home FAQ `schemaText` is built from SCRIPPS_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      scrippsEntry?.schemaText,
      `Scripps home FAQ \`schemaText\` does not start with SCRIPPS_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  schemaText: \`\${SCRIPPS_HOME_FAQ_ANSWER_BASE} For a full overview, visit…\``,
    ).toMatch(new RegExp(`^${escapeRegExp(SCRIPPS_HOME_FAQ_ANSWER_BASE)}`));
  });

  it("Scripps provider page body HTML contains the base answer text verbatim", () => {
    expect(
      scrippsHealthSanDiegoBodyHtml,
      "The Scripps provider page body (providerBodyHtml.ts, scrippsHealthSanDiegoBodyHtml) " +
        "no longer contains SCRIPPS_HOME_FAQ_ANSWER_BASE verbatim.\n\n" +
        "The two sources have diverged. Fix by:\n" +
        "  1. Updating providerBodyHtml.ts to restore/update the shared sentence, OR\n" +
        "  2. Updating SCRIPPS_HOME_FAQ_ANSWER_BASE in homeFaqItems.ts to match the " +
        "new provider page wording AND updating the `a` and `schemaText` fields accordingly.",
    ).toContain(SCRIPPS_HOME_FAQ_ANSWER_BASE);
  });
});

// ---------------------------------------------------------------------------
// UC San Diego Health
// ---------------------------------------------------------------------------

const UCSD_QUESTION = "Does UC San Diego Health accept Medicare Advantage?";

describe("UCSD home FAQ ↔ UCSD provider page sync", () => {
  const ucsdEntry = homeFaqItems.find((item) => item.q === UCSD_QUESTION);

  it("UCSD entry exists in homeFaqItems", () => {
    expect(
      ucsdEntry,
      `No home FAQ entry found for "${UCSD_QUESTION}".\n\n` +
        `Add an entry with this question to src/data/homeFaqItems.ts.`,
    ).toBeDefined();
  });

  it("UCSD_HOME_FAQ_ANSWER_BASE is non-empty", () => {
    expect(UCSD_HOME_FAQ_ANSWER_BASE.length).toBeGreaterThan(0);
  });

  it("UCSD home FAQ `a` field is built from UCSD_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      ucsdEntry?.a,
      `UCSD home FAQ \`a\` text does not start with UCSD_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  a: \`\${UCSD_HOME_FAQ_ANSWER_BASE} Learn more on the UC San Diego Health Medicare page.\``,
    ).toMatch(new RegExp(`^${escapeRegExp(UCSD_HOME_FAQ_ANSWER_BASE)}`));
  });

  it("UCSD home FAQ `schemaText` is built from UCSD_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      ucsdEntry?.schemaText,
      `UCSD home FAQ \`schemaText\` does not start with UCSD_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  schemaText: \`\${UCSD_HOME_FAQ_ANSWER_BASE} For details, visit…\``,
    ).toMatch(new RegExp(`^${escapeRegExp(UCSD_HOME_FAQ_ANSWER_BASE)}`));
  });

  it("UCSD provider page body HTML contains the base answer text verbatim", () => {
    expect(
      ucSanDiegoHealthMedicareBodyHtml,
      "The UCSD provider page body (providerBodyHtml.ts, ucSanDiegoHealthMedicareBodyHtml) " +
        "no longer contains UCSD_HOME_FAQ_ANSWER_BASE verbatim.\n\n" +
        "The two sources have diverged. Fix by:\n" +
        "  1. Updating providerBodyHtml.ts to restore/update the shared sentence, OR\n" +
        "  2. Updating UCSD_HOME_FAQ_ANSWER_BASE in homeFaqItems.ts to match the " +
        "new provider page wording AND updating the `a` and `schemaText` fields accordingly.",
    ).toContain(UCSD_HOME_FAQ_ANSWER_BASE);
  });
});

// ---------------------------------------------------------------------------
// Kaiser Permanente
// ---------------------------------------------------------------------------

const KAISER_QUESTION = "Does Kaiser Permanente work with Medicare Advantage?";

describe("Kaiser home FAQ ↔ Kaiser provider page sync", () => {
  const kaiserEntry = homeFaqItems.find((item) => item.q === KAISER_QUESTION);

  it("Kaiser entry exists in homeFaqItems", () => {
    expect(
      kaiserEntry,
      `No home FAQ entry found for "${KAISER_QUESTION}".\n\n` +
        `Add an entry with this question to src/data/homeFaqItems.ts.`,
    ).toBeDefined();
  });

  it("KAISER_HOME_FAQ_ANSWER_BASE is non-empty", () => {
    expect(KAISER_HOME_FAQ_ANSWER_BASE.length).toBeGreaterThan(0);
  });

  it("Kaiser home FAQ `a` field is built from KAISER_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      kaiserEntry?.a,
      `Kaiser home FAQ \`a\` text does not start with KAISER_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  a: \`\${KAISER_HOME_FAQ_ANSWER_BASE} Learn more on the Kaiser Permanente Medicare page.\``,
    ).toMatch(new RegExp(`^${escapeRegExp(KAISER_HOME_FAQ_ANSWER_BASE)}`));
  });

  it("Kaiser home FAQ `schemaText` is built from KAISER_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      kaiserEntry?.schemaText,
      `Kaiser home FAQ \`schemaText\` does not start with KAISER_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  schemaText: \`\${KAISER_HOME_FAQ_ANSWER_BASE} For details, visit…\``,
    ).toMatch(new RegExp(`^${escapeRegExp(KAISER_HOME_FAQ_ANSWER_BASE)}`));
  });

  it("Kaiser provider page body HTML contains the base answer text verbatim", () => {
    expect(
      kaiserPermanenteSanDiegoBodyHtml,
      "The Kaiser provider page body (providerBodyHtml.ts, kaiserPermanenteSanDiegoBodyHtml) " +
        "no longer contains KAISER_HOME_FAQ_ANSWER_BASE verbatim.\n\n" +
        "The two sources have diverged. Fix by:\n" +
        "  1. Updating providerBodyHtml.ts to restore/update the shared sentence, OR\n" +
        "  2. Updating KAISER_HOME_FAQ_ANSWER_BASE in homeFaqItems.ts to match the " +
        "new provider page wording AND updating the `a` and `schemaText` fields accordingly.",
    ).toContain(KAISER_HOME_FAQ_ANSWER_BASE);
  });
});

// ---------------------------------------------------------------------------
// Palomar Health
// ---------------------------------------------------------------------------

const PALOMAR_QUESTION = "Does Palomar Health accept Medicare Advantage?";

describe("Palomar home FAQ ↔ Palomar provider page sync", () => {
  const palomarEntry = homeFaqItems.find((item) => item.q === PALOMAR_QUESTION);

  it("Palomar entry exists in homeFaqItems", () => {
    expect(
      palomarEntry,
      `No home FAQ entry found for "${PALOMAR_QUESTION}".\n\n` +
        `Add an entry with this question to src/data/homeFaqItems.ts.`,
    ).toBeDefined();
  });

  it("PALOMAR_HOME_FAQ_ANSWER_BASE is non-empty", () => {
    expect(PALOMAR_HOME_FAQ_ANSWER_BASE.length).toBeGreaterThan(0);
  });

  it("Palomar home FAQ `a` field is built from PALOMAR_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      palomarEntry?.a,
      `Palomar home FAQ \`a\` text does not start with PALOMAR_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  a: \`\${PALOMAR_HOME_FAQ_ANSWER_BASE} Learn more on the Palomar Health Medicare page.\``,
    ).toMatch(new RegExp(`^${escapeRegExp(PALOMAR_HOME_FAQ_ANSWER_BASE)}`));
  });

  it("Palomar home FAQ `schemaText` is built from PALOMAR_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      palomarEntry?.schemaText,
      `Palomar home FAQ \`schemaText\` does not start with PALOMAR_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  schemaText: \`\${PALOMAR_HOME_FAQ_ANSWER_BASE} For details, visit…\``,
    ).toMatch(new RegExp(`^${escapeRegExp(PALOMAR_HOME_FAQ_ANSWER_BASE)}`));
  });

  it("Palomar provider page body HTML contains the base answer text verbatim", () => {
    expect(
      palomarHealthMedicareSanDiegoBodyHtml,
      "The Palomar provider page body (providerBodyHtml.ts, palomarHealthMedicareSanDiegoBodyHtml) " +
        "no longer contains PALOMAR_HOME_FAQ_ANSWER_BASE verbatim.\n\n" +
        "The two sources have diverged. Fix by:\n" +
        "  1. Updating providerBodyHtml.ts to restore/update the shared sentence, OR\n" +
        "  2. Updating PALOMAR_HOME_FAQ_ANSWER_BASE in homeFaqItems.ts to match the " +
        "new provider page wording AND updating the `a` and `schemaText` fields accordingly.",
    ).toContain(PALOMAR_HOME_FAQ_ANSWER_BASE);
  });
});

// ---------------------------------------------------------------------------
// Tri-City Medical Center
// ---------------------------------------------------------------------------

const TRI_CITY_QUESTION =
  "Does Tri-City Medical Center accept Medicare Advantage?";

describe("Tri-City home FAQ ↔ Tri-City provider page sync", () => {
  const triCityEntry = homeFaqItems.find(
    (item) => item.q === TRI_CITY_QUESTION,
  );

  it("Tri-City entry exists in homeFaqItems", () => {
    expect(
      triCityEntry,
      `No home FAQ entry found for "${TRI_CITY_QUESTION}".\n\n` +
        `Add an entry with this question to src/data/homeFaqItems.ts.`,
    ).toBeDefined();
  });

  it("TRI_CITY_HOME_FAQ_ANSWER_BASE is non-empty", () => {
    expect(TRI_CITY_HOME_FAQ_ANSWER_BASE.length).toBeGreaterThan(0);
  });

  it("Tri-City home FAQ `a` field is built from TRI_CITY_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      triCityEntry?.a,
      `Tri-City home FAQ \`a\` text does not start with TRI_CITY_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  a: \`\${TRI_CITY_HOME_FAQ_ANSWER_BASE} Learn more on the Tri-City Medical Center Medicare page.\``,
    ).toMatch(new RegExp(`^${escapeRegExp(TRI_CITY_HOME_FAQ_ANSWER_BASE)}`));
  });

  it("Tri-City home FAQ `schemaText` is built from TRI_CITY_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      triCityEntry?.schemaText,
      `Tri-City home FAQ \`schemaText\` does not start with TRI_CITY_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  schemaText: \`\${TRI_CITY_HOME_FAQ_ANSWER_BASE} For details, visit…\``,
    ).toMatch(new RegExp(`^${escapeRegExp(TRI_CITY_HOME_FAQ_ANSWER_BASE)}`));
  });

  it("Tri-City provider page body HTML contains the base answer text verbatim", () => {
    expect(
      triCityMedicalCenterMedicareBodyHtml,
      "The Tri-City provider page body (providerBodyHtml.ts, triCityMedicalCenterMedicareBodyHtml) " +
        "no longer contains TRI_CITY_HOME_FAQ_ANSWER_BASE verbatim.\n\n" +
        "The two sources have diverged. Fix by:\n" +
        "  1. Updating providerBodyHtml.ts to restore/update the shared sentence, OR\n" +
        "  2. Updating TRI_CITY_HOME_FAQ_ANSWER_BASE in homeFaqItems.ts to match the " +
        "new provider page wording AND updating the `a` and `schemaText` fields accordingly.",
    ).toContain(TRI_CITY_HOME_FAQ_ANSWER_BASE);
  });
});

// ---------------------------------------------------------------------------
// Paradise Valley Hospital
// ---------------------------------------------------------------------------

const PARADISE_VALLEY_QUESTION =
  "Does Paradise Valley Hospital accept Medicare Advantage?";

describe("Paradise Valley home FAQ ↔ Paradise Valley provider page sync", () => {
  const paradiseValleyEntry = homeFaqItems.find(
    (item) => item.q === PARADISE_VALLEY_QUESTION,
  );

  it("Paradise Valley entry exists in homeFaqItems", () => {
    expect(
      paradiseValleyEntry,
      `No home FAQ entry found for "${PARADISE_VALLEY_QUESTION}".\n\n` +
        `Add an entry with this question to src/data/homeFaqItems.ts.`,
    ).toBeDefined();
  });

  it("PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE is non-empty", () => {
    expect(PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE.length).toBeGreaterThan(0);
  });

  it("Paradise Valley home FAQ `a` field is built from PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      paradiseValleyEntry?.a,
      `Paradise Valley home FAQ \`a\` text does not start with PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  a: \`\${PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE} Learn more on the Paradise Valley Hospital Medicare page.\``,
    ).toMatch(
      new RegExp(`^${escapeRegExp(PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE)}`),
    );
  });

  it("Paradise Valley home FAQ `schemaText` is built from PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE", () => {
    expect(
      paradiseValleyEntry?.schemaText,
      `Paradise Valley home FAQ \`schemaText\` does not start with PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE.\n\n` +
        `The entry in homeFaqItems.ts must use the constant:\n` +
        `  schemaText: \`\${PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE} For details, visit…\``,
    ).toMatch(
      new RegExp(`^${escapeRegExp(PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE)}`),
    );
  });

  it("Paradise Valley provider page body HTML contains the base answer text verbatim", () => {
    expect(
      paradiseValleyHospitalMedicareBodyHtml,
      "The Paradise Valley provider page body (providerBodyHtml.ts, paradiseValleyHospitalMedicareBodyHtml) " +
        "no longer contains PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE verbatim.\n\n" +
        "The two sources have diverged. Fix by:\n" +
        "  1. Updating providerBodyHtml.ts to restore/update the shared sentence, OR\n" +
        "  2. Updating PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE in homeFaqItems.ts to match the " +
        "new provider page wording AND updating the `a` and `schemaText` fields accordingly.",
    ).toContain(PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE);
  });
});
