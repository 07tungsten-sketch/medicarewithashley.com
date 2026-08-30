import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const artifactDir = path.resolve(__dirname, "..");
const distPublic = path.resolve(artifactDir, "dist/public");
const manifest = JSON.parse(
  fs.readFileSync(path.resolve(distPublic, "route-manifest.json"), "utf-8"),
);
const canonicalRoutes = new Set(manifest.canonicalRoutes);
const failures = [];
let structuredDataBlocks = 0;
let internalLinks = 0;
const schemaTypesByRoute = new Map();

const legacyRedirectPatterns = [
  /^\/blog\/medicare-broker-/,
  /^\/blog\/medicare-help-south-bay-san-diego\/?$/,
  /^\/blog\/medicare-and-medi-cal-dual-coverage-california\/?$/,
];

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function routeFile(route) {
  return route === "/"
    ? path.resolve(distPublic, "index.html")
    : path.resolve(distPublic, route.slice(1), "index.html");
}

function walkStructuredData(value, route) {
  if (Array.isArray(value)) {
    value.forEach((entry) => walkStructuredData(entry, route));
    return;
  }
  if (!value || typeof value !== "object") return;

  const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
  for (const type of types) {
    if (typeof type !== "string") continue;
    const routeTypes = schemaTypesByRoute.get(route) ?? new Set();
    routeTypes.add(type);
    schemaTypesByRoute.set(route, routeTypes);
  }
  if (
    types.some((type) => type === "LocalBusiness" || type === "InsuranceAgency") &&
    Object.hasOwn(value, "serviceType")
  ) {
    failures.push(
      `${route}: serviceType is not valid on LocalBusiness/InsuranceAgency schema`,
    );
  }

  Object.values(value).forEach((entry) => walkStructuredData(entry, route));
}

