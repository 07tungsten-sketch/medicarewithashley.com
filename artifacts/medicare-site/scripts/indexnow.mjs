#!/usr/bin/env node
/**
 * IndexNow submission script for medicarewithashley.com
 *
 * Notifies Bing (and participating engines: Yandex, Seznam, Naver, and AI
 * engines that use Bing's index) that pages have been published or updated.
 * Does NOT affect Google — Google indexing uses Search Console and normal crawling.
 *
 * Usage:
 *   node scripts/indexnow.mjs <url1> <url2> ...   # submit specific URLs
 *   node scripts/indexnow.mjs --all               # submit every URL in the sitemap
 *
 * Or via npm scripts:
 *   pnpm --filter @workspace/medicare-site run indexnow <url1> <url2> ...
 *   pnpm --filter @workspace/medicare-site run indexnow:all
 *
 * Must publish first so the key file is live before submitting.
 * IndexNow validates the key by fetching https://medicarewithashley.com/<key>.txt.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── IndexNow credentials (key is public by design) ───────────────────────────
const KEY          = "5564d3c5fc281eb58ee774f4f4c1c639";
const HOST         = "medicarewithashley.com";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const API_ENDPOINT = "https://api.indexnow.org/indexnow";

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseSitemap() {
  const sitemapPath = resolve(__dirname, "../public/sitemap.xml");
  const xml = readFileSync(sitemapPath, "utf-8");
  const urls = [];
  const re = /<loc>(.*?)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    urls.push(m[1].trim());
  }
  return urls;
}

function validateUrls(urls) {
  const invalid = urls.filter(u => {
    try {
      const parsed = new URL(u);
      return parsed.hostname !== HOST;
    } catch {
      return true; // unparseable URL
    }
  });
  if (invalid.length > 0) {
    console.error("ERROR: The following URLs are not on medicarewithashley.com and will not be submitted:");
    invalid.forEach(u => console.error(`  ${u}`));
    process.exit(1);
  }
}

function explainStatus(status, body) {
  switch (status) {
    case 200:
    case 202:
      return `✅ Accepted (${status}) — Bing and participating engines have been notified.`;
    case 400:
      return `❌ Bad Request (400) — Malformed payload. Body: ${body}`;
    case 403:
      return `❌ Forbidden (403) — Key file not found or invalid.\n` +
             `   Make sure you have published so the key file is live at:\n` +
             `   ${KEY_LOCATION}\n` +
             `   Then verify it loads in a browser before running this script.`;
    case 422:
      return `❌ Unprocessable (422) — URLs don't match the declared host/key.\n` +
             `   All submitted URLs must be on https://${HOST}/`;
    case 429:
      return `⚠️  Rate Limited (429) — Too many requests. Wait a few minutes and retry.`;
    default:
      return `❌ Unexpected status ${status}. Body: ${body}`;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage:");
  console.error("  node scripts/indexnow.mjs <url1> <url2> ...  # submit specific URLs");
  console.error("  node scripts/indexnow.mjs --all              # submit all sitemap URLs");
  process.exit(1);
}

let urlList;

if (args[0] === "--all") {
  urlList = parseSitemap();
  console.log(`Read ${urlList.length} URLs from sitemap.`);
} else {
  urlList = args;
}

validateUrls(urlList);

console.log(`\nSubmitting ${urlList.length} URL(s) to IndexNow...`);
urlList.forEach(u => console.log(`  ${u}`));

const payload = {
  host:        HOST,
  key:         KEY,
  keyLocation: KEY_LOCATION,
  urlList,
};

let response;
try {
  response = await fetch(API_ENDPOINT, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
} catch (err) {
  console.error(`\n❌ Network error: ${err.message}`);
  process.exit(1);
}

const body = await response.text().catch(() => "");
const explanation = explainStatus(response.status, body);

console.log(`\n${explanation}`);

if (response.status !== 200 && response.status !== 202) {
  process.exit(1);
}
