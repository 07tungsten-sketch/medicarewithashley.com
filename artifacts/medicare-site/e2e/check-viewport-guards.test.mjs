import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const checkerPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "check-viewport-guards.mjs"
);

const playwrightSpecExtensions = [
  ".spec.js",
  ".spec.jsx",
  ".spec.mjs",
  ".spec.mjsx",
  ".spec.cjs",
  ".spec.cjsx",
  ".spec.ts",
  ".spec.tsx",
  ".spec.mts",
  ".spec.mtsx",
  ".spec.cts",
  ".spec.ctsx",
];

const fixtures = [
  {
    name: "clean spec",
    source: `
      import { test } from "@playwright/test";

      test.use({ viewport: { width: 1280, height: 720 } });
      test.skip(({ isMobile }) => isMobile, "desktop-only");
      test("renders the page", async ({ page }) => {});
    `,
    expectedExitCode: 0,
  },
  {
    name: "viewport-only spec",
    source: `
      import { test } from "@playwright/test";

      test.use({ viewport: { width: 375, height: 812 } });
      test("renders the mobile sheet", async ({ page }) => {});
    `,
    expectedExitCode: 1,
  },
  {
    name: "test.only spec",
    source: `
      import { test } from "@playwright/test";

      test.only("renders the page", async ({ page }) => {});
    `,
    expectedExitCode: 1,
  },
  {
    name: "describe.only spec",
    source: `
      import { test } from "@playwright/test";

      test.describe.only("page", () => {
        test("renders the page", async ({ page }) => {});
      });
    `,
    expectedExitCode: 1,
  },
  {
    name: "nested viewport-only spec",
    relativeDirectory: join("nested", "mobile"),
    source: `
      import { test } from "@playwright/test";

      test.use({ viewport: { width: 375, height: 812 } });
      test("renders the mobile sheet", async ({ page }) => {});
    `,
    expectedExitCode: 1,
  },
  {
    name: "nested test.only spec",
    relativeDirectory: join("nested", "focused"),
    source: `
      import { test } from "@playwright/test";

      test.only("renders the page", async ({ page }) => {});
    `,
    expectedExitCode: 1,
  },
  {
    name: "nested suite.only spec",
    relativeDirectory: join("nested", "focused-suite"),
    source: `
      import { test } from "@playwright/test";

      suite.only("page", () => {
        test("renders the page", async ({ page }) => {});
      });
    `,
    expectedExitCode: 1,
  },
];

for (const extension of playwrightSpecExtensions) {
  for (const fixture of fixtures) {
    test(
      `checker rejects or accepts a ${fixture.name} as expected for ${extension}`,
      async () => {
        const fixtureDirectory = await mkdtemp(join(tmpdir(), "viewport-guards-"));

        try {
          const targetDirectory = fixture.relativeDirectory
            ? join(fixtureDirectory, fixture.relativeDirectory)
            : fixtureDirectory;
          await mkdir(targetDirectory, { recursive: true });
          await writeFile(
            join(targetDirectory, `synthetic${extension}`),
            fixture.source
          );

          const result = spawnSync(
            process.execPath,
            [checkerPath, fixtureDirectory],
            { encoding: "utf8" }
          );

          assert.equal(
            result.status,
            fixture.expectedExitCode,
            `${fixture.name} (${extension}) produced unexpected output:\n${result.stdout}\n${result.stderr}`
          );
        } finally {
          await rm(fixtureDirectory, { recursive: true, force: true });
        }
      }
    );
  }
}