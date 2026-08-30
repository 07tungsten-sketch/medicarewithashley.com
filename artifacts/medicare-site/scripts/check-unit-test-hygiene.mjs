#!/usr/bin/env node
/**
 * check-unit-test-hygiene.mjs
 *
 * Prevents focused Vitest tests and suites from making the unit-test command
 * silently skip the rest of the suite.
 *
 * Usage:
 *   node scripts/check-unit-test-hygiene.mjs [test-directory]
 *
 * Exit codes:
 *   0 — all Vitest test files are free of focused calls
 *   1 — one or more Vitest test files contain a focused call
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const testDirectory = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(scriptDirectory, "../src");

const vitestTestExtensions = [
  ".test.js",
  ".test.jsx",
  ".test.mjs",
  ".test.mjsx",
  ".test.cjs",
  ".test.cjsx",
  ".test.ts",
  ".test.tsx",
  ".test.mts",
  ".test.mtsx",
  ".test.cts",
  ".test.ctsx",
  ".spec.js",
  ".spec.jsx",
  ".spec.mjs",
  ".spec.mjsx",
  ".spec.cjs",
  ".spec.cjsx",
  ".spec.ts",
  ".spec.tsx",
  ".spec.mts",
  ".spec.mtsx",
  ".spec.cts",
  ".spec.ctsx",
];

function findTestFiles(directory, relativeDirectory = "") {
  const currentDirectory = join(directory, relativeDirectory);
  const entries = readdirSync(currentDirectory, { withFileTypes: true });

  return entries
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const relativePath = join(relativeDirectory, entry.name);

      if (entry.isDirectory()) {
        return findTestFiles(directory, relativePath);
      }

      if (
        entry.isFile() &&
        vitestTestExtensions.some((extension) =>
          entry.name.endsWith(extension),
        )
      ) {
        return [relativePath];
      }

      return [];
    });
}

const testFiles = findTestFiles(testDirectory);
const focusedCallPattern =
  /\b(?:test|it|describe|suite)(?:\s*\.\s*[A-Za-z_$][\w$]*\s*)*\.only(?:\s*\.\s*[A-Za-z_$][\w$]*\s*)*\s*\(/;
const focusedViolations = [];

for (const file of testFiles) {
  const source = readFileSync(join(testDirectory, file), "utf8");

  if (focusedCallPattern.test(source)) {
    focusedViolations.push(file);
  }
}

if (focusedViolations.length > 0) {
  console.error(
    "✗ unit-test hygiene check failed — the following Vitest test files " +
      "contain a focused test or suite (test.only(), it.only(), " +
      "describe.only(), or suite.only()), which prevents other tests from " +
      "running:\n",
  );
  for (const file of focusedViolations) {
    console.error(`  • ${file}`);
  }
  console.error(
    "\nReplace the focused call with its non-focused equivalent before " +
      "committing.",
  );
  process.exit(1);
}

console.log(
  `✓ unit-test hygiene check passed — ${testFiles.length} Vitest test files ` +
    "contain no focused test or suite calls",
);