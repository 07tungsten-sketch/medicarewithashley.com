import { expect, test } from "@playwright/test";

type FilingStatus = "single" | "joint" | "mfs";

type CmsReferenceCase = {
  status: FilingStatus;
  tableTestId: string;
  income: number;
  row: [string, string, string];
};

// Independent annual CMS fixture. Do not import calculator configuration here:
// this data must catch drift between the calculator and its visible reference tables.
const CMS_REFERENCE_CASES: CmsReferenceCase[] = [
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 100000,
    row: ["≤ $109,000", "$202.90", "—"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 120000,
    row: ["$109,001 – $137,000", "$284.10", "+$14.50"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 150000,
    row: ["$137,001 – $171,000", "$405.80", "+$37.50"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 180000,
    row: ["$171,001 – $205,000", "$527.50", "+$60.40"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 300000,
    row: ["$205,001 – $499,999", "$649.20", "+$83.30"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 800000,
    row: ["$500,000+", "$689.90", "+$91.00"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 200000,
    row: ["≤ $218,000", "$202.90", "—"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 250000,
    row: ["$218,001 – $274,000", "$284.10", "+$14.50"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 300000,
    row: ["$274,001 – $342,000", "$405.80", "+$37.50"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 350000,
    row: ["$342,001 – $410,000", "$527.50", "+$60.40"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 500000,
    row: ["$410,001 – $749,999", "$649.20", "+$83.30"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 800000,
    row: ["$750,000+", "$689.90", "+$91.00"],
  },
  {
    status: "mfs",
    tableTestId: "irmaa-reference-table-mfs",
    income: 100000,
    row: ["≤ $109,000", "$202.90", "—"],
  },
  {
    status: "mfs",
    tableTestId: "irmaa-reference-table-mfs",
    income: 200000,
    row: ["$109,001 – $390,999", "$649.20", "+$83.30"],
  },
  {
    status: "mfs",
    tableTestId: "irmaa-reference-table-mfs",
    income: 400000,
    row: ["$391,000+", "$689.90", "+$91.00"],
  },
];

// Check both sides of every CMS threshold in the browser. Keep this fixture
// independent so a stale calculator tier cannot make its own test pass.
const CMS_THRESHOLD_CASES: CmsReferenceCase[] = [
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 109000,
    row: ["≤ $109,000", "$202.90", "—"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 109001,
    row: ["$109,001 – $137,000", "$284.10", "+$14.50"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 137000,
    row: ["$109,001 – $137,000", "$284.10", "+$14.50"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 137001,
    row: ["$137,001 – $171,000", "$405.80", "+$37.50"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 171000,
    row: ["$137,001 – $171,000", "$405.80", "+$37.50"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 171001,
    row: ["$171,001 – $205,000", "$527.50", "+$60.40"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 205000,
    row: ["$171,001 – $205,000", "$527.50", "+$60.40"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 205001,
    row: ["$205,001 – $499,999", "$649.20", "+$83.30"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 499999,
    row: ["$205,001 – $499,999", "$649.20", "+$83.30"],
  },
  {
    status: "single",
    tableTestId: "irmaa-reference-table-single",
    income: 500000,
    row: ["$500,000+", "$689.90", "+$91.00"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 218000,
    row: ["≤ $218,000", "$202.90", "—"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 218001,
    row: ["$218,001 – $274,000", "$284.10", "+$14.50"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 274000,
    row: ["$218,001 – $274,000", "$284.10", "+$14.50"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 274001,
    row: ["$274,001 – $342,000", "$405.80", "+$37.50"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 342000,
    row: ["$274,001 – $342,000", "$405.80", "+$37.50"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 342001,
    row: ["$342,001 – $410,000", "$527.50", "+$60.40"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 410000,
    row: ["$342,001 – $410,000", "$527.50", "+$60.40"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 410001,
    row: ["$410,001 – $749,999", "$649.20", "+$83.30"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 749999,
    row: ["$410,001 – $749,999", "$649.20", "+$83.30"],
  },
  {
    status: "joint",
    tableTestId: "irmaa-reference-table-joint",
    income: 750000,
    row: ["$750,000+", "$689.90", "+$91.00"],
  },
  {
    status: "mfs",
    tableTestId: "irmaa-reference-table-mfs",
    income: 109000,
    row: ["≤ $109,000", "$202.90", "—"],
  },
  {
    status: "mfs",
    tableTestId: "irmaa-reference-table-mfs",
    income: 109001,
    row: ["$109,001 – $390,999", "$649.20", "+$83.30"],
  },
  {
    status: "mfs",
    tableTestId: "irmaa-reference-table-mfs",
    income: 390999,
    row: ["$109,001 – $390,999", "$649.20", "+$83.30"],
  },
  {
    status: "mfs",
    tableTestId: "irmaa-reference-table-mfs",
    income: 391000,
    row: ["$391,000+", "$689.90", "+$91.00"],
  },
];

test.describe("IRMAA calculator and reference-table agreement", () => {
  for (const { status, tableTestId, income, row } of [
    ...CMS_REFERENCE_CASES,
    ...CMS_THRESHOLD_CASES,
  ]) {
    test(`${status} income ${income} matches its CMS reference row`, async ({ page }) => {
      await page.goto("/medicare-irmaa-calculator-san-diego");

      await page.locator(`input[name="filing-status"][value="${status}"]`).check();
      await page.locator("#magi-input").fill(income.toLocaleString("en-US"));
      await page.getByRole("button", { name: "Calculate My IRMAA" }).click();

      const referenceTable = page.getByTestId(tableTestId);
      const matchingRow = referenceTable
        .locator("tbody tr")
        .filter({ hasText: row[0] })
        .first();
      await expect(matchingRow.locator("td")).toHaveText(row);

      const results = page.getByRole("region", {
        name: "IRMAA calculation results",
      });
      await expect(results.getByTestId("irmaa-result-part-b")).toHaveText(
        row[2] === "—" ? row[1] : `${row[1]}/mo`,
      );

      if (row[2] === "—") {
        await expect(results).toContainText(
          "No IRMAA surcharges apply to your Part B or Part D.",
        );
      } else {
        await expect(results.getByTestId("irmaa-result-part-d")).toHaveText(
          `${row[2]}/mo`,
        );
      }
    });
  }
});