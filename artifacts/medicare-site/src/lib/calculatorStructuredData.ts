export interface CalculatorFaq {
  q: string;
  a: string;
}

export interface CalculatorApplicationDetails {
  name: string;
  description: string;
  url: string;
}

export function buildCalculatorFaqSchema(
  faqs: readonly CalculatorFaq[],
  canonicalUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: canonicalUrl,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
        url: canonicalUrl,
      },
    })),
  };
}

export function buildCalculatorApplicationSchema({
  name,
  description,
  url,
}: CalculatorApplicationDetails) {
  return {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name,
    description,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web browser",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}