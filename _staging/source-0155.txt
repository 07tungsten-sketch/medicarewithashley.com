import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "wouter";
import Home, { HOME_EXTERNAL_DESTINATIONS } from "./Home";

const PLACEHOLDER_URL_RE =
  /YOUR_PLACE_ID|PLACEHOLDER|TODO|REPLACE_ME|CHANGEME|example\.(com|org|net)/i;

const EXPECTED_HOME_EXTERNAL_DESTINATIONS = {
  ghlForm: "https://link.agent-crm.com/widget/form/cLr5X6KK867JMX0HGILX",
  ghlScript: "https://link.agent-crm.com/js/form_embed.js",
  googleReview: "https://g.page/r/CXq7ZBSPtekQEAI/review",
  youtubeChannel: "https://www.youtube.com/@MedicareWithAshley",
  youtubeEmbed: "https://www.youtube-nocookie.com/embed/8HZVjWAe2_w",
  youtubeVideo: "https://www.youtube.com/watch?v=8HZVjWAe2_w",
} as const;

function renderHomeMarkup(): string {
  const staticLocation = (): [string, (path: string) => void] => [
    "/",
    () => {},
  ];

  return renderToStaticMarkup(
    <HelmetProvider>
      <Router hook={staticLocation}>
        <Home />
      </Router>
    </HelmetProvider>,
  );
}

describe("homepage Google review link", () => {
  it("keeps a real, non-placeholder Google review URL", () => {
    const markup = renderHomeMarkup();
    const linkTag = markup.match(
      /<a\b[^>]*data-testid="leave-review-link"[^>]*>/,
    )?.[0];

    expect(
      linkTag,
      'The homepage must include an anchor with data-testid="leave-review-link".',
    ).toBeDefined();

    const href = linkTag?.match(/\bhref="([^"]+)"/)?.[1];
    expect(
      href,
      'The homepage Google review anchor must have an href attribute.',
    ).toBeDefined();
    expect(href).toMatch(/^https:\/\/g\.page\/r\//);
    expect(href).not.toMatch(PLACEHOLDER_URL_RE);
  });
});

function expectValidExternalUrl(url: string, label: string): void {
  expect(url, `${label} must not be empty.`).toBeTruthy();
  expect(
    url,
    `${label} must not contain a placeholder value.`,
  ).not.toMatch(PLACEHOLDER_URL_RE);

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${label} must be a valid absolute URL: ${url}`);
  }

  expect(parsed.protocol, `${label} must use HTTPS.`).toBe("https:");
  expect(parsed.hostname, `${label} must include a hostname.`).toBeTruthy();
}

describe("homepage external CTA and service links", () => {
  it("keeps the complete external destination inventory intentional", () => {
    expect(HOME_EXTERNAL_DESTINATIONS).toEqual(
      EXPECTED_HOME_EXTERNAL_DESTINATIONS,
    );
  });

  it("keeps every external destination real and well-formed", () => {
    for (const [name, url] of Object.entries(HOME_EXTERNAL_DESTINATIONS)) {
      expectValidExternalUrl(url, `HOME_EXTERNAL_DESTINATIONS.${name}`);
    }
  });

  it("renders the external CTA destinations in the homepage HTML", () => {
    const markup = renderHomeMarkup();

    for (const [name, url] of Object.entries(HOME_EXTERNAL_DESTINATIONS)) {
      if (name === "ghlForm" || name === "ghlScript" || name === "youtubeEmbed") {
        continue;
      }

      expect(
        markup,
        `The homepage must render HOME_EXTERNAL_DESTINATIONS.${name}.`,
      ).toContain(`href="${url}"`);
    }
  });

  it("reaches every external destination and follows redirects", async () => {
    const checks = await Promise.all(
      Object.entries(HOME_EXTERNAL_DESTINATIONS).map(async ([name, url]) => {
        let response: Response;
        try {
          response = await fetch(url, {
            redirect: "follow",
            signal: AbortSignal.timeout(10_000),
            headers: {
              "user-agent": "medicare-with-ashley-link-check/1.0",
            },
          });
        } catch (error) {
          throw new Error(
            `HOME_EXTERNAL_DESTINATIONS.${name} could not be reached: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }

        expect(
          response.ok,
          `HOME_EXTERNAL_DESTINATIONS.${name} returned HTTP ${response.status} at ${response.url}.`,
        ).toBe(true);

        return response.status;
      }),
    );

    expect(checks).toHaveLength(
      Object.keys(HOME_EXTERNAL_DESTINATIONS).length,
    );
  }, 60_000);
});