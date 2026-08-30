import { describe, expect, it } from "vitest";
import { canonicalUrlFor, compactSeoText, compactSeoTitle } from "./SEOHead";

describe("SEO metadata length guards", () => {
  it("preserves metadata already within the recommended limit", () => {
    expect(compactSeoTitle("Medicare Broker San Diego | Medicare with Ashley")).toBe(
      "Medicare Broker San Diego | Medicare with Ashley",
    );
    expect(compactSeoText("Short description", 160)).toBe("Short description");
  });

  it("shortens long titles while retaining the brand suffix", () => {
    const title = compactSeoTitle(
      "Medicare and Alvarado Hospital (now UC San Diego Health East Campus) | Medicare with Ashley",
    );

    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toMatch(/\| Medicare with Ashley$/);
  });

  it("shortens long descriptions at a word boundary", () => {
    const description = compactSeoText("Medicare guidance ".repeat(20), 160);

    expect(description.length).toBeLessThanOrEqual(160);
    expect(description).toMatch(/…$/);
  });
});

describe("canonical URL formatting", () => {
  it("keeps the homepage slash and strips trailing slashes from inner pages", () => {
    expect(canonicalUrlFor("/")).toBe("https://medicarewithashley.com/");
    expect(canonicalUrlFor("/about/")).toBe("https://medicarewithashley.com/about");
    expect(canonicalUrlFor("/blog/article///")).toBe(
      "https://medicarewithashley.com/blog/article",
    );
  });
});