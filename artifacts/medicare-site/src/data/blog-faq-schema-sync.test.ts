/**
 * Keep blog posts' visible FAQs and FAQPage JSON-LD in sync.
 *
 * Blog articles are intentionally stored as static HTML while their structured
 * data lives in TypeScript. Discover every post that has both sources and
 * compare them here so a copy edit cannot silently give visitors and search
 * engines different answers.
 */

import { readFileSync, readdirSync } from "node:fs";
import { basename, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getBlogStructuredData } from "./blogStructuredData";

const BLOG_POST_DIR = resolve(__dirname, "../blog/posts");

type FaqEntry = {
  question: string;
  answer: string;
};

type BlogFaqSources = {
  slug: string;
  visibleFaqs: FaqEntry[];
  schemaFaqs: FaqEntry[];
};

type DiscoveredBlogPost = {
  slug: string;
  visibleFaqs: FaqEntry[] | null;
  schemaFaqs: FaqEntry[] | null;
};

function normalizeHtmlText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(parseInt(code, 16)),
    )
    .replace(/\s+/g, " ")
    .trim();
}

function loadVisibleFaqs(postPath: string): FaqEntry[] | null {
  const html = readFileSync(postPath, "utf-8");
  const faqSections = [
    ...html.matchAll(
      /<h2\b[^>]*>\s*Frequently asked questions\s*<\/h2>([\s\S]*?)(?=<h2\b|$)/gi,
    ),
  ].map(([, section]) => section);

  if (faqSections.length === 0) return null;

  return faqSections.flatMap((faqSection) =>
    [...faqSection.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi)].map(
      ([, question, answer]) => ({
        question: normalizeHtmlText(question),
        answer: normalizeHtmlText(answer),
      }),
    ),
  );
}

function loadSchemaFaqs(slug: string): FaqEntry[] | null {
  const structuredData = getBlogStructuredData(slug);
  if (!structuredData || !("faqSchema" in structuredData)) return null;

  return structuredData.faqSchema.mainEntity.map((entry) => ({
    question: entry.name,
    answer: entry.acceptedAnswer.text,
  }));
}

function discoverBlogFaqSources(): {
  postsWithVisibleFaqs: Array<{
    slug: string;
    visibleFaqs: FaqEntry[];
    schemaFaqs: FaqEntry[] | null;
  }>;
  postsWithSchema: Array<{ slug: string; visibleFaqs: FaqEntry[] | null }>;
  postsWithBothSources: BlogFaqSources[];
} {
  const blogPosts = readdirSync(BLOG_POST_DIR)
    .filter((filename) => filename.endsWith(".html"))
    .sort()
    .map((filename) => ({
      slug: basename(filename, ".html"),
      path: resolve(BLOG_POST_DIR, filename),
    }));

  const discoveredPosts: DiscoveredBlogPost[] = blogPosts.map(({ slug, path }) => ({
    slug,
    visibleFaqs: loadVisibleFaqs(path),
    schemaFaqs: loadSchemaFaqs(slug),
  }));

  const postsWithVisibleFaqs = discoveredPosts.filter(
    (
      post,
    ): post is {
      slug: string;
      visibleFaqs: FaqEntry[];
      schemaFaqs: FaqEntry[] | null;
    } => post.visibleFaqs !== null,
  );

  const postsWithSchema = discoveredPosts
    .filter(
      (
        post,
      ): post is {
        slug: string;
        visibleFaqs: FaqEntry[] | null;
        schemaFaqs: FaqEntry[];
      } => post.schemaFaqs !== null,
    );

  return {
    postsWithVisibleFaqs,
    postsWithSchema,
    postsWithBothSources: postsWithSchema.flatMap((post) =>
      post.visibleFaqs
        ? [
            {
              slug: post.slug,
              visibleFaqs: post.visibleFaqs,
              schemaFaqs: post.schemaFaqs,
            },
          ]
        : [],
    ),
  };
}

const { postsWithVisibleFaqs, postsWithSchema, postsWithBothSources } =
  discoverBlogFaqSources();

describe("blog FAQ visible HTML ↔ FAQPage JSON-LD sync", () => {
  it("requires every visible FAQ section to have FAQPage JSON-LD", () => {
    for (const post of postsWithVisibleFaqs) {
      expect(
        post.schemaFaqs,
        `Blog post "${post.slug}" has a visible Frequently asked questions ` +
          `section but no FAQPage JSON-LD in blogStructuredData.ts.`,
      ).not.toBeNull();
    }
  });

  it("requires every blog FAQPage schema to have a visible FAQ section", () => {
    for (const post of postsWithSchema) {
      expect(
        post.visibleFaqs,
        `Blog post "${post.slug}" has FAQPage JSON-LD but no visible ` +
          `Frequently asked questions section in ${BLOG_POST_DIR}/${post.slug}.html.`,
      ).not.toBeNull();
    }
  });

  it.each(postsWithBothSources)(
    "$slug matches every visible FAQ question and answer to its FAQPage JSON-LD",
    ({ slug, visibleFaqs, schemaFaqs }) => {
      expect(
        schemaFaqs.length,
        `Blog post "${slug}" has ${schemaFaqs.length} FAQPage JSON-LD entries, ` +
          `but its visible HTML has ${visibleFaqs.length}. Add or remove the ` +
          `corresponding question and answer in both sources.`,
      ).toBe(visibleFaqs.length);

      for (const [index, visibleFaq] of visibleFaqs.entries()) {
        const schemaFaq = schemaFaqs[index];
        expect(
          schemaFaq?.question,
          `Blog post "${slug}" FAQ entry ${index + 1} question differs between ` +
            `the visible HTML and FAQPage JSON-LD.\nVisible: ${visibleFaq.question}\n` +
            `Schema: ${schemaFaq?.question ?? "(missing)"}`,
        ).toBe(visibleFaq.question);
        expect(
          schemaFaq?.answer,
          `Blog post "${slug}" FAQ entry ${index + 1} answer differs for ` +
            `"${visibleFaq.question}".\nVisible: ${visibleFaq.answer}\n` +
            `Schema: ${schemaFaq?.answer ?? "(missing)"}`,
        ).toBe(visibleFaq.answer);
      }
    },
  );
});