function parseJsonLdBlocks(html, route) {
  const blocks = [];
  for (const match of html.matchAll(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    structuredDataBlocks++;
    try {
      const value = JSON.parse(decodeHtml(match[1].trim()));
      blocks.push(value);
      walkStructuredData(value, route);
    } catch (error) {
      failures.push(`${route}: malformed JSON-LD (${error.message})`);
    }
  }
  return blocks;
}

function visibleTextWithoutJsonLd(html) {
  return decodeHtml(
    html
      .replace(
        /<script[^>]+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi,
        " ",
      )
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function hasSchemaType(block, expectedType) {
  const types = Array.isArray(block?.["@type"])
    ? block["@type"]
    : [block?.["@type"]];
  return types.includes(expectedType);
}

const calculatorContracts = new Map([
  [
    "/part-b-penalty-calculator",
    {
      applicationName: "Medicare Part B Late Enrollment Penalty Calculator",
      descriptionMarker: "2026 standard Part B premium",
    },
  ],
  [
    "/part-d-penalty-calculator",
    {
      applicationName: "Medicare Part D Late Enrollment Penalty Calculator",
      descriptionMarker: "2026 national base beneficiary premium",
    },
  ],
]);

for (const route of canonicalRoutes) {
  const filePath = routeFile(route);
  if (!fs.existsSync(filePath)) {
    failures.push(`${route}: prerendered HTML is missing`);
    continue;
  }

  const html = fs.readFileSync(filePath, "utf-8");
  if (/<noscript[\s>]/i.test(html)) {
    failures.push(`${route}: obsolete noscript fallback duplicates prerendered content`);
  }

  const title = decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  if (!title) failures.push(`${route}: title is missing`);
  if (title.length > 60) failures.push(`${route}: title is ${title.length} characters`);

  const description = decodeHtml(
    html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1] ?? "",
  );
  if (!description) failures.push(`${route}: meta description is missing`);
  if (description.length > 160) {
    failures.push(`${route}: meta description is ${description.length} characters`);
  }

  const expectedCanonical = `https://medicarewithashley.com${route}`;
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  if (canonical !== expectedCanonical) {
    failures.push(`${route}: canonical is ${canonical ?? "missing"}`);
  }

  for (const match of html.matchAll(/\bhref=(["'])(\/[^"'?#]*)(?:[?#][^"']*)?\1/g)) {
    const pathname = match[2];
    internalLinks++;
    if (legacyRedirectPatterns.some((pattern) => pattern.test(pathname))) {
      failures.push(`${route}: links to legacy redirect ${pathname}`);
      continue;
    }
    if (pathname === "/") continue;

    const canonicalPath = pathname.replace(/\/+$/, "");
    if (canonicalRoutes.has(canonicalPath) && pathname !== canonicalPath) {
      failures.push(`${route}: links to non-canonical ${pathname}`);
    }
  }

  const jsonLdBlocks = parseJsonLdBlocks(html, route);
  const calculatorContract = calculatorContracts.get(route);
  if (calculatorContract) {
    const faqBlocks = jsonLdBlocks.filter((block) => hasSchemaType(block, "FAQPage"));
    const applicationBlocks = jsonLdBlocks.filter(
      (block) =>
        hasSchemaType(block, "SoftwareApplication") &&
        hasSchemaType(block, "WebApplication"),
    );
    const expectedCanonical = `https://medicarewithashley.com${route}`;

    if (faqBlocks.length !== 1) {
      failures.push(
        `${route}: expected exactly one FAQPage schema, found ${faqBlocks.length}`,
      );
    }
    if (applicationBlocks.length !== 1) {
      failures.push(
        `${route}: expected exactly one SoftwareApplication/WebApplication schema, found ${applicationBlocks.length}`,
      );
    }

    const faqSchema = faqBlocks[0];
    if (faqSchema) {
      if (faqSchema["@context"] !== "https://schema.org") {
        failures.push(`${route}: FAQPage @context is invalid`);
      }
      if (faqSchema.url !== expectedCanonical) {
        failures.push(`${route}: FAQPage url is ${faqSchema.url ?? "missing"}`);
      }
      if (!Array.isArray(faqSchema.mainEntity) || faqSchema.mainEntity.length === 0) {
        failures.push(`${route}: FAQPage mainEntity must be a non-empty array`);
      } else {
        const faqNames = faqSchema.mainEntity.map((faq) => faq.name);
        if (new Set(faqNames).size !== faqNames.length) {
          failures.push(`${route}: FAQPage contains duplicate questions`);
        }
        const visibleText = visibleTextWithoutJsonLd(html);
        for (const faq of faqSchema.mainEntity) {
          if (faq["@type"] !== "Question") {
            failures.push(`${route}: FAQ entry is not typed as Question`);
          }
          if (typeof faq.name !== "string" || !visibleText.includes(faq.name)) {
            failures.push(`${route}: FAQ question is not visible: ${faq.name ?? "missing"}`);
          }
          if (faq.acceptedAnswer?.["@type"] !== "Answer") {
            failures.push(`${route}: FAQ acceptedAnswer is not typed as Answer`);
          }
          const answerText = faq.acceptedAnswer?.text;
          if (typeof answerText !== "string" || !visibleText.includes(answerText)) {
            failures.push(`${route}: FAQ answer is not visible for: ${faq.name ?? "missing"}`);
          }
          if (faq.acceptedAnswer?.url !== expectedCanonical) {
            failures.push(`${route}: FAQ answer url is not canonical for: ${faq.name ?? "missing"}`);
          }
        }
      }
    }

    const applicationSchema = applicationBlocks[0];
    if (applicationSchema) {
      if (applicationSchema["@context"] !== "https://schema.org") {
        failures.push(`${route}: application @context is invalid`);
      }
      if (applicationSchema.url !== expectedCanonical) {
        failures.push(
          `${route}: WebApplication url is ${applicationSchema.url ?? "missing"}`,
        );
      }
      if (applicationSchema.name !== calculatorContract.applicationName) {
        failures.push(
          `${route}: WebApplication name is ${applicationSchema.name ?? "missing"}`,
        );
      }
      if (
        typeof applicationSchema.description !== "string" ||
        !applicationSchema.description.includes(calculatorContract.descriptionMarker)
      ) {
        failures.push(`${route}: WebApplication description is missing the current premium context`);
      }
      if (applicationSchema.applicationCategory !== "UtilitiesApplication") {
        failures.push(`${route}: WebApplication applicationCategory is invalid`);
      }
      if (applicationSchema.operatingSystem !== "Web browser") {
        failures.push(`${route}: WebApplication operatingSystem is invalid`);
      }
      if (applicationSchema.isAccessibleForFree !== true) {
        failures.push(`${route}: WebApplication must be marked accessible for free`);
      }
      if (
        applicationSchema.offers?.["@type"] !== "Offer" ||
        applicationSchema.offers.price !== "0" ||
        applicationSchema.offers.priceCurrency !== "USD"
      ) {
        failures.push(`${route}: WebApplication offers must describe a free USD offer`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(`SEO output validation failed with ${failures.length} issue(s):`);
  failures.slice(0, 100).forEach((failure) => console.error(`  ✗ ${failure}`));
  if (failures.length > 100) {
    console.error(`  … ${failures.length - 100} more issue(s)`);
  }
  process.exit(1);
}

console.log(
  `SEO output validation passed for ${canonicalRoutes.size} routes, ` +
  `${internalLinks} internal links, and ${structuredDataBlocks} JSON-LD blocks.`,
);
for (const [route, types] of schemaTypesByRoute) {
  console.log(`  ${route}: ${[...types].sort().join(", ")}`);
}