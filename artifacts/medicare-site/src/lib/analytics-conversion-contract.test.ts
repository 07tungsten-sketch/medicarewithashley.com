import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const SOURCE_ROOT = resolve(__dirname, "..");
const DOCS_PATH = resolve(
  __dirname,
  "../../docs/analytics-conversion-map.md",
);

const productionSources = {
  app: readFileSync(resolve(SOURCE_ROOT, "App.tsx"), "utf-8"),
  contact: readFileSync(resolve(SOURCE_ROOT, "pages/Contact.tsx"), "utf-8"),
  home: readFileSync(resolve(SOURCE_ROOT, "pages/Home.tsx"), "utf-8"),
  schedule: readFileSync(resolve(SOURCE_ROOT, "pages/Schedule.tsx"), "utf-8"),
};

const documentedEvents = [
  ...readFileSync(DOCS_PATH, "utf-8").matchAll(
    /^\| [^|]+\| `([^`]+)` \|/gm,
  ),
].map((match) => match[1]);

const eventContracts = [
  {
    event: "phone_click",
    source: productionSources.app,
    sourceName: "src/App.tsx",
    call: 'trackEvent("phone_click", { ...commonData',
    placementToken: "commonData",
  },
  {
    event: "schedule_start",
    source: productionSources.app,
    sourceName: "src/App.tsx",
    call: 'trackEvent("schedule_start", {',
    placementToken: "commonData",
  },
  {
    event: "appointment_booking_completion",
    source: productionSources.schedule,
    sourceName: "src/pages/Schedule.tsx",
    call: 'trackEvent("appointment_booking_completion", {',
    placementToken: 'cta_placement: "schedule_booking_widget"',
  },
  {
    event: "appointment_booking_start",
    source: productionSources.schedule,
    sourceName: "src/pages/Schedule.tsx",
    call: 'trackEvent("appointment_booking_start", {',
    placementToken: 'cta_placement: "schedule_booking_widget"',
  },
  {
    event: "contact_form_completion",
    source: productionSources.contact,
    sourceName: "src/pages/Contact.tsx",
    call: 'trackEvent("contact_form_completion", {',
    placementToken: 'cta_placement: "contact_form"',
  },
  {
    event: "guide_request_completion",
    source: productionSources.home,
    sourceName: "src/pages/Home.tsx",
    call: 'trackEvent("guide_request_completion", {',
    placementToken: 'cta_placement: "home_guide_form"',
  },
  {
    event: "email_click",
    source: productionSources.app,
    sourceName: "src/App.tsx",
    call: 'trackEvent("email_click", { ...commonData',
    placementToken: "commonData",
  },
  {
    event: "video_engagement",
    source: productionSources.app,
    sourceName: "src/App.tsx",
    call: 'trackEvent("video_engagement", {',
    placementToken: "commonData",
  },
] as const;

function trackEventNames(source: string): string[] {
  return [...source.matchAll(/trackEvent\("([^"]+)"/g)].map(
    (match) => match[1],
  );
}

function trackEventCallBlock(source: string, event: string): string {
  const callStart = source.indexOf(`trackEvent("${event}"`);
  return callStart === -1 ? "" : source.slice(callStart, callStart + 350);
}

describe("documented Medicare conversion tracking contract", () => {
  it("documents every production conversion event exactly once", () => {
    const sourceEventNames = Object.values(productionSources).flatMap(
      trackEventNames,
    );

    expect(
      documentedEvents,
      "Each GA4 event must appear exactly once in the analytics conversion map.",
    ).toHaveLength(new Set(documentedEvents).size);
    expect(
      sourceEventNames,
      "Each documented GA4 event must have exactly one production wiring point.",
    ).toHaveLength(new Set(sourceEventNames).size);
    expect(
      new Set(documentedEvents),
      "The analytics conversion map must list every documented GA4 event.",
    ).toEqual(new Set(eventContracts.map(({ event }) => event)));
    expect(
      new Set(sourceEventNames),
      "Every documented GA4 event must still have a production trackEvent call. " +
        "A removed or renamed event must be restored or removed from the conversion map.",
    ).toEqual(new Set(documentedEvents));
  });

  for (const contract of eventContracts) {
    it(`${contract.event} remains wired from ${contract.sourceName}`, () => {
      expect(
        contract.source,
        `${contract.event} no longer has its expected trackEvent call in ${contract.sourceName}.`,
      ).toContain(contract.call);
    });
  }

  it("keeps shared page context and landing UTM propagation in trackEvent", () => {
    const analyticsSource = readFileSync(
      resolve(SOURCE_ROOT, "lib/analytics.ts"),
      "utf-8",
    );

    expect(analyticsSource).toContain(
      "page_path: window.location.pathname",
    );
    expect(analyticsSource).toContain("page_title: document.title");
    expect(analyticsSource).toContain("...getUtmParameters()");
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ]) {
      expect(
        analyticsSource,
        `${key} must remain an allowed and preserved UTM parameter.`,
      ).toContain(`"${key}"`);
    }
  });

  it("keeps a CTA placement on every conversion call", () => {
    expect(productionSources.app).toContain(
      "const commonData = { cta_placement: ctaPlacement };",
    );
    for (const contract of eventContracts) {
      expect(
        trackEventCallBlock(contract.source, contract.event),
        `${contract.event} must preserve its CTA placement in ${contract.sourceName}.`,
      ).toContain(contract.placementToken);
    }
  });

  it("tracks the contact completion only after the submission succeeds", () => {
    const failureCheck = productionSources.contact.indexOf("if (!res.ok)");
    const completionCall = productionSources.contact.indexOf(
      'trackEvent("contact_form_completion"',
    );

    expect(
      failureCheck,
      "Contact submission must check the API response before tracking completion.",
    ).toBeGreaterThanOrEqual(0);
    expect(completionCall).toBeGreaterThan(failureCheck);
    expect(
      productionSources.contact.slice(failureCheck, completionCall),
      "A failed contact response must throw before contact_form_completion can fire.",
    ).toContain("throw new Error");
  });

  it("uses the shared verified completion guard for embedded forms", () => {
    expect(productionSources.home).toContain(
      "createGhlCompletionHandler(",
    );
    expect(productionSources.schedule).toContain(
      "createGhlCompletionHandler(",
    );
    expect(productionSources.home).toContain(
      'trackEvent("guide_request_completion"',
    );
    expect(productionSources.schedule).toContain(
      'trackEvent("appointment_booking_completion"',
    );
  });
});