/**
 * validate-inner-prerender.mjs
 *
 * Validates a representative sample of inner-route HTML after prerendering.
 * Exits non-zero on any failure so a route-specific regression cannot ship as
 * an empty SPA shell while the homepage still passes validation.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { representativeInnerRoutes } from "./representative-inner-routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPublic = path.resolve(__dirname, "../dist/public");

const checks = [
  {
    name: "<title> appears exactly once",
    pattern: /<title\b[^>]*>/gi,
    minimum: 1,
    exact: 1,
    detail: "title tag(s)",
  },
  {
    name: '<meta name="description"> appears exactly once',
    pattern: /<meta\b[^>]*\bname=(["'])description\1[^>]*>/gi,
    minimum: 1,
    exact: 1,
    detail: "description meta(s)",
  },
  {
    name: 'rel="canonical" appears exactly once',
    pattern: /<link\b[^>]*\brel=(["'])canonical\1[^>]*>/gi,
    minimum: 1,
    exact: 1,
    detail: "canonical link(s)",
  },
  {
    name: "<h1> appears at least once",
    pattern: /<h1\b[^>]*>/gi,
    minimum: 1,
    detail: "<h1> element(s)",
  },
  {
    name: "at least 1 application/ld+json block",
    pattern:
      /<script\b[^>]*\btype=(["'])application\/ld\+json\1[^>]*>/gi,
    minimum: 1,
    detail: "ld+json block(s)",
  },
];

function routeFile(route) {
  return path.resolve(distPublic, route.slice(1), "index.html");
}

function countMatches(html, pattern) {
  return (html.match(pattern) || []).length;
}

const failures = [];
let passed = 0;

for (const route of representativeInnerRoutes) {
  const filePath = routeFile(route);
  if (!fs.existsSync(filePath)) {
    const failure = `${route}: prerendered HTML is missing (${filePath})`;
    console.error(`  ✗ ${failure}`);
    failures.push(failure);
    continue;
  }

  const html = fs.readFileSync(filePath, "utf-8");
  console.log(`\nValidating prerendered ${route}:`);

  for (const check of checks) {
    const count = countMatches(html, check.pattern);
    const valid = check.exact === undefined
      ? count >= check.minimum
      : count === check.exact;

    if (valid) {
      console.log(`  ✓ ${check.name}`);
      passed++;
    } else {
      const expected =
        check.exact === undefined
          ? `at least ${check.minimum}`
          : `exactly ${check.exact}`;
      const failure = `${route}: ${check.name} — found ${count} ${check.detail}; expected ${expected}`;
      console.error(`  ✗ ${check.name} — found ${count} ${check.detail}`);
      failures.push(failure);
    }
  }
}

console.log(
  `\nInner-route pre-render validation: ${passed} passed, ` +
    `${failures.length} failed.`,
);

if (failures.length > 0) {
  console.error("\nBuild blocked — fix the inner-route prerender before deploying:\n");
  for (const failure of failures) {
    console.error(`  • ${failure}`);
  }
  process.exit(1);
}