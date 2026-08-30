import { test, expect } from "@playwright/test";

// La Jolla is uniquely linked from two provider pages (Scripps and UCSD).
// This spec verifies the page resolves and that all cross-links are bidirectional.

test.describe("La Jolla city page", () => {
  const path = "/medicare-broker-la-jolla/";

  test("returns HTTP 200", async ({ request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
  });

  test("renders the city-specific h1 heading", async ({ page }) => {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { level: 1, name: "Medicare Broker in La Jolla, CA" })
    ).toBeVisible();
  });

  test("city-body section links back to the Scripps provider page", async ({ page }) => {
    await page.goto(path);
    // Scoped to the city-body section so navigation links cannot satisfy this check
    const cityBody = page.locator('[data-section="city-body"]');
    await expect(
      cityBody.locator('a[href*="scripps-health-medicare-san-diego"]').first()
    ).toBeVisible();
  });

  test("city-body section links back to the UCSD provider page", async ({ page }) => {
    await page.goto(path);
    // Scoped to the city-body section so navigation links cannot satisfy this check
    const cityBody = page.locator('[data-section="city-body"]');
    await expect(
      cityBody.locator('a[href*="uc-san-diego-health-medicare"]').first()
    ).toBeVisible();
  });
});

test.describe("Scripps provider page → La Jolla backlink", () => {
  const path = "/scripps-health-medicare-san-diego/";

  test("returns HTTP 200", async ({ request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
  });

  test("city-backlinks content links to the La Jolla city page", async ({ page }) => {
    await page.goto(path);
    // Scoped to provider content; the raw city-backlinks comment markers are not rendered.
    const providerBody = page.locator('[data-section="provider-body"]');
    await expect(
      providerBody.locator('a[href="/medicare-broker-la-jolla/"]')
    ).toBeVisible();
  });
});

test.describe("UCSD provider page → La Jolla backlink", () => {
  const path = "/uc-san-diego-health-medicare/";

  test("returns HTTP 200", async ({ request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
  });

  test("city-backlinks content links to the La Jolla city page", async ({ page }) => {
    await page.goto(path);
    // Scoped to provider content; the raw city-backlinks comment markers are not rendered.
    const providerBody = page.locator('[data-section="provider-body"]');
    await expect(
      providerBody.locator('a[href="/medicare-broker-la-jolla/"]')
    ).toBeVisible();
  });
});
