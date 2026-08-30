import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it } from "vitest";
import { Router } from "wouter";
import IRMAACalculator, {
  getTier,
  IRMAA_2026,
  MFS_DISPLAY,
  TIER_DISPLAY,
} from "./IRMAACalculator";

type IncomeStatus = "single" | "joint";

const EXPECTED_SINGLE_RANGES = [
  "≤ $109,000",
  "$109,001 – $137,000",
  "$137,001 – $171,000",
  "$171,001 – $205,000",
  "$205,001 – $499,999",
  "$500,000+",
];

const EXPECTED_JOINT_RANGES = [
  "≤ $218,000",
  "$218,001 – $274,000",
  "$274,001 – $342,000",
  "$342,001 – $410,000",
  "$410,001 – $749,999",
  "$750,000+",
];

const EXPECTED_MFS_RANGES = [
  "≤ $109,000",
  "$109,001 – $390,999",
  "$391,000+",
];

const EXPECTED_CMS_RELEASE = {
  year: 2026,
  cmsReleaseDate: "November 14, 2025",
  cmsSourceUrl:
    "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles",
  partBStandard: 202.9,
  partBDeductible: 283,
} as const;

const EXPECTED_THRESHOLDS = {
  single: [109000, 137000, 171000, 205000, 499999.99, Infinity],
  joint: [218000, 274000, 342000, 410000, 749999.99, Infinity],
  mfs: [109000, 390999.99, Infinity],
} as const;

const EXPECTED_PREMIUM_AMOUNTS = {
  standardAndIrmaa: [
    { partBTotal: 202.90, partBSurcharge: 0, partDSurcharge: 0 },
    { partBTotal: 284.10, partBSurcharge: 81.20, partDSurcharge: 14.50 },
    { partBTotal: 405.80, partBSurcharge: 202.90, partDSurcharge: 37.50 },
    { partBTotal: 527.50, partBSurcharge: 324.60, partDSurcharge: 60.40 },
    { partBTotal: 649.20, partBSurcharge: 446.30, partDSurcharge: 83.30 },
    { partBTotal: 689.90, partBSurcharge: 487.00, partDSurcharge: 91.00 },
  ],
  mfs: [
    { partBTotal: 202.90, partBSurcharge: 0, partDSurcharge: 0 },
    { partBTotal: 649.20, partBSurcharge: 446.30, partDSurcharge: 83.30 },
    { partBTotal: 689.90, partBSurcharge: 487.00, partDSurcharge: 91.00 },
  ],
} as const;

const EXPECTED_REFERENCE_TABLE_AMOUNTS = {
  single: [
    { range: "≤ $109,000", partB: "$202.90", partD: "—" },
    { range: "$109,001 – $137,000", partB: "$284.10", partD: "+$14.50" },
    { range: "$137,001 – $171,000", partB: "$405.80", partD: "+$37.50" },
    { range: "$171,001 – $205,000", partB: "$527.50", partD: "+$60.40" },
    { range: "$205,001 – $499,999", partB: "$649.20", partD: "+$83.30" },
    { range: "$500,000+", partB: "$689.90", partD: "+$91.00" },
  ],
  joint: [
    { range: "≤ $218,000", partB: "$202.90", partD: "—" },
    { range: "$218,001 – $274,000", partB: "$284.10", partD: "+$14.50" },
    { range: "$274,001 – $342,000", partB: "$405.80", partD: "+$37.50" },
    { range: "$342,001 – $410,000", partB: "$527.50", partD: "+$60.40" },
    { range: "$410,001 – $749,999", partB: "$649.20", partD: "+$83.30" },
    { range: "$750,000+", partB: "$689.90", partD: "+$91.00" },
  ],
  mfs: [
    { range: "≤ $109,000", partB: "$202.90", partD: "—" },
    { range: "$109,001 – $390,999", partB: "$649.20", partD: "+$83.30" },
    { range: "$391,000+", partB: "$689.90", partD: "+$91.00" },
  ],
} as const;

function renderCalculatorMarkup(): string {
  const staticLocation = (): [string, (path: string) => void] => [
    "/medicare-irmaa-calculator-san-diego/",
    () => {},
  ];

  return renderToStaticMarkup(
    createElement(
      HelmetProvider,
      null,
      createElement(
        Router,
        { hook: staticLocation },
        createElement(IRMAACalculator),
      ),
    ),
  );
}

