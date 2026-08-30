import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const pagePath = path.resolve(
  scriptDirectory,
  "../dist/public/medicare-irmaa-calculator-san-diego/index.html",
);
const html = fs.readFileSync(pagePath, "utf8");
const normalizedHtml = html.replace(/<!--[\s\S]*?-->/g, "");

// Keep these release-facing checks independent from the TypeScript calculator
// configuration. They protect the published HTML from losing its annual CMS
// provenance or displaying an outdated standard premium.
const requiredReleaseEvidence = [
  ["2026 Medicare IRMAA Calculator", "the 2026 page title"],
  ["Updated for 2026", "the 2026 update badge"],
  [
    "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles",
    "the official CMS release link",
  ],
  ["November 14, 2025", "the CMS publication date"],
  ["$202.90", "the standard Part B premium"],
  ["$283", "the annual Part B deductible"],
  ["$500,000+", "the highest individual threshold"],
  ["$750,000+", "the highest joint threshold"],
  ["$391,000+", "the highest MFS threshold"],
];

for (const [evidence, description] of requiredReleaseEvidence) {
  assert.ok(
    normalizedHtml.includes(evidence),
    `Missing ${description} from prerendered IRMAA page`,
  );
}

console.log(
  `IRMAA release validation passed: ${requiredReleaseEvidence.length} CMS 2026 evidence checks.`,
);