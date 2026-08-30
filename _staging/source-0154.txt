import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "wouter";
import Home from "./Home";

const EXPECTED_PRIORITY_QUESTIONS = [
  "Does it cost anything to work with a Medicare broker?",
  "Do you represent only one insurance company?",
  "Can you review the Medicare plan I already have?",
  "What if my current Medicare plan is already the best choice?",
  "Do you only help people who are turning 65?",
  "Can we meet in person if I live in San Diego County?",
  "When should I sign up for Medicare?",
] as const;

function renderFaqPreview(): string {
  const staticLocation = (): [string, (path: string) => void] => [
    "/",
    () => {},
  ];
  const markup = renderToStaticMarkup(
    <HelmetProvider>
      <Router hook={staticLocation}>
        <Home />
      </Router>
    </HelmetProvider>,
  );

  const sectionMatch = markup.match(
    /<section[^>]*data-testid="faq-preview-section"[^>]*>([\s\S]*?)<\/section>/,
  );

  expect(
    sectionMatch,
    "The homepage must include its FAQ preview section (data-testid=\"faq-preview-section\").",
  ).not.toBeNull();

  return sectionMatch![1];
}

describe("homepage FAQ preview", () => {
  it("renders exactly seven FAQ details items", () => {
    const previewMarkup = renderFaqPreview();
    const renderedFaqCount = (previewMarkup.match(/<details(?:\s|>)/g) ?? [])
      .length;

    expect(
      renderedFaqCount,
      "The homepage FAQ preview is intentionally limited to seven questions. Check the FAQ preview rendering in Home.tsx.",
    ).toBe(7);
  });

  it("renders the seven priority questions in their intended order", () => {
    const previewMarkup = renderFaqPreview();
    const renderedQuestions = Array.from(
      previewMarkup.matchAll(
        /<summary[^>]*>[\s\S]*?<h3[^>]*>([^<]+)<\/h3>/g,
      ),
      (match) => match[1],
    );

    expect(
      renderedQuestions,
      [
        "The homepage FAQ preview must keep its seven conversion-focused questions in the intended order.",
        `Expected: ${JSON.stringify(EXPECTED_PRIORITY_QUESTIONS)}`,
        `Received: ${JSON.stringify(renderedQuestions)}`,
        "If this change is intentional, update EXPECTED_PRIORITY_QUESTIONS in HomeFaqPreview.test.tsx.",
      ].join("\n"),
    ).toEqual(EXPECTED_PRIORITY_QUESTIONS);
  });

  it('links "See all Medicare FAQs" to /faq', () => {
    const previewMarkup = renderFaqPreview();

    expect(previewMarkup).toMatch(
      /<a[^>]*href="\/faq"[^>]*>See all Medicare FAQs\s*<svg/,
    );
  });
});