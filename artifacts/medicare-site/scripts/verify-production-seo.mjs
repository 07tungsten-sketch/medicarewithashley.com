import { createHash } from "node:crypto";

const CANONICAL_ORIGIN = "https://medicarewithashley.com";
const WWW_ORIGIN = "https://www.medicarewithashley.com";
const redirectRoutes = [
  "/",
  "/turning-65",
  "/medicare-advantage",
  "/sharp-healthcare-medicare-san-diego",
  "/kaiser-permanente-medicare-san-diego",
  "/medicare-medi-cal-dual-eligible-san-diego",
  "/about",
  "/blog/can-i-change-my-medicare-plan-after-enrollment",
  "/part-b-penalty-calculator",
  "/part-d-penalty-calculator",
];
const calculatorRoutes = new Set([
  "/part-b-penalty-calculator",
  "/part-d-penalty-calculator",
]);
const token =
  process.env.SEO_CACHE_BUST ??
  `production-seo-${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}`;
const failures = [];
const results = [];

function fail(message) {
  failures.push(message);
}

function extractCanonical(html) {
  return html.match(
    /<link\b[^>]*\brel=(["'])canonical\1[^>]*\bhref=(["'])(.*?)\2[^>]*>/i,
  )?.[3] ??
    html.match(
      /<link\b[^>]*\bhref=(["'])(.*?)\1[^>]*\brel=(["'])canonical\3[^>]*>/i,
    )?.[2] ??
    null;
}

function parseJsonLd(html) {
  const values = [];
  for (const match of html.matchAll(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      values.push(JSON.parse(match[1].trim()));
    } catch (error) {
      fail(`Malformed production JSON-LD: ${error.message}`);
    }
  }
  return values;
}

function topLevelTypes(values) {
  return values.flatMap((value) =>
    Array.isArray(value?.["@type"]) ? value["@type"] : [value?.["@type"]],
  ).filter((type) => typeof type === "string");
}

async function manualRequest(url) {
  return fetch(url, {
    redirect: "manual",
    headers: {
      "user-agent": "MedicareWithAshley-SEO-Verification/1.0",
      accept: "text/html,application/xhtml+xml",
    },
  });
}

async function verifyRedirect(sourceUrl, expectedUrl, label) {
  const response = await manualRequest(sourceUrl);
  const location = response.headers.get("location");
  if (response.status !== 301) {
    fail(`${label}: returned ${response.status}; expected 301`);
    return;
  }
  if (!location) {
    fail(`${label}: 301 response did not include Location`);
    return;
  }

  const resolved = new URL(location, sourceUrl).href;
  if (resolved !== expectedUrl) {
    fail(`${label}: redirected to ${resolved}; expected ${expectedUrl}`);
    return;
  }

  const destination = await manualRequest(resolved);
  if (destination.status !== 200) {
    fail(
      `${label}: destination returned ${destination.status}; expected a one-hop 301 followed by 200`,
    );
  }
}

const sitemapUrl = `${CANONICAL_ORIGIN}/sitemap.xml?seo_check=${encodeURIComponent(token)}`;
const sitemapResponse = await manualRequest(sitemapUrl);
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1].trim(),
);
const invalidSitemapUrls = sitemapUrls.filter((value) => {
  const url = new URL(value);
  return (
    url.origin !== CANONICAL_ORIGIN ||
    (url.pathname !== "/" && url.pathname.endsWith("/"))
  );
});
const duplicateSitemapUrls = sitemapUrls.filter(
  (value, index) => sitemapUrls.indexOf(value) !== index,
);

if (sitemapResponse.status !== 200) {
  fail(`sitemap.xml returned ${sitemapResponse.status}`);
}
if (sitemapUrls.length === 0) {
  fail("sitemap.xml contains no URLs");
}
if (invalidSitemapUrls.length > 0) {
  fail(`sitemap.xml contains non-canonical URLs: ${invalidSitemapUrls.join(", ")}`);
}
if (duplicateSitemapUrls.length > 0) {
  fail(`sitemap.xml contains duplicates: ${duplicateSitemapUrls.join(", ")}`);
}

const liveRoutes = [...new Set(sitemapUrls.map((value) => new URL(value).pathname))];

for (const route of liveRoutes) {
  const query = new URLSearchParams({
    seo_check: token,
    route: route === "/" ? "home" : route.slice(1),
  }).toString();
  const expectedUrl = `${CANONICAL_ORIGIN}${route}?${query}`;
  const canonicalResponse = await manualRequest(expectedUrl);
  const html = await canonicalResponse.text();
  const canonical = extractCanonical(html);
  const responseDate = canonicalResponse.headers.get("date");
  const cacheControl = canonicalResponse.headers.get("cache-control");
  const hash = createHash("sha256").update(html).digest("hex").slice(0, 16);
  const types = topLevelTypes(parseJsonLd(html));

  if (canonicalResponse.status !== 200) {
    fail(`${route}: canonical URL returned ${canonicalResponse.status}`);
  }
  if (canonical !== `${CANONICAL_ORIGIN}${route}`) {
    fail(`${route}: canonical tag was ${canonical ?? "missing"}`);
  }
  if (!responseDate) {
    fail(`${route}: cache-busted response did not include a Date header`);
  }
  if (!cacheControl || !/(?:max-age=0|no-cache|no-store|must-revalidate)/i.test(cacheControl)) {
    fail(`${route}: HTML cache policy was ${cacheControl ?? "missing"}`);
  }

  if (calculatorRoutes.has(route)) {
    if (!types.includes("FAQPage")) {
      fail(`${route}: live calculator is missing FAQPage`);
    }
  }

  results.push({
    route,
    status: canonicalResponse.status,
    canonical,
    responseDate,
    cacheControl,
    bytes: Buffer.byteLength(html),
    sha256: hash,
    topLevelTypes: types,
  });

}

for (const route of redirectRoutes) {
  const query = new URLSearchParams({
    seo_check: token,
    route: route === "/" ? "home" : route.slice(1),
  }).toString();
  const expectedUrl = `${CANONICAL_ORIGIN}${route}?${query}`;

  if (route === "/") {
    await verifyRedirect(
      `${WWW_ORIGIN}/?${query}`,
      expectedUrl,
      "www homepage",
    );
    continue;
  }

  await verifyRedirect(
    `${CANONICAL_ORIGIN}${route}/?${query}`,
    expectedUrl,
    `${route} trailing slash`,
  );
  await verifyRedirect(
    `${WWW_ORIGIN}${route}?${query}`,
    expectedUrl,
    `${route} www`,
  );
  await verifyRedirect(
    `${WWW_ORIGIN}${route}/?${query}`,
    expectedUrl,
    `${route} www + trailing slash`,
  );
}

const report = {
  checkedAt: new Date().toISOString(),
  cacheBustToken: token,
  routes: results,
  sitemap: {
    status: sitemapResponse.status,
    urlCount: sitemapUrls.length,
    uniqueUrlCount: new Set(sitemapUrls).size,
    invalidUrls: invalidSitemapUrls,
    duplicateUrls: duplicateSitemapUrls,
  },
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length > 0) process.exitCode = 1;