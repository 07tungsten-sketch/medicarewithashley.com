import { test, expect } from "@playwright/test";

const ucsdLinkedCityPages = [
  {
    path: "/medicare-broker-la-mesa/",
    h1: "Medicare Broker in La Mesa, CA",
    city: "La Mesa",
  },
  {
    path: "/medicare-broker-el-cajon/",
    h1: "Medicare Broker in El Cajon, CA",
    city: "El Cajon",
  },
  {
    path: "/medicare-broker-santee/",
    h1: "Medicare Broker in Santee, CA",
    city: "Santee",
  },
];

for (const { path, h1, city } of ucsdLinkedCityPages) {
  test.describe(`${city} city page`, () => {
    test("returns HTTP 200", async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
    });

    test("renders the city-specific h1 heading", async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1, name: h1 })).toBeVisible();
    });

    test("links back to the UCSD provider page", async ({ page }) => {
      await page.goto(path);
      // The city-hospital-links section must include a link to the UCSD provider page
      const ucsdLink = page.locator('a[href="/uc-san-diego-health-medicare"]').first();
      await expect(ucsdLink).toBeVisible();
    });
  });
}
