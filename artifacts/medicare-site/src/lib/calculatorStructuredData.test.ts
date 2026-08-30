import { describe, expect, it } from "vitest";
import { faqs as partBFaqs } from "@/pages/PartBPenaltyCalculator";
import { faqs as partDFaqs } from "@/pages/PartDPenaltyCalculator";
import {
  buildCalculatorApplicationSchema,
  buildCalculatorFaqSchema,
} from "./calculatorStructuredData";

const calculators = [
  {
    name: "Part B",
    faqs: partBFaqs,
    url: "https://medicarewithashley.com/part-b-penalty-calculator",
    application: {
      name: "Medicare Part B Late Enrollment Penalty Calculator",
      description:
        "Free browser-based calculator that estimates the Medicare Part B late enrollment penalty using the 2026 standard Part B premium.",
    },
  },
  {
    name: "Part D",
    faqs: partDFaqs,
    url: "https://medicarewithashley.com/part-d-penalty-calculator",
    application: {
      name: "Medicare Part D Late Enrollment Penalty Calculator",
      description:
        "Free browser-based calculator that estimates the Medicare Part D late enrollment penalty using the 2026 national base beneficiary premium.",
    },
  },
] as const;

describe("calculator structured data source contracts", () => {
  for (const calculator of calculators) {
    describe(`${calculator.name} calculator`, () => {
      const faqSchema = buildCalculatorFaqSchema(
        calculator.faqs,
        calculator.url,
      );
      const applicationSchema = buildCalculatorApplicationSchema({
        ...calculator.application,
        url: calculator.url,
      });

      it("has non-empty, unique FAQ source entries", () => {
        expect(calculator.faqs.length).toBeGreaterThan(0);
        expect(new Set(calculator.faqs.map((faq) => faq.q)).size).toBe(
          calculator.faqs.length,
        );
        for (const faq of calculator.faqs) {
          expect(faq.q.trim()).not.toBe("");
          expect(faq.a.trim()).not.toBe("");
        }
      });

      it("builds one FAQ entry for every visible FAQ source entry", () => {
        expect(faqSchema["@context"]).toBe("https://schema.org");
        expect(faqSchema["@type"]).toBe("FAQPage");
        expect(faqSchema.url).toBe(calculator.url);
        expect(faqSchema.mainEntity).toHaveLength(calculator.faqs.length);
        expect(faqSchema.mainEntity.map((faq) => faq.name)).toEqual(
          calculator.faqs.map((faq) => faq.q),
        );
        expect(
          faqSchema.mainEntity.map((faq) => faq.acceptedAnswer.text),
        ).toEqual(calculator.faqs.map((faq) => faq.a));
        expect(
          faqSchema.mainEntity.every(
            (faq) =>
              faq["@type"] === "Question" &&
              faq.acceptedAnswer["@type"] === "Answer" &&
              faq.acceptedAnswer.url === calculator.url,
          ),
        ).toBe(true);
      });

      it("builds a free browser-based WebApplication with canonical identity", () => {
        expect(applicationSchema).toMatchObject({
          "@context": "https://schema.org",
          "@type": ["SoftwareApplication", "WebApplication"],
          name: calculator.application.name,
          description: calculator.application.description,
          url: calculator.url,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web browser",
          browserRequirements: "Requires JavaScript",
          isAccessibleForFree: true,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        });
      });
    });
  }
});