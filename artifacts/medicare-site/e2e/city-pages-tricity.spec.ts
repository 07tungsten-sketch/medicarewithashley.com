import { test, expect } from "@playwright/test";

const triCityLinkedCityPages = [
  {
    path: "/medicare-broker-oceanside/",
    h1: "Medicare Broker in Oceanside, CA",
    city: "Oceanside",
  },
  {
    path: "/medicare-broker-vista/",
    h1: "Medicare Broker in Vista, CA",
    city: "Vista",
  },
];

for (const { path, h1, city } of triCityLinkedCityPages) {
  test.describe(`${city} city page`, () => {
    test("returns HTTP 200", async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
    });

    test("renders the city-specific h1 heading", async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1, name: h1 })).toBeVisible();
    });

    test("renders the contact CTA button", async ({ page }) => {
      await page.goto(path);
      const ctas = page.getByRole("link", { name: /Schedule Free Consultation/i });
      await expect(ctas.first()).toBeVisible();
    });
  });
}
