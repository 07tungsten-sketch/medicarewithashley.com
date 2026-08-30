import { test, expect } from "@playwright/test";

test.describe("prerendered route hydration", () => {
  test("keeps route content visible while its lazy chunk is delayed", async ({ page }) => {
    let releaseChunk!: () => void;
    const chunkCanLoad = new Promise<void>((resolve) => {
      releaseChunk = resolve;
    });

    let markChunkRequested!: () => void;
    const chunkRequested = new Promise<void>((resolve) => {
      markChunkRequested = resolve;
    });

    await page.route(
      /\/assets\/MedicareBasics-[^/]+\.js(?:\?.*)?$/,
      async (route) => {
        markChunkRequested();
        await chunkCanLoad;
        await route.continue();
      },
    );

    try {
      await page.goto("/medicare-basics", { waitUntil: "domcontentloaded" });
      await chunkRequested;

      await expect(
        page.getByRole("heading", {
          level: 1,
          name: "Medicare Basics — Explained Simply",
        }),
      ).toBeVisible();
    } finally {
      releaseChunk();
    }

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Medicare Basics — Explained Simply",
      }),
    ).toBeVisible();
  });
});