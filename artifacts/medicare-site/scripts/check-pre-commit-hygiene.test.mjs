import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const projectRoot = fileURLToPath(new URL("../../../", import.meta.url));
const hookPath = join(projectRoot, ".githooks", "pre-commit");
const medicareSiteRoot = join(projectRoot, "artifacts", "medicare-site");

async function createHookFixture() {
  const fixtureRoot = await mkdtemp(join(tmpdir(), "pre-commit-hygiene-"));
  const fixtureMedicareSiteRoot = join(fixtureRoot, "artifacts", "medicare-site");

  await mkdir(join(fixtureMedicareSiteRoot, "e2e"), { recursive: true });
  await mkdir(join(fixtureMedicareSiteRoot, "scripts"), { recursive: true });
  await mkdir(join(fixtureMedicareSiteRoot, "src"), { recursive: true });
  await cp(
    join(medicareSiteRoot, "e2e", "check-viewport-guards.mjs"),
    join(fixtureMedicareSiteRoot, "e2e", "check-viewport-guards.mjs"),
  );
  await cp(
    join(medicareSiteRoot, "scripts", "check-unit-test-hygiene.mjs"),
    join(fixtureMedicareSiteRoot, "scripts", "check-unit-test-hygiene.mjs"),
  );

  return fixtureRoot;
}

function runHook(fixtureRoot) {
  return spawnSync("sh", [hookPath], {
    cwd: fixtureRoot,
    encoding: "utf8",
  });
}

async function withHookFixture(callback) {
  const fixtureRoot = await createHookFixture();

  try {
    await callback(fixtureRoot);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
}

test("allows a clean unit test and Playwright spec through the hook", async () => {
  await withHookFixture(async (fixtureRoot) => {
    await writeFile(
      join(
        fixtureRoot,
        "artifacts",
        "medicare-site",
        "src",
        "ordinary.test.ts",
      ),
      'test("ordinary", () => {});',
    );
    await writeFile(
      join(
        fixtureRoot,
        "artifacts",
        "medicare-site",
        "e2e",
        "ordinary.spec.ts",
      ),
      `
        test.use({ viewport: { width: 1280, height: 720 } });
        test.skip(({ isMobile }) => isMobile, "desktop-only");
        test("renders the page", async ({ page }) => {});
      `,
    );

    const result = runHook(fixtureRoot);

    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout, /unit-test hygiene check passed/);
    assert.match(result.stdout, /spec-hygiene checks passed/);
  });
});

test("blocks a focused Vitest fixture with the actionable unit-test message", async () => {
  await withHookFixture(async (fixtureRoot) => {
    await writeFile(
      join(
        fixtureRoot,
        "artifacts",
        "medicare-site",
        "src",
        "focused.test.ts",
      ),
      'test.only("focused", () => {});',
    );

    const result = runHook(fixtureRoot);
    const output = `${result.stdout}\n${result.stderr}`;

    assert.equal(result.status, 1, output);
    assert.match(output, /unit-test hygiene check failed/);
    assert.match(
      output,
      /Fix the focused Vitest test or suite listed above, then commit again\./,
    );
  });
});

test("blocks a focused Playwright fixture with the existing spec-hygiene message", async () => {
  await withHookFixture(async (fixtureRoot) => {
    await writeFile(
      join(
        fixtureRoot,
        "artifacts",
        "medicare-site",
        "e2e",
        "focused.spec.ts",
      ),
      `
        test.only("renders the page", async ({ page }) => {});
      `,
    );

    const result = runHook(fixtureRoot);
    const output = `${result.stdout}\n${result.stderr}`;

    assert.equal(result.status, 1, output);
    assert.match(output, /focused-test check failed/);
    assert.match(output, /Commit blocked by viewport-guard check\./);
  });
});