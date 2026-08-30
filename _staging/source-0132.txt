/**
 * Sitemap blog coverage guard.
 *
 * Every local HTML blog post is either:
 *   1. a public BlogPost whose canonical URL and source date appear in the
 *      sitemap, or
 *   2. explicitly consolidated into a canonical non-blog route with a
 *      server-side redirect.
 *
 * This keeps a new routable blog post from silently becoming invisible to
 * search engines and keeps sitemap lastmod values tied to the source content.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer, type Server } from "http";
import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";
import app from "../../../api-server/src/app";
import { BLOG_REDIRECTS } from "../../../api-server/src/routes/blogRedirects";
import {
  CONSOLIDATED_POST_SLUGS,
  getAllPosts,
} from "../lib/blogPosts";

const SITE_BASE = "https://medicarewithashley.com";
const BLOG_POST_DIR = resolve(__dirname, "../blog/posts");
const SITEMAP_PATH = resolve(__dirname, "../../public/sitemap.xml");
const API_ARTIFACT_PATH = resolve(
  __dirname,
  "../../../api-server/.replit-artifact/artifact.toml",
);

function parseSitemapBlogEntries(xml: string): Map<string, string> {
  const entries = new Map<string, string>();
  const entryRegex = /<url>[\s\S]*?<\/url>/g;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(xml)) !== null) {
    const locMatch = match[0].match(
      /<loc>(https:\/\/medicarewithashley\.com\/blog\/([^<]+))<\/loc>/,
    );
    if (!locMatch) continue;

    const lastmodMatch = match[0].match(/<lastmod>([^<]+)<\/lastmod>/);
    entries.set(locMatch[2], lastmodMatch?.[1]?.trim() ?? "");
  }

  return entries;
}

function loadAllSitemapBlogEntries(): Map<string, string> {
  return parseSitemapBlogEntries(readFileSync(SITEMAP_PATH, "utf-8"));
}

function loadSitemapPaths(): Set<string> {
  const xml = readFileSync(SITEMAP_PATH, "utf-8");
  const paths = new Set<string>();
  const locRegex = /<loc>(https:\/\/medicarewithashley\.com\/[^<]*)<\/loc>/g;
  let match: RegExpExecArray | null;

  while ((match = locRegex.exec(xml)) !== null) {
    paths.add(new URL(match[1].trim()).pathname);
  }

  return paths;
}

function loadSitemapBlogSectionEntries(): Map<string, string> {
  const xml = readFileSync(SITEMAP_PATH, "utf-8");
  const marker = "<!-- Blog posts —";
  const sectionStart = xml.indexOf(marker);
  if (sectionStart === -1) {
    throw new Error(
      `Could not find "${marker}" comment in public/sitemap.xml. ` +
        "The blog-coverage guard requires this comment to delimit the blog section.",
    );
  }

  // Stop at the next section comment so only the documented Blog posts section
  // is checked. This prevents an entry accidentally placed in another section
  // from masking a stale or missing blog entry here.
  const afterMarker = sectionStart + marker.length;
  const nextCommentIndex = xml.indexOf("<!--", afterMarker);
  const blogSection =
    nextCommentIndex === -1
      ? xml.slice(afterMarker)
      : xml.slice(afterMarker, nextCommentIndex);

  return parseSitemapBlogEntries(blogSection);
}

function findOrphanedBlogSlugs(
  sitemapEntries: Map<string, string>,
  knownSlugs: Set<string>,
): string[] {
  return [...sitemapEntries.keys()].filter((slug) => !knownSlugs.has(slug));
}

function loadSourceBlogSlugs(): Set<string> {
  return new Set(
    readdirSync(BLOG_POST_DIR)
      .filter((filename) => filename.endsWith(".html"))
      .map((filename) => filename.replace(/\.html$/i, "")),
  );
}

function loadSourceBlogDates(): Map<string, string> {
  const dates = new Map<string, string>();

  for (const filename of readdirSync(BLOG_POST_DIR)) {
    if (!filename.endsWith(".html")) continue;
    const slug = filename.replace(/\.html$/i, "");
    const html = readFileSync(resolve(BLOG_POST_DIR, filename), "utf-8");
    const date = html.match(/<meta\s+name="date"\s+content="([^"]+)"/i)?.[1];
    if (date) dates.set(slug, date);
  }

  return dates;
}

function loadApiProxyPaths(): Set<string> {
  const artifactToml = readFileSync(API_ARTIFACT_PATH, "utf-8");
  const pathsArray = artifactToml.match(/paths\s*=\s*\[([\s\S]*?)\]/)?.[1] ?? "";
  return new Set(
    [...pathsArray.matchAll(/"([^"]+)"/g)].map((match) => match[1]),
  );
}

function extractInternalBlogPaths(html: string, sourcePost: string): string[] {
  const paths: string[] = [];
  const sourceUrl = `${SITE_BASE}/blog/${sourcePost}`;

  for (const match of html.matchAll(
    /href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+))/gi,
  )) {
    const href = (match[1] ?? match[2] ?? match[3] ?? "").trim();
    if (!href || href.startsWith("#")) continue;

    let url: URL;
    try {
      url = new URL(href, sourceUrl);
    } catch {
      continue;
    }

    if (url.origin === SITE_BASE && url.pathname.startsWith("/blog/")) {
      paths.push(url.pathname);
    }
  }

  return paths;
}

function findStaleInternalBlogLinks(
  posts: Array<{ sourcePost: string; html: string }>,
  publicSlugs: Set<string>,
  redirectPaths: Set<string>,
): Array<{ sourcePost: string; destinationPath: string }> {
  return posts.flatMap(({ sourcePost, html }) =>
    extractInternalBlogPaths(html, sourcePost)
      .filter((destinationPath) => {
        const destinationSlug = destinationPath.replace(/^\/blog\//, "");
        return (
          !publicSlugs.has(destinationSlug) &&
          !redirectPaths.has(destinationPath)
        );
      })
      .map((destinationPath) => ({ sourcePost, destinationPath })),
  );
}

describe("sitemap blog coverage", () => {
  const sitemapEntries = loadSitemapBlogSectionEntries();
  const allSitemapBlogEntries = loadAllSitemapBlogEntries();
  const sourceSlugs = loadSourceBlogSlugs();
  const sourceDates = loadSourceBlogDates();
  const publicPosts = getAllPosts();
  const publicSlugs = new Set(publicPosts.map((post) => post.slug));

  it("Blog posts section contains at least one <loc> entry", () => {
    expect(sitemapEntries.size).toBeGreaterThan(0);
  });

  it("every local blog source is classified as public or consolidated", () => {
    const classifiedSlugs = new Set([
      ...publicSlugs,
      ...CONSOLIDATED_POST_SLUGS,
    ]);

    expect(
      sourceSlugs,
      "Every HTML file in src/blog/posts must be represented by getAllPosts() or CONSOLIDATED_POST_SLUGS.",
    ).toEqual(classifiedSlugs);
  });

  it("every public blog post appears in the sitemap", () => {
    const missing = publicPosts
      .filter((post) => !sitemapEntries.has(post.slug))
      .map((post) => post.slug);

    expect(
      missing,
      `Sitemap is missing public blog posts. Add canonical <loc> entries for: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("every sitemap blog entry maps to a public blog post", () => {
    const orphaned = findOrphanedBlogSlugs(allSitemapBlogEntries, publicSlugs);

    expect(
      orphaned,
      `Sitemap contains blog entries that are not public posts, including entries outside the Blog posts section: ${orphaned.join(", ")}`,
    ).toEqual([]);
  });

  it("detects an orphaned blog URL outside the Blog posts section", () => {
    const sitemapWithOrphanOutsideSection = `
      <url>
        <loc>${SITE_BASE}/blog/removed-post</loc>
        <lastmod>2026-08-30</lastmod>
      </url>
      <!-- Blog posts — ordered most recent first -->
      <url>
        <loc>${SITE_BASE}/blog/known-post</loc>
        <lastmod>2026-08-30</lastmod>
      </url>
    `;
    const orphaned = findOrphanedBlogSlugs(
      parseSitemapBlogEntries(sitemapWithOrphanOutsideSection),
      new Set(["known-post"]),
    );

    expect(orphaned).toEqual(["removed-post"]);
  });

  it("does not leave blog entries outside the Blog posts section", () => {
    const misplaced = [...allSitemapBlogEntries.keys()].filter(
      (slug) => !sitemapEntries.has(slug),
    );

    expect(
      misplaced,
      `Sitemap blog entries must be under the Blog posts section: ${misplaced.join(", ")}`,
    ).toEqual([]);
  });

  for (const post of publicPosts) {
    it(`uses the source date for /blog/${post.slug}`, () => {
      expect(
        sitemapEntries.get(post.slug),
        `Sitemap lastmod for /blog/${post.slug} must match the source <meta name="date"> value.`,
      ).toBe(sourceDates.get(post.slug));
      expect(
        post.date,
        `Blog post /blog/${post.slug} must have a source date.`,
      ).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it(`uses the canonical URL for /blog/${post.slug}`, () => {
      const expectedUrl = `${SITE_BASE}/blog/${post.slug}`;
      expect(
        sitemapEntries.has(post.slug),
        `Sitemap must contain ${expectedUrl}.`,
      ).toBe(true);
    });
  }
});

describe("internal blog link coverage", () => {
  const publicSlugs = new Set(getAllPosts().map((post) => post.slug));
  const redirectPaths = new Set(Object.keys(BLOG_REDIRECTS));
  const blogPosts = readdirSync(BLOG_POST_DIR)
    .filter((filename) => filename.endsWith(".html"))
    .sort()
    .map((filename) => ({
      sourcePost: filename.replace(/\.html$/i, ""),
      html: readFileSync(resolve(BLOG_POST_DIR, filename), "utf-8"),
    }));
  const staleLinks = findStaleInternalBlogLinks(
    blogPosts,
    publicSlugs,
    redirectPaths,
  );

  it("only links to public posts or explicitly redirected blog URLs", () => {
    expect(
      staleLinks,
      staleLinks.length > 0
        ? [
            "Stale internal blog links found:",
            ...staleLinks.map(
              ({ sourcePost, destinationPath }) =>
                `- ${sourcePost} links to ${destinationPath}`,
            ),
          ].join("\n")
        : undefined,
    ).toEqual([]);
  });
});

describe("internal blog link parsing", () => {
  const publicSlugs = new Set(["published-post"]);
  const redirectPaths = new Set(["/blog/legacy-post"]);

  it("resolves relative, root-relative, absolute, query/hash, and redirected links", () => {
    const html = `
      <a href="published-post">Relative</a>
      <a href="/blog/published-post?source=article#details">Root-relative</a>
      <a href="https://medicarewithashley.com/blog/published-post">Absolute</a>
      <a href="/blog/legacy-post">Redirected</a>
    `;

    expect(extractInternalBlogPaths(html, "current-post")).toEqual([
      "/blog/published-post",
      "/blog/published-post",
      "/blog/published-post",
      "/blog/legacy-post",
    ]);
    expect(
      findStaleInternalBlogLinks(
        [{ sourcePost: "current-post", html }],
        publicSlugs,
        redirectPaths,
      ),
    ).toEqual([]);
  });

  it("reports stale relative links with their source post", () => {
    expect(
      findStaleInternalBlogLinks(
        [
          {
            sourcePost: "current-post",
            html: '<a href="removed-post">Removed post</a>',
          },
        ],
        publicSlugs,
        redirectPaths,
      ),
    ).toEqual([
      { sourcePost: "current-post", destinationPath: "/blog/removed-post" },
    ]);
  });

  it("reports stale unquoted links with their source post", () => {
    expect(
      findStaleInternalBlogLinks(
        [
          {
            sourcePost: "current-post",
            html: "<a href=/blog/removed-post>Removed post</a>",
          },
        ],
        publicSlugs,
        redirectPaths,
      ),
    ).toEqual([
      { sourcePost: "current-post", destinationPath: "/blog/removed-post" },
    ]);
  });
});

describe("consolidated blog redirects", () => {
  const proxyPaths = loadApiProxyPaths();
  const publicSitemapPaths = loadSitemapPaths();
  const redirectSlugs = new Set(
    Object.keys(BLOG_REDIRECTS).map((path) => path.replace(/^\/blog\//, "")),
  );

  it("has exactly one configured redirect for every consolidated source", () => {
    expect(redirectSlugs).toEqual(CONSOLIDATED_POST_SLUGS);
  });

  for (const slug of CONSOLIDATED_POST_SLUGS) {
    const sourcePath = `/blog/${slug}`;

    it(`${sourcePath} has a configured redirect destination`, () => {
      expect(
        BLOG_REDIRECTS[sourcePath as keyof typeof BLOG_REDIRECTS],
        `Add a destination for ${sourcePath} to the shared BLOG_REDIRECTS map.`,
      ).toBeTruthy();
    });

    it(`${sourcePath} is routed to the API redirect service`, () => {
      expect(
        proxyPaths.has(sourcePath),
        `Add "${sourcePath}" to the API artifact service paths or production cannot deliver its 301.`,
      ).toBe(true);
    });
  }

  it("every redirect destination is a public Medicare route", () => {
    const invalidDestinations = Object.entries(BLOG_REDIRECTS)
      .filter(([, destination]) => !publicSitemapPaths.has(destination))
      .map(([source, destination]) => `${source} -> ${destination}`);

    expect(
      invalidDestinations,
      "BLOG_REDIRECTS contains destinations that are not public Medicare routes:\n" +
        invalidDestinations.join("\n"),
    ).toEqual([]);
  });

  it("does not put consolidated blog sources in the public sitemap", () => {
    for (const slug of CONSOLIDATED_POST_SLUGS) {
      expect(
        loadAllSitemapBlogEntries().has(slug),
        `Consolidated /blog/${slug} must not be listed as a canonical sitemap URL.`,
      ).toBe(false);
    }
  });
});

describe("consolidated blog redirect HTTP behavior", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createServer(app);
    await new Promise<void>((resolveReady) => {
      server.listen(0, "127.0.0.1", resolveReady);
    });
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Could not start redirect test server");
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolveClosed, reject) => {
      server.close((error) => (error ? reject(error) : resolveClosed()));
    });
  });

  for (const [sourcePath, destination] of Object.entries(BLOG_REDIRECTS)) {
    it(`returns 301 from ${sourcePath} to ${destination}`, async () => {
      const response = await fetch(`${baseUrl}${sourcePath}`, {
        redirect: "manual",
      });

      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe(destination);
    });
  }
});