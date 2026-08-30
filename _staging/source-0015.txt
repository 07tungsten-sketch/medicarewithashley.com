import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const checkerPath = fileURLToPath(
  new URL("./check-unit-test-hygiene.mjs", import.meta.url),
);

const vitestTestExtensions = [
  ".test.js",
  ".test.jsx",
  ".test.mjs",
  ".test.mjsx",
  ".test.cjs",
  ".test.cjsx",
  ".test.ts",
  ".test.tsx",
  ".test.mts",
  ".test.mtsx",
  ".test.cts",
  ".test.ctsx",
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

const focusedCalls = [
  'test.only("focused", () => {});',
  'it.only.each([1])("focused", () => {});',
  'describe.only.each([1])("focused", () => {});',
  'suite.only.each([1])("focused", () => {});',
  'test.concurrent.only("focused", () => {});',
];

function runChecker(directory) {
  return spawnSync(process.execPath, [checkerPath, directory], {
    encoding: "utf8",
  });
}

test("allows ordinary tests", async () => {
  const fixtureDirectory = await mkdtemp(join(tmpdir(), "unit-hygiene-"));

  try {
    await writeFile(
      join(fixtureDirectory, "ordinary.test.ts"),
      'test("ordinary", () => {});',
    );

    const result = runChecker(fixtureDirectory);

    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  } finally {
    await rm(fixtureDirectory, { recursive: true, force: true });
  }
});

for (const extension of vitestTestExtensions) {
  test(`scans focused calls in ${extension} files`, async () => {
    const fixtureDirectory = await mkdtemp(join(tmpdir(), "unit-hygiene-"));

    try {
      await writeFile(
        join(fixtureDirectory, `focused${extension}`),
        'test.concurrent.only("focused", () => {});',
      );

      const result = runChecker(fixtureDirectory);

      assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
    } finally {
      await rm(fixtureDirectory, { recursive: true, force: true });
    }
  });
}

for (const focusedCall of focusedCalls) {
  test(`rejects ${focusedCall}`, async () => {
    const fixtureDirectory = await mkdtemp(join(tmpdir(), "unit-hygiene-"));

    try {
      await writeFile(
        join(fixtureDirectory, "focused.test.ts"),
        focusedCall,
      );

      const result = runChecker(fixtureDirectory);

      assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
    } finally {
      await rm(fixtureDirectory, { recursive: true, force: true });
    }
  });
}