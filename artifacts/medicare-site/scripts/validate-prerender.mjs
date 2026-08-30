/**
 * validate-prerender.mjs
 *
 * Reads dist/public/index.html after a prerender run and asserts that all
 * required SEO elements are present. Exits non-zero on any failure so the
 * build pipeline is blocked before a broken prerender ships to production.
 *
 * Checks performed on the homepage:
 *   - <title> appears exactly once
 *   - <meta name="description"> appears exactly once
 *   - rel="canonical" appears exactly once
 *   - <h1 appears at least once
 *   - application/ld+json blocks number at least 2
 *   - Hero text "Medicare Is Confusing" is present in the static body
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPublic = path.resolve(__dirname, "../dist/public");
const indexPath = path.resolve(distPublic, "index.html");

// ---------------------------------------------------------------------------
// Helper: count non-overlapping occurrences of a string/regex in text
// ---------------------------------------------------------------------------
function countMatches(html, pattern) {
  if (typeof pattern === "string") {
    let count = 0;
    let pos = 0;
    while ((pos = html.indexOf(pattern, pos)) !== -1) {
      count++;
      pos += pattern.length;
    }
    return count;
  }
  return (html.match(pattern) || []).length;
}

// ---------------------------------------------------------------------------
// Assertions
// ---------------------------------------------------------------------------
const checks = [
  {
    name: '<title> appears exactly once',
    assert: (html) => countMatches(html, '<title') === 1,
    detail: (html) => `found ${countMatches(html, '<title')} <title> tag(s)`,
  },
  {
    name: '<meta name="description"> appears exactly once',
    assert: (html) => countMatches(html, 'name="description"') === 1,
    detail: (html) =>
      `found ${countMatches(html, 'name="description"')} description meta(s)`,
  },
  {
    name: 'rel="canonical" appears exactly once',
    assert: (html) => countMatches(html, 'rel="canonical"') === 1,
    detail: (html) =>
      `found ${countMatches(html, 'rel="canonical"')} canonical link(s)`,
  },
  {
    name: '<h1 appears at least once',
    assert: (html) => countMatches(html, '<h1') >= 1,
    detail: (html) => `found ${countMatches(html, '<h1')} <h1> element(s)`,
  },
  {
    name: 'at least 2 application/ld+json blocks',
    assert: (html) => countMatches(html, 'application/ld+json') >= 2,
    detail: (html) =>
      `found ${countMatches(html, 'application/ld+json')} ld+json block(s)`,
  },
  {
    name: 'hero text "Medicare Is Confusing" present',
    assert: (html) => html.includes('Medicare Is Confusing'),
    detail: () => 'text not found in static body',
  },
];

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
if (!fs.existsSync(indexPath)) {
  console.error(`\n✗ validate-prerender: file not found: ${indexPath}`);
  console.error('  Run the build first (vite build + prerender.mjs).\n');
  process.exit(1);
}

const html = fs.readFileSync(indexPath, "utf-8");

let passed = 0;
let failed = 0;
const failures = [];

for (const check of checks) {
  if (check.assert(html)) {
    console.log(`  ✓ ${check.name}`);
    passed++;
  } else {
    const detail = check.detail(html);
    console.error(`  ✗ ${check.name} — ${detail}`);
    failures.push(`${check.name}: ${detail}`);
    failed++;
  }
}

console.log(`\nPre-render validation: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  console.error('\nBuild blocked — fix the prerender before deploying:\n');
  for (const f of failures) {
    console.error(`  • ${f}`);
  }
  process.exit(1);
}
