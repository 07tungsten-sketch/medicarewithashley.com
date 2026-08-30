import { test, expect } from "@playwright/test";

test.describe("Mobile sticky CTA bar", () => {
  // This suite targets mobile-only UI (the sticky CTA bar is hidden on desktop).
  // Skip it under desktop-chromium so the desktop run stays free of misleading
  // mobile-only failures.
  test.skip(({ isMobile }) => !isMobile, "Mobile-only suite — skipped under desktop-chromium");

  test.use({ viewport: { width: 390, height: 844 } });

  test("shows Call Ashley and Schedule buttons on mobile viewports", async ({ page }) => {
    await page.goto("/");

    const stickyBar = page.getByTestId("mobile-sticky-bar");
    await expect(stickyBar).toBeVisible();

    const callButton = page.getByTestId("mobile-call-button");
    const scheduleButton = page.getByTestId("mobile-schedule-button");

    await expect(callButton).toBeVisible();
    await expect(scheduleButton).toBeVisible();

    await expect(callButton).toHaveAttribute("href", "tel:+16199472325");
    await expect(scheduleButton).toHaveAttribute("href", "/schedule");

    const callBox = await callButton.boundingBox();
    const scheduleBox = await scheduleButton.boundingBox();
    expect(callBox?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(scheduleBox?.height ?? 0).toBeGreaterThanOrEqual(44);

    const viewportSize = page.viewportSize();
    expect(viewportSize).not.toBeNull();
    if (viewportSize && callBox) {
      expect(callBox.y + callBox.height).toBeLessThanOrEqual(viewportSize.height + 1);
    }
  });

  test("is hidden on desktop viewports", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const stickyBar = page.getByTestId("mobile-sticky-bar");
    await expect(stickyBar).toBeHidden();
  });
});
