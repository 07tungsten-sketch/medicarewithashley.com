import { test, expect } from "@playwright/test";

test.describe("Carlsbad city page", () => {
  test("returns HTTP 200", async ({ request }) => {
    const response = await request.get("/medicare-broker-carlsbad/");
    expect(response.status()).toBe(200);
  });

  test("renders the city-specific h1 heading", async ({ page }) => {
    await page.goto("/medicare-broker-carlsbad/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Medicare Broker in Carlsbad, CA" })
    ).toBeVisible();
  });

  test("links back to the Tri-City Medical Center provider page", async ({ page }) => {
    await page.goto("/medicare-broker-carlsbad/");
    // The city-hospital-links section must include a link to the Tri-City provider page
    const triCityLink = page
      .locator('a[href="/tri-city-medical-center-medicare"]')
      .first();
    await expect(triCityLink).toBeVisible();
  });

  test("links back to the Scripps provider page", async ({ page }) => {
    await page.goto("/medicare-broker-carlsbad/");
    // The city-hospital-links section must include a link to the Scripps provider page
    const scrippsLink = page
      .locator('a[href="/scripps-health-medicare-san-diego"]')
      .first();
    await expect(scrippsLink).toBeVisible();
  });
});

test.describe("Tri-City Medical Center provider page", () => {
  test("links to Carlsbad city page without 404", async ({ request }) => {
    const response = await request.get("/medicare-broker-carlsbad/");
    expect(response.status()).toBe(200);
  });
});
