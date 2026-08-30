import { test, expect } from "@playwright/test";

/**
 * Keyboard navigation tests for the mobile nav sheet and Medicare Topics
 * accordion. The mobile sheet is rendered at viewports < 1280 px, so all
 * tests force a mobile-sized viewport.
 */
test.describe("Mobile nav sheet — keyboard navigation", () => {
  // This suite targets the mobile nav sheet which only renders at <1280 px.
  // Skip it when Playwright is running the desktop-chromium project so the
  // desktop run stays free of misleading mobile-only failures.
  // `isMobile` is a built-in fixture that is `true` for the Pixel 7 project
  // and `false` for Desktop Chrome — no testInfo needed in the callback.
  test.skip(({ isMobile }) => !isMobile, "Mobile-only suite — skipped under desktop-chromium");

  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("navigation")).toBeVisible();
  });

  // ── 1. Hamburger opens the sheet ──────────────────────────────────────────────

  test("hamburger trigger opens the mobile nav sheet", async ({ page }) => {
    const trigger = page.getByTestId("mobile-menu-trigger");

    // Activate via keyboard
    await trigger.focus();
    await page.keyboard.press("Enter");

    // Sheet is open when the close button is visible inside it
    await expect(page.getByLabel("Close menu")).toBeVisible();
    // The top-level nav links are also visible
    await expect(page.getByTestId("mobile-nav-about")).toBeVisible();
  });

  // ── 2. Topics accordion expands with Enter ────────────────────────────────────

  test("Enter key expands the Medicare Topics accordion", async ({ page }) => {
    // Open sheet with a click so we start from a clean state
    await page.getByTestId("mobile-menu-trigger").click();
    await expect(page.getByLabel("Close menu")).toBeVisible();

    const accordion = page.getByTestId("mobile-nav-topics-accordion");
    await accordion.focus();
    await expect(accordion).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Enter");

    await expect(accordion).toHaveAttribute("aria-expanded", "true");
    // Topic links should now be in the DOM and visible
    await expect(page.getByTestId("mobile-nav-medicare_basics")).toBeVisible();
    await expect(
      page.getByTestId("mobile-nav-medicare_advantage")
    ).toBeVisible();
  });

  // ── 3. Space key toggles the accordion ───────────────────────────────────────

  test("Space toggles the Medicare Topics accordion open then closed", async ({
    page,
  }) => {
    await page.getByTestId("mobile-menu-trigger").click();
    await expect(page.getByLabel("Close menu")).toBeVisible();

    const accordion = page.getByTestId("mobile-nav-topics-accordion");
    await accordion.focus();

    // Open with Space
    await page.keyboard.press("Space");
    await expect(accordion).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByTestId("mobile-nav-medicare_basics")).toBeVisible();

    // Collapse with Space
    await page.keyboard.press("Space");
    await expect(accordion).toHaveAttribute("aria-expanded", "false");
    await expect(
      page.getByTestId("mobile-nav-medicare_basics")
    ).not.toBeVisible();
  });

  // ── 4. Tab traverses all topic links without trapping focus ───────────────────

  test("Tab reaches every topic link after the accordion is expanded", async ({
    page,
  }) => {
    await page.getByTestId("mobile-menu-trigger").click();
    await expect(page.getByLabel("Close menu")).toBeVisible();

    // Expand the accordion
    const accordion = page.getByTestId("mobile-nav-topics-accordion");
    await accordion.focus();
    await page.keyboard.press("Enter");
    await expect(accordion).toHaveAttribute("aria-expanded", "true");

    // Confirm each topic link receives focus in document order.
    // Only the five links inside mobileNavMedicareHelpLinks are in this panel;
    // "Turning 65" is a top-level link above the accordion, and carriers /
    // annual-enrollment-period live in the separate Resources panel.
    const expectedTestIds = [
      "mobile-nav-medicare_basics",
      "mobile-nav-medicare_advantage",
      "mobile-nav-medicare_supplements",
      "mobile-nav-medicare_dental_vision_hearing_san_diego",
      "mobile-nav-prescription_drug_plans",
    ];

    for (const testId of expectedTestIds) {
      await page.keyboard.press("Tab");
      await expect(page.getByTestId(testId)).toBeFocused();
    }

    // One more Tab from the last topic link should move focus forward —
    // to the Resources accordion button — proving focus is NOT trapped in the panel.
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("mobile-nav-resources-accordion")).toBeFocused();
  });

  // ── 5. Tab traverses all Resources links without trapping focus ───────────────

  test("Tab reaches every Resources link after the accordion is expanded", async ({
    page,
  }) => {
    await page.getByTestId("mobile-menu-trigger").click();
    await expect(page.getByLabel("Close menu")).toBeVisible();

    // Expand the Resources accordion with Enter.
    const accordion = page.getByTestId("mobile-nav-resources-accordion");
    await accordion.focus();
    await expect(accordion).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Enter");
    await expect(accordion).toHaveAttribute("aria-expanded", "true");

    // Confirm each resource link receives focus in mobileNavResourceLinks order.
    const expectedTestIds = [
      "mobile-nav-faq",
      "mobile-nav-blog",
      "mobile-nav-carriers",
      "mobile-nav-medicare_annual_enrollment_period_san_diego",
    ];

    for (const testId of expectedTestIds) {
      await page.keyboard.press("Tab");
      await expect(page.getByTestId(testId)).toBeFocused();
    }

    // One more Tab should move beyond the panel to the next top-level link,
    // proving focus is NOT trapped in the Resources panel.
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("mobile-nav-about")).toBeFocused();
  });

  // ── 6. Escape closes the sheet and returns focus to the trigger ───────────────

  test("Escape closes the sheet and returns focus to the hamburger trigger", async ({
    page,
  }) => {
    const trigger = page.getByTestId("mobile-menu-trigger");
    await trigger.click();
    await expect(page.getByLabel("Close menu")).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByLabel("Close menu")).not.toBeVisible();
    // Focus must return to the element that opened the sheet
    await expect(trigger).toBeFocused();
  });

  // ── 7. aria-controls links Medicare Help button to its panel ─────────────────

  test("Medicare Help accordion aria-controls matches mobile-nav-help-panel id", async ({
    page,
  }) => {
    await page.getByTestId("mobile-menu-trigger").click();
    await expect(page.getByLabel("Close menu")).toBeVisible();

    const accordion = page.getByTestId("mobile-nav-topics-accordion");
    await expect(accordion).toHaveAttribute("aria-controls", "mobile-nav-help-panel");

    // Panel must be in the DOM even while collapsed so aria-controls resolves
    const panel = page.locator("#mobile-nav-help-panel");
    await expect(panel).toBeAttached();
    await expect(panel).toBeHidden(); // hidden attribute keeps links out of tab order

    // After expanding the panel becomes visible
    await accordion.click();
    await expect(accordion).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
  });

  // ── 8a. aria-controls links Resources button to its panel ────────────────────

  test("Resources accordion aria-controls matches mobile-nav-resources-panel id", async ({
    page,
  }) => {
    await page.getByTestId("mobile-menu-trigger").click();
    await expect(page.getByLabel("Close menu")).toBeVisible();

    const accordion = page.getByTestId("mobile-nav-resources-accordion");
    await expect(accordion).toHaveAttribute("aria-controls", "mobile-nav-resources-panel");

    // Panel must be in the DOM even while collapsed so aria-controls resolves
    const panel = page.locator("#mobile-nav-resources-panel");
    await expect(panel).toBeAttached();
    await expect(panel).toBeHidden(); // hidden attribute keeps links out of tab order

    // After expanding the panel becomes visible
    await accordion.click();
    await expect(accordion).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
  });

  // ── 8. Close button closes the sheet ─────────────────────────────────────────

  test("Close button dismisses the mobile sheet", async ({ page }) => {
    await page.getByTestId("mobile-menu-trigger").click();

    const closeBtn = page.getByLabel("Close menu");
    await expect(closeBtn).toBeVisible();

    await closeBtn.focus();
    await page.keyboard.press("Enter");

    await expect(closeBtn).not.toBeVisible();
  });
});
