import { Helmet } from "react-helmet-async";

const SITE_NAME = "Medicare with Ashley";
const BASE_URL = "https://medicarewithashley.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph.jpg`;
const DEFAULT_DESCRIPTION =
  "San Diego's independent Medicare broker. Free help with Medicare Advantage, Supplements & Part D plans. Serving all of San Diego County. Call (619) 947-2325.";
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;
const BRAND_SUFFIX = " | Medicare with Ashley";

interface SEOHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  /** Optional JSON-LD structured data object injected into <head> as application/ld+json */
  schemaJson?: object;
}

export function compactSeoText(value: string, maxLength: number): string {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLength) return normalized;

  const slice = normalized.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const boundary = lastSpace >= Math.floor(maxLength * 0.7) ? lastSpace : slice.length;
  return `${slice.slice(0, boundary).trimEnd()}…`;
}

export function compactSeoTitle(title: string): string {
  const normalized = title.trim().replace(/\s+/g, " ");
  if (normalized.length <= TITLE_LIMIT) return normalized;

  if (normalized.endsWith(BRAND_SUFFIX)) {
    const topic = normalized.slice(0, -BRAND_SUFFIX.length).trimEnd();
    return `${compactSeoText(topic, TITLE_LIMIT - BRAND_SUFFIX.length)}${BRAND_SUFFIX}`;
  }

  return compactSeoText(normalized, TITLE_LIMIT);
}

export function canonicalUrlFor(pathname = "/"): string {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  return path === "/" ? `${BASE_URL}/` : `${BASE_URL}${path}`;
}

export default function SEOHead({ title, description, canonical, ogImage, ogType = "website", schemaJson }: SEOHeadProps) {
  const metaTitle = compactSeoTitle(title);
  const metaDescription = compactSeoText(description ?? DEFAULT_DESCRIPTION, DESCRIPTION_LIMIT);
  const canonicalUrl = canonicalUrlFor(canonical);
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      {schemaJson && (
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      )}

      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
       <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
