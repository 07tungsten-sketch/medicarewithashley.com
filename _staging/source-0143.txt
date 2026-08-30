const modules = import.meta.glob("../blog/posts/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const CONSOLIDATED_POST_SLUGS = new Set([
  "medicare-broker-chula-vista",
  "medicare-broker-el-cajon",
  "medicare-broker-escondido",
  "medicare-broker-la-mesa",
  "medicare-broker-national-city",
  "medicare-help-south-bay-san-diego",
  "medicare-and-medi-cal-dual-coverage-california",
]);

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateFormatted: string;
  html: string;
}

function extractMeta(html: string, name: string): string {
  const match = html.match(
    new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"[^>]*>`, "i")
  );
  return match
    ? match[1]
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
    : "";
}

function extractTitle(html: string): string {
  const titleTag = html.match(/<title[^>]*>(.*?)<\/title>/is);
  if (titleTag) return titleTag[1].trim();
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return h1[1].replace(/<[^>]+>/g, "").trim();
  return "Untitled Post";
}

function extractDescription(html: string): string {
  const meta = extractMeta(html, "description");
  if (meta) return meta;
  const p = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (p) return p[1].replace(/<[^>]+>/g, "").trim().slice(0, 160);
  return "";
}

function extractBody(html: string): string {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (body) return body[1];
  // Blog post files have no <body> wrapper — strip the leading <title>/<meta>/<link>
  // head tags and return everything from the first real content element onward.
  const firstContent = html.search(/<(?:h[1-6]|p|ul|ol|blockquote|section|article|div|table)[^>]*>/i);
  return firstContent > 0 ? html.substring(firstContent) : html;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getAllPosts(): BlogPost[] {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const filename = path.split("/").pop() ?? "";
      const slug = filename.replace(/\.html?$/i, "");
      const date = extractMeta(raw, "date");
      return {
        slug,
        title: extractTitle(raw),
        description: extractDescription(raw),
        date,
        dateFormatted: formatDate(date),
        html: extractBody(raw),
      };
    })
    .filter((post) => !CONSOLIDATED_POST_SLUGS.has(post.slug))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