function readReferenceTableRows(markup: string, testId: string): string[][] {
  const tableMarkup = markup.match(
    new RegExp(`<table[^>]*data-testid="${testId}"[^>]*>([\\s\\S]*?)</table>`),
  )?.[1];
  expect(tableMarkup, `Expected ${testId} to be rendered.`).toBeDefined();

  const bodyMarkup = tableMarkup?.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/)?.[1];
  expect(bodyMarkup, `Expected ${testId} to contain a table body.`).toBeDefined();

  return [...(bodyMarkup ?? "").matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map(
    (row) =>
      [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((cell) =>
        cell[1].replace(/<[^>]+>/g, "").trim(),
      ),
  );
}

function firstIncomeInTier(
  status: IncomeStatus,
  index: number,
): number {
  const previousMax = EXPECTED_THRESHOLDS[status][index - 1];
  return previousMax === undefined ? 0 : Math.floor(previousMax) + 1;
}

describe("IRMAA income range display", () => {
  it.each([
    ["single", "singleRange"],
    ["joint", "jointRange"],
  ] as const)(
    "derives every %s range from the annual tier configuration",
    (status, rangeKey) => {
      expect(TIER_DISPLAY.map((display) => display[rangeKey])).toEqual(
        status === "single" ? EXPECTED_SINGLE_RANGES : EXPECTED_JOINT_RANGES,
      );
    },
  );

  it("derives every Married Filing Separately range from the annual configuration", () => {
    expect(MFS_DISPLAY.map((display) => display.range)).toEqual(
      EXPECTED_MFS_RANGES,
    );
  });

  it.each(["single", "joint"] as const)(
    "shows the selected %s range at each tier's representative boundaries",
    (status) => {
      EXPECTED_THRESHOLDS[status].forEach((maxIncome, index) => {
        const expectedRange =
          (status === "single" ? EXPECTED_SINGLE_RANGES : EXPECTED_JOINT_RANGES)[
            index
          ];
        const firstIncome = firstIncomeInTier(status, index);
        const representativeIncomes = Number.isFinite(maxIncome)
          ? [firstIncome, maxIncome]
          : [firstIncome];

        representativeIncomes.forEach((income) => {
          expect(getTier(income, status)?.range).toBe(expectedRange);
        });
      });
    },
  );

  it("keeps Married Filing Separately selection boundaries aligned with displayed ranges", () => {
    EXPECTED_THRESHOLDS.mfs.forEach((maxIncome, index) => {
      const expectedRange = EXPECTED_MFS_RANGES[index];
      const firstIncome = index === 0
        ? 0
        : Math.floor(EXPECTED_THRESHOLDS.mfs[index - 1]) + 1;

      expect(getTier(firstIncome, "mfs")?.range).toBe(expectedRange);

      if (Number.isFinite(maxIncome)) {
        expect(getTier(maxIncome, "mfs")?.range).toBe(expectedRange);
      }
    });
  });

  it.each(["single", "joint"] as const)(
    "moves to the next %s range on the first dollar after a threshold",
    (status) => {
      EXPECTED_THRESHOLDS[status].slice(0, -1).forEach((threshold, index) => {
        const expectedRanges =
          status === "single" ? EXPECTED_SINGLE_RANGES : EXPECTED_JOINT_RANGES;

        expect(getTier(threshold, status)?.range).toBe(expectedRanges[index]);
        expect(getTier(Math.floor(threshold) + 1, status)?.range).toBe(
          expectedRanges[index + 1],
        );
      });
    },
  );

  it("moves from the second MFS tier to the top tier at $391,000", () => {
    const secondTierMax = EXPECTED_THRESHOLDS.mfs[1];

    expect(getTier(secondTierMax, "mfs")?.range).toBe(EXPECTED_MFS_RANGES[1]);
    expect(getTier(Math.floor(secondTierMax) + 1, "mfs")?.range).toBe(
      EXPECTED_MFS_RANGES[2],
    );
  });
});

describe("2026 CMS release configuration", () => {
  it("keeps the annual release metadata and standard costs aligned with CMS", () => {
    expect({
      year: IRMAA_2026.year,
      cmsReleaseDate: IRMAA_2026.cmsReleaseDate,
      cmsSourceUrl: IRMAA_2026.cmsSourceUrl,
      partBStandard: IRMAA_2026.partBStandard,
      partBDeductible: IRMAA_2026.partBDeductible,
    }).toEqual(EXPECTED_CMS_RELEASE);
  });

  it("keeps every filing-status threshold independently aligned with CMS", () => {
    expect(IRMAA_2026.tiers.map((tier) => tier.singleMax)).toEqual(
      EXPECTED_THRESHOLDS.single,
    );
    expect(IRMAA_2026.tiers.map((tier) => tier.jointMax)).toEqual(
      EXPECTED_THRESHOLDS.joint,
    );
    expect(IRMAA_2026.mfs.map((tier) => tier.max)).toEqual(
      EXPECTED_THRESHOLDS.mfs,
    );
  });
});

describe("IRMAA CMS source attribution", () => {
  it("renders the annual release link, date, standard premium, and deductible", () => {
    const markup = renderCalculatorMarkup();

    expect(markup).toContain(`href="${EXPECTED_CMS_RELEASE.cmsSourceUrl}"`);
    expect(markup).toContain(EXPECTED_CMS_RELEASE.cmsReleaseDate);
    expect(markup).toContain("$202.90");
    expect(markup).toContain("$283");
  });
});


describe("IRMAA premium and surcharge amounts", () => {
  it.each([
    ["single", [100000, 120000, 150000, 180000, 300000, 800000]],
    ["joint", [200000, 250000, 300000, 350000, 500000, 800000]],
  ] as const)(
    "returns the expected CMS Part B and Part D amounts for representative %s results",
    (status, representativeIncomes) => {
      representativeIncomes.forEach((income, index) => {
        expect(getTier(income, status)).toMatchObject(
          EXPECTED_PREMIUM_AMOUNTS.standardAndIrmaa[index],
        );
      });
    },
  );

  it("returns the expected CMS Part B and Part D amounts for representative Married Filing Separately results", () => {
    [100000, 200000, 400000].forEach((income, index) => {
      expect(getTier(income, "mfs")).toMatchObject(
        EXPECTED_PREMIUM_AMOUNTS.mfs[index],
      );
    });
  });
});

describe("IRMAA reference table CMS amounts", () => {
  it.each([
    ["single", "irmaa-reference-table-single"],
    ["joint", "irmaa-reference-table-joint"],
    ["mfs", "irmaa-reference-table-mfs"],
  ] as const)(
    "renders the expected CMS Part B and Part D amounts in the %s table",
    (status, testId) => {
      const markup = renderCalculatorMarkup();

      expect(readReferenceTableRows(markup, testId)).toEqual(
        EXPECTED_REFERENCE_TABLE_AMOUNTS[status].map(({ range, partB, partD }) => [
          range,
          partB,
          partD,
        ]),
      );
    },
  );
});