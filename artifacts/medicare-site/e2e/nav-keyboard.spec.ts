import { test, expect, type Page } from "@playwright/test";

/**
 * Keyboard navigation tests for the desktop Medicare Topics dropdown.
 * The dropdown is only rendered at xl (≥1280 px) viewports, so all tests
 * force a desktop-sized viewport.
 */
test.describe("Medicare Topics dropdown — keyboard navigation", () => {
  // This suite targets the desktop dropdown which only renders at ≥1280 px.
  // Skip it when Playwright is running the mobile-chromium project so the
  // mobile run stays free of misleading desktop-only failures.
  // `isMobile` is a built-in fixture that is `true` for the Pixel 7 project
  // and `false` for Desktop Chrome — no testInfo needed in the callback.
  test.skip(({ isMobile }) => isMobile, "Desktop-only suite — skipped under mobile-chromium");

  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("navigation")).toBeVisible();
  });

  // Returns all menu items currently in the open dropdown.
  function menuItems(page: Page) {
    return page.locator('[role="menuitem"]');
  }

  function resourcesMenuItems(page: Page) {
    return page.locator('#desktop-resources-menu [role="menuitem"]');
  }

  // ── 1. Down arrow on trigger opens menu and focuses first item ──────────────

  test("ArrowDown on trigger opens menu and focuses the first item", async ({ page }) => {
    const trigger = page.getByTestId("nav-topics-dropdown");
    await trigger.focus();

    await page.keyboard.press("ArrowDown");

    await expect(page.locator('[role="menu"]')).toBeVisible();
    await expect(menuItems(page).first()).toBeFocused();
  });

  // ── 2. ArrowUp on trigger opens menu and focuses the last item ───────────────

  test("ArrowUp on trigger opens menu and focuses the last item", async ({ page }) => {
    const trigger = page.getByTestId("nav-topics-dropdown");
    await trigger.focus();

    await page.keyboard.press("ArrowUp");

    await expect(page.locator('[role="menu"]')).toBeVisible();

    const count = await menuItems(page).count();
    await expect(menuItems(page).nth(count - 1)).toBeFocused();
  });

  // ── 3. ArrowDown wraps from last item to first ────────────────────────────────

  test("ArrowDown wraps from the last menu item back to the first", async ({ page }) => {
    const trigger = page.getByTestId("nav-topics-dropdown");
    await trigger.focus();

    // Open and land on first item
    await page.keyboard.press("ArrowDown");
    await expect(page.locator('[role="menu"]')).toBeVisible();

    const count = await menuItems(page).count();

    // Navigate to the last item
    for (let i = 1; i < count; i++) {
      await page.keyboard.press("ArrowDown");
    }
    await expect(menuItems(page).nth(count - 1)).toBeFocused();

    // One more press should wrap to first
    await page.keyboard.press("ArrowDown");
    await expect(menuItems(page).first()).toBeFocused();
  });

  // ── 4. ArrowUp wraps from first item to last ─────────────────────────────────

  test("ArrowUp wraps from the first menu item back to the last", async ({ page }) => {
    const trigger = page.getByTestId("nav-topics-dropdown");
    await trigger.focus();

    // Open and land on first item
    await page.keyboard.press("ArrowDown");
    await expect(page.locator('[role="menu"]')).toBeVisible();
    await expect(menuItems(page).first()).toBeFocused();

    const count = await menuItems(page).count();

    // ArrowUp from first item should wrap to last
    await page.keyboard.press("ArrowUp");
    await expect(menuItems(page).nth(count - 1)).toBeFocused();
  });

  // ── 5. Home jumps to the first item ──────────────────────────────────────────

  test("Home key jumps to the first menu item", async ({ page }) => {
    const trigger = page.getByTestId("nav-topics-dropdown");
    await trigger.focus();

    // Open and navigate down a couple of items
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");

    // Home should jump back to first
    await page.keyboard.press("Home");
    await expect(menuItems(page).first()).toBeFocused();
  });

  // ── 6. End jumps to the last item ─────────────────────────────────────────────

  test("End key jumps to the last menu item", async ({ page }) => {
    const trigger = page.getByTestId("nav-topics-dropdown");
    await trigger.focus();

    // Open (lands on first item)
    await page.keyboard.press("ArrowDown");
    await expect(page.locator('[role="menu"]')).toBeVisible();

    // End should move to last
    await page.keyboard.press("End");

    const count = await menuItems(page).count();
    await expect(menuItems(page).nth(count - 1)).toBeFocused();
  });

  // ── 7. Escape closes menu and returns focus to trigger ────────────────────────

  test("Escape closes the menu and returns focus to the trigger", async ({ page }) => {
    const trigger = page.getByTestId("nav-topics-dropdown");
    await trigger.focus();

    await page.keyboard.press("ArrowDown");
    await expect(page.locator('[role="menu"]')).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator('[role="menu"]')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  // ── 8. Tab-out closes the menu ────────────────────────────────────────────────

  test("Tab key moves focus out and closes the menu", async ({ page }) => {
    const trigger = page.getByTestId("nav-topics-dropdown");
    await trigger.focus();

    await page.keyboard.press("ArrowDown");
    await expect(page.locator('[role="menu"]')).toBeVisible();

    // Tab away — focus leaves the dropdown container; blur handler fires
    await page.keyboard.press("Tab");

    await expect(page.locator('[role="menu"]')).not.toBeVisible();
  });

  // ── 9. aria-controls on triggers matches ids on menu panels ─────────────────

  test("Medicare Help aria-controls matches the rendered menu panel id", async ({ page }) => {
    const trigger = page.getByTestId("nav-topics-dropdown");

    await expect(trigger).toHaveAttribute("aria-controls", "desktop-help-menu");

    await trigger.focus();
    await page.keyboard.press("ArrowDown");

    const panel = page.locator("#desktop-help-menu");
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("role", "menu");
  });

  test("Resources aria-controls matches the rendered menu panel id", async ({ page }) => {
    const trigger = page.getByTestId("nav-resources-dropdown");

    await expect(trigger).toHaveAttribute("aria-controls", "desktop-resources-menu");

    await trigger.focus();
    await page.keyboard.press("ArrowDown");

    const panel = page.locator("#desktop-resources-menu");
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("role", "menu");
  });

  test("Resources supports arrow-key opening, focus movement, and wrapping", async ({ page }) => {
    const trigger = page.getByTestId("nav-resources-dropdown");
    const items = resourcesMenuItems(page);
    await trigger.focus();

    await page.keyboard.press("ArrowDown");
    await expect(page.locator("#desktop-resources-menu")).toBeVisible();
    await expect(items.first()).toBeFocused();

    await page.keyboard.press("ArrowUp");
    await expect(items.last()).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(items.first()).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(items.nth(1)).toBeFocused();
  });

  test("ArrowUp opens Resources on the last item and Home and End move focus", async ({ page }) => {
    const trigger = page.getByTestId("nav-resources-dropdown");
    const items = resourcesMenuItems(page);
    await trigger.focus();

    await page.keyboard.press("ArrowUp");
    await expect(page.locator("#desktop-resources-menu")).toBeVisible();
    await expect(items.last()).toBeFocused();

    await page.keyboard.press("Home");
    await expect(items.first()).toBeFocused();

    await page.keyboard.press("End");
    await expect(items.last()).toBeFocused();
  });

  test("Escape closes Resources and returns focus to its trigger", async ({ page }) => {
    const trigger = page.getByTestId("nav-resources-dropdown");
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    await expect(resourcesMenuItems(page).first()).toBeFocused();

    await page.keyboard.press("Escape");

    await expect(page.locator("#desktop-resources-menu")).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("Tab traverses every desktop Resources link in DOM order and exits the menu", async ({
    page,
  }) => {
    const trigger = page.getByTestId("nav-resources-dropdown");
    const panel = page.locator("#desktop-resources-menu");
    const items = resourcesMenuItems(page);
    const expectedHrefs = [
      "/faq",
      "/blog",
      "/carriers",
      "/medicare-annual-enrollment-period-san-diego",
      "/san-diego-senior-resources",
    ];

    await trigger.focus();
    await page.keyboard.press("ArrowDown");

    await expect(panel).toBeVisible();
    await expect(items).toHaveCount(expectedHrefs.length);
    for (const [index, href] of expectedHrefs.entries()) {
      await expect(items.nth(index)).toHaveAttribute("href", href);
    }

    // ArrowDown opens the menu on its first item; each following Tab must
    // advance through the remaining links in their DOM order.
    await expect(items.first()).toBeFocused();
    for (let index = 1; index < expectedHrefs.length; index += 1) {
      await page.keyboard.press("Tab");
      await expect(items.nth(index)).toBeFocused();
    }

    // The next Tab must leave the Resources dropdown and close it.
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("nav-link-turning_65")).toBeFocused();
    await expect(panel).not.toBeVisible();
  });
});
