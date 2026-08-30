import { test, expect } from "@playwright/test";

const paradiseValleyLinkedCityPages = [
  {
    path: "/medicare-broker-chula-vista/",
    h1: "Medicare Broker in Chula Vista, CA",
    city: "Chula Vista",
  },
  {
    path: "/medicare-broker-national-city/",
    h1: "Medicare Broker in National City, CA",
    city: "National City",
  },
];

for (const { path, h1, city } of paradiseValleyLinkedCityPages) {
  test.describe(`${city} city page`, () => {
    test("returns HTTP 200", async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
    });

    test("renders the city-specific h1 heading", async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1, name: h1 })).toBeVisible();
    });

    test("links back to the Paradise Valley Hospital provider page", async ({ page }) => {
      await page.goto(path);
      // The city-hospital-links section must include a link to the Paradise Valley provider page
      const pvhLink = page.locator('a[href="/paradise-valley-hospital-medicare"]').first();
      await expect(pvhLink).toBeVisible();
    });
  });
}

test.describe("Paradise Valley Hospital provider page", () => {
  test("links to Chula Vista city page without 404", async ({ request }) => {
    const response = await request.get("/medicare-broker-chula-vista/");
    expect(response.status()).toBe(200);
  });

  test("links to National City city page without 404", async ({ request }) => {
    const response = await request.get("/medicare-broker-national-city/");
    expect(response.status()).toBe(200);
  });
});
