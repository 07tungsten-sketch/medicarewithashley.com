import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { cityPages } from "./cityPages";
import { providerPages } from "./providerPages";

interface RouteDeclaration {
  slug: string;
  source: string;
}

function canonicalPath(slug: string): string {
  const trimmed = slug.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "/";
}

function loadStaticRouteDeclarations(): RouteDeclaration[] {
  const appPath = resolve(__dirname, "../App.tsx");
  const source = readFileSync(appPath, "utf-8");

  return [...source.matchAll(/<Route\b[^>]*\bpath="([^"]+)"/g)]
    .map((match) => match[1].trim())
    .filter((path) => !path.includes(":"))
    .map((path) => ({
      slug: canonicalPath(path),
      source: `App.tsx static route "${path}"`,
    }));
}

function findConflicts(
  declarations: RouteDeclaration[],
): Map<string, RouteDeclaration[]> {
  const declarationsBySlug = new Map<string, RouteDeclaration[]>();

  for (const declaration of declarations) {
    const slug = canonicalPath(declaration.slug);
    const existing = declarationsBySlug.get(slug) ?? [];
    existing.push({ ...declaration, slug });
    declarationsBySlug.set(slug, existing);
  }

  return new Map(
    [...declarationsBySlug].filter(([, sources]) => sources.length > 1),
  );
}

function formatConflicts(
  conflicts: Map<string, RouteDeclaration[]>,
): string {
  const details = [...conflicts]
    .sort(([slugA], [slugB]) => slugA.localeCompare(slugB))
    .map(
      ([slug, declarations]) =>
        `- ${slug}\n${declarations
          .map(({ source }) => `  - ${source}`)
          .join("\n")}`,
    )
    .join("\n");

  return (
    "Conflicting Medicare route slugs detected. Each path must be declared " +
    "by exactly one static, city, or provider route source.\n" +
    details
  );
}

describe("Medicare route slug collisions", () => {
  it("keeps static, city, and provider route slugs unique", () => {
    const declarations: RouteDeclaration[] = [
      ...loadStaticRouteDeclarations(),
      ...cityPages.map((page) => ({
        slug: page.slug,
        source: `cityPages.ts city page "${page.city}"`,
      })),
      ...providerPages.map((page) => ({
        slug: page.slug,
        source: `providerPages.ts provider page "${page.title}"`,
      })),
    ];
    const conflicts = findConflicts(declarations);

    expect(
      conflicts.size,
      conflicts.size > 0 ? formatConflicts(conflicts) : undefined,
    ).toBe(0);
  });

  it("identifies a conflicting slug and every source that declares it", () => {
    const conflicts = findConflicts([
      {
        slug: "/shared-medicare-page",
        source: 'App.tsx static route "/shared-medicare-page"',
      },
      {
        slug: "shared-medicare-page",
        source: 'cityPages.ts city page "Example City"',
      },
      {
        slug: "shared-medicare-page/",
        source: 'providerPages.ts provider page "Example Provider"',
      },
    ]);
    const message = formatConflicts(conflicts);

    expect(message).toContain("- /shared-medicare-page");
    expect(message).toContain(
      'App.tsx static route "/shared-medicare-page"',
    );
    expect(message).toContain('cityPages.ts city page "Example City"');
    expect(message).toContain(
      'providerPages.ts provider page "Example Provider"',
    );
  });
});