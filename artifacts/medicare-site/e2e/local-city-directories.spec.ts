import { test, expect, type Locator } from "@playwright/test";

type CityDirectoryEntry = {
  city: string;
  route: string;
  heading: string;
};

const cityRoutes: CityDirectoryEntry[] = [
  {
    city: "Chula Vista",
    route: "/medicare-broker-chula-vista",
    heading: "Medicare Broker in Chula Vista, CA",
  },
  {
    city: "National City",
    route: "/medicare-broker-national-city",
    heading: "Medicare Broker in National City, CA",
  },
  {
    city: "El Cajon",
    route: "/medicare-broker-el-cajon",
    heading: "Medicare Broker in El Cajon, CA",
  },
  {
    city: "La Mesa",
    route: "/medicare-broker-la-mesa",
    heading: "Medicare Broker in La Mesa, CA",
  },
  {
    city: "Santee",
    route: "/medicare-broker-santee",
    heading: "Medicare Broker in Santee, CA",
  },
  {
    city: "Oceanside",
    route: "/medicare-broker-oceanside",
    heading: "Medicare Broker in Oceanside, CA",
  },
  {
    city: "Escondido",
    route: "/medicare-broker-escondido",
    heading: "Medicare Broker in Escondido, CA",
  },
  {
    city: "Poway",
    route: "/medicare-broker-poway",
    heading: "Medicare Broker in Poway, CA",
  },
  {
    city: "San Marcos",
    route: "/medicare-broker-san-marcos",
    heading: "Your Local Medicare Broker in San Marcos",
  },
];

const cityRouteByName = new Map(cityRoutes.map((entry) => [entry.city, entry]));

function directoryEntries(cities: string[]): CityDirectoryEntry[] {
  return cities.map((city) => {
    const entry = cityRouteByName.get(city);
    if (!entry) throw new Error(`Missing city route fixture for ${city}.`);
    return entry;
  });
}

const homepageCityDirectory = directoryEntries([
  "Chula Vista",
  "El Cajon",
  "Escondido",
  "Poway",
  "Oceanside",
  "La Mesa",
  "National City",
  "Santee",
  "San Marcos",
]);

const annualEnrollmentCityDirectory = directoryEntries([
  "Chula Vista",
  "National City",
  "El Cajon",
  "La Mesa",
  "Santee",
  "Oceanside",
  "Escondido",
  "Poway",
  "San Marcos",
]);

function withoutTrailingSlash(path: string): string {
  return path === "/" ? path : path.replace(/\/+$/, "");
}

async function verifyCityDirectory(
  directory: Locator,
  entries: CityDirectoryEntry[],
) {
  const linkedCityPages = directory.locator('a[href^="/medicare-broker-"]');
  await expect(
    linkedCityPages,
    "The directory must keep the complete set of linked city entries.",
  ).toHaveCount(entries.length);

  for (const { city, route } of entries) {
    const cityLink = directory.locator("a").filter({ hasText: city });
    await expect(cityLink, `${city} is missing from this city directory.`).toHaveCount(1);

    const href = await cityLink.getAttribute("href");
    expect(href, `${city} must have a destination.`).not.toBeNull();
    expect(
      withoutTrailingSlash(href ?? ""),
      `${city} points to the wrong Medicare city route.`,
    ).toBe(route);
  }
}

test.describe("local Medicare city directories", () => {
  test("homepage service-area links stay aligned with live city pages", async ({ page }) => {
    await page.goto("/");
    await verifyCityDirectory(
      page.getByTestId("service-areas-section"),
      homepageCityDirectory,
    );
  });

  test("Annual Enrollment Period city links stay aligned with live city pages", async ({
    page,
  }) => {
    await page.goto("/medicare-annual-enrollment-period-san-diego");
    await verifyCityDirectory(
      page.getByTestId("aep-city-links"),
      annualEnrollmentCityDirectory,
    );
  });

  for (const { city, route, heading } of cityRoutes) {
    test(`${city} directory destination resolves to its city page`, async ({
      page,
      request,
    }) => {
      const response = await request.get(route);
      expect(response.status(), `${city} route ${route} must return HTTP 200.`).toBe(200);

      await page.goto(route);
      await expect(
        page.getByRole("heading", { level: 1, name: heading }),
        `${city} route must render its city-specific page.`,
      ).toBeVisible();
    });
  }
});