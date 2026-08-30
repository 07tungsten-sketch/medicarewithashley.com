import { test, expect } from "@playwright/test";

const scrippsLinkedCityPages = [
  {
    path: "/medicare-broker-encinitas/",
    h1: "Medicare Broker in Encinitas, CA",
    city: "Encinitas",
  },
  {
    path: "/medicare-broker-carlsbad/",
    h1: "Medicare Broker in Carlsbad, CA",
    city: "Carlsbad",
  },
];

for (const { path, h1, city } of scrippsLinkedCityPages) {
  test.describe(`${city} city page`, () => {
    test("returns HTTP 200", async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
    });

    test("renders the city-specific h1 heading", async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1, name: h1 })).toBeVisible();
    });

    test("links back to the Scripps provider page", async ({ page }) => {
      await page.goto(path);
      // The city-hospital-links section must include a link to the Scripps provider page.
      const hospitalLinks = page
        .getByRole("heading", { level: 2, name: "San Diego Hospitals and Medicare" })
        .locator("xpath=following-sibling::ul[1]");
      await expect(
        hospitalLinks.locator('a[href="/scripps-health-medicare-san-diego"]')
      ).toBeVisible();
    });

    test("keyboard users can focus and activate the Scripps provider link", async ({ page }) => {
      await page.goto(path);
      const hospitalLinks = page
        .getByRole("heading", { level: 2, name: "San Diego Hospitals and Medicare" })
        .locator("xpath=following-sibling::ul[1]");
      const scrippsLink = hospitalLinks.locator(
        'a[href="/scripps-health-medicare-san-diego"]'
      );

      await scrippsLink.focus();
      await expect(scrippsLink).toBeFocused();

      await page.keyboard.press("Enter");

      await expect(page).toHaveURL(/\/scripps-health-medicare-san-diego\/?$/);
      await expect(
        page.getByRole("heading", { level: 1, name: /Scripps Health/i })
      ).toBeVisible();
    });

    test("renders the contact CTA button", async ({ page }) => {
      await page.goto(path);
      const ctas = page.getByRole("link", { name: /Schedule Free Consultation/i });
      await expect(ctas.first()).toBeVisible();
    });
  });
}
