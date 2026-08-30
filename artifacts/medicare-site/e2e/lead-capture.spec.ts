import { test, expect } from "@playwright/test";

test.describe("Homepage lead capture form", () => {
  test("submits successfully and shows the thank-you confirmation", async ({ page }) => {
    await page.goto("/");

    const leadSection = page.getByTestId("lead-capture-section");
    await leadSection.scrollIntoViewIfNeeded();
    await expect(leadSection).toBeVisible();

    const unique = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    await page.locator("#lead-firstName").fill(`Test Lead ${unique}`);
    await page.locator("#lead-email").fill(`e2e-lead-${unique}@example.com`);
    await page.locator("#lead-phone").fill("(619) 555-0100");

    const contactResponse = page.waitForResponse(
      (res) => res.url().includes("/api/contact") && res.request().method() === "POST"
    );

    await leadSection.getByRole("button", { name: /Send Me the Free Guide/i }).click();

    const response = await contactResponse;
    expect(response.ok()).toBeTruthy();

    await expect(leadSection.getByRole("heading", { name: "You're all set!" })).toBeVisible();
    await expect(
      leadSection.getByText(/Ashley will be in touch shortly with your free guide/i)
    ).toBeVisible();
    await expect(
      leadSection.getByRole("link", { name: /Schedule a Free Consultation/i })
    ).toBeVisible();
  });

  test("shows a clear error with the fallback phone number when the submission fails", async ({ page }) => {
    await page.goto("/");

    const leadSection = page.getByTestId("lead-capture-section");
    await leadSection.scrollIntoViewIfNeeded();
    await expect(leadSection).toBeVisible();

    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Something went wrong. Please try calling Ashley directly at (619) 947-2325.",
        }),
      });
    });

    const unique = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    await page.locator("#lead-firstName").fill(`Test Lead ${unique}`);
    await page.locator("#lead-email").fill(`e2e-lead-${unique}@example.com`);

    await leadSection.getByRole("button", { name: /Send Me the Free Guide/i }).click();

    await expect(
      leadSection.getByText(/Please try calling Ashley directly at \(619\) 947-2325/i)
    ).toBeVisible();

    await expect(leadSection.getByRole("heading", { name: "You're all set!" })).not.toBeVisible();
    await expect(leadSection.locator("#lead-firstName")).toBeVisible();
    await expect(leadSection.getByRole("button", { name: /Send Me the Free Guide/i })).toBeEnabled();
  });

  test("shows a validation-friendly experience when submitting without required fields", async ({ page }) => {
    await page.goto("/");

    const leadSection = page.getByTestId("lead-capture-section");
    await leadSection.scrollIntoViewIfNeeded();

    const firstNameInput = page.locator("#lead-firstName");
    const emailInput = page.locator("#lead-email");

    await expect(firstNameInput).toHaveAttribute("required", "");
    await expect(emailInput).toHaveAttribute("required", "");
    await expect(emailInput).toHaveAttribute("type", "email");
  });
});
