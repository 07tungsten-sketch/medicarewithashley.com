#!/usr/bin/env node
/**
 * check-viewport-guards.mjs
 *
 * Enforces two spec-hygiene conventions for every Playwright spec file:
 *
 * 1. VIEWPORT GUARD — any spec that fixes a viewport via
 *    `test.use({ viewport: ... })` must also contain a `test.skip` project
 *    guard so the suite only runs under the intended Playwright project.
 *    Without this guard a viewport-dependent suite (e.g. a mobile sheet or a
 *    desktop dropdown) can silently run under the wrong project and produce
 *    misleading pass/fail results.
 *
 * 2. FOCUSED SUITE BAN — no spec may contain `test.only(`, `it.only(`,
 *    `describe.only(`, or `suite.only(`. Focused tests and suites block
 *    other tests from running in CI and are nearly always a developer mistake
 *    that was forgotten before committing.
 *
 * Usage:
 *   node e2e/check-viewport-guards.mjs [spec-directory]
 *
 * Exit codes:
 *   0 — all spec files pass both checks
 *   1 — one or more spec files violate at least one rule
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const specDirectory = process.argv[2] ? resolve(process.argv[2]) : __dirname;
const playwrightSpecExtensions = [
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

function findSpecFiles(directory, relativeDirectory = "") {
  const currentDirectory = join(directory, relativeDirectory);
  const entries = readdirSync(currentDirectory, { withFileTypes: true });

  return entries
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const relativePath = join(relativeDirectory, entry.name);

      if (entry.isDirectory()) {
        return findSpecFiles(directory, relativePath);
      }

      if (
        entry.isFile() &&
        playwrightSpecExtensions.some((extension) =>
          entry.name.endsWith(extension)
        )
      ) {
        return [relativePath];
      }

      return [];
    });
}

const specFiles = findSpecFiles(specDirectory);

const viewportViolations = [];
const onlyViolations = [];

for (const file of specFiles) {
  const src = readFileSync(join(specDirectory, file), "utf8");

  // --- viewport guard check ---
  const hasViewportUse = /test\.use\(\s*\{[^}]*viewport\s*:/.test(src);
  const hasSkipGuard = /test\.skip\(/.test(src);
  if (hasViewportUse && !hasSkipGuard) {
    viewportViolations.push(file);
  }

  // --- focused test / suite ban ---
  if (/\b(test|it|describe|suite)\.only\s*\(/.test(src)) {
    onlyViolations.push(file);
  }
}

let failed = false;

if (viewportViolations.length > 0) {
  failed = true;
  console.error(
    "✗ viewport-guard check failed — the following spec files set test.use({ viewport }) " +
      "but are missing a test.skip project guard:\n"
  );
  for (const f of viewportViolations) {
    console.error(`  • e2e/${f}`);
  }
  console.error(
    "\nAdd a test.skip call inside the describe block so the suite only runs under " +
      "the intended Playwright project, for example:\n" +
      "\n" +
      "  // Desktop-only suite — skip under the mobile-chromium project\n" +
      "  test.skip(({ isMobile }) => isMobile, 'Desktop-only suite — skipped under mobile-chromium');\n" +
      "\n" +
      "  // Mobile-only suite — skip under the desktop-chromium project\n" +
      "  test.skip(({ isMobile }) => !isMobile, 'Mobile-only suite — skipped under desktop-chromium');"
  );
}

if (onlyViolations.length > 0) {
  failed = true;
  if (viewportViolations.length > 0) console.error(""); // blank separator
  console.error(
    "✗ focused-test check failed — the following spec files contain a focused " +
      "test or suite (test.only(), it.only(), describe.only(), or suite.only()), " +
      "which prevents other specs from running in CI:\n"
  );
  for (const f of onlyViolations) {
    console.error(`  • e2e/${f}`);
  }
  console.error(
    "\nReplace the focused call with its non-focused equivalent (or remove the test " +
      "entirely) before committing."
  );
}

if (!failed) {
  console.log(
    "✓ spec-hygiene checks passed — viewport guards present, no focused test or suite calls found"
  );
  process.exit(0);
} else {
  process.exit(1);
}
