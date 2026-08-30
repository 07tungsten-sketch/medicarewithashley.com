import { afterEach, describe, expect, it, vi } from "vitest";
import {
  captureUtmParameters,
  createGhlCompletionHandler,
  isGhlCompletionMessage,
  isGhlReadyMessage,
  isScheduleDestination,
  scheduleDestinationLabel,
  trackEvent,
} from "./analytics";

function createStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
    clear: () => values.clear(),
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    get length() {
      return values.size;
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("analytics events", () => {
  it("adds page context and preserves landing-page UTM values", () => {
    const gtag = vi.fn();
    const localStorage = createStorage();
    vi.stubGlobal("window", {
      location: {
        pathname: "/",
        search: "?utm_source=google&utm_medium=cpc&utm_campaign=medicare",
      },
      localStorage,
      gtag,
    });
    vi.stubGlobal("document", { title: "Medicare with Ashley" });

    captureUtmParameters();
    window.location.search = "";
    window.location.pathname = "/contact";
    trackEvent("contact_form_completion", {
      form_name: "contact",
      cta_placement: "contact_form",
    });

    expect(gtag).toHaveBeenCalledWith("event", "contact_form_completion", {
      page_path: "/contact",
      page_title: "Medicare with Ashley",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "medicare",
      form_name: "contact",
      cta_placement: "contact_form",
    });
  });

  const conversionPayloadCases: Array<{
    event: string;
    pagePath: string;
    data: Record<string, string>;
  }> = [
    {
      event: "phone_click",
      pagePath: "/",
      data: { cta_placement: "hero-section", destination: "phone" },
    },
    {
      event: "schedule_start",
      pagePath: "/medicare-annual-enrollment-period-san-diego",
      data: {
        cta_placement: "aep_hero_booking",
        destination: "go_high_level_booking",
      },
    },
    {
      event: "appointment_booking_completion",
      pagePath: "/schedule",
      data: {
        cta_placement: "schedule_booking_widget",
        booking_provider: "go_high_level",
      },
    },
    {
      event: "appointment_booking_start",
      pagePath: "/schedule",
      data: {
        cta_placement: "schedule_booking_widget",
        booking_provider: "go_high_level",
      },
    },
    {
      event: "contact_form_completion",
      pagePath: "/contact",
      data: { cta_placement: "contact_form", form_name: "contact" },
    },
    {
      event: "guide_request_completion",
      pagePath: "/",
      data: {
        cta_placement: "home_guide_form",
        form_name: "san_diego_medicare_guide",
        form_id: "cLr5X6KK867JMX0HGILX",
      },
    },
    {
      event: "email_click",
      pagePath: "/schedule",
      data: { cta_placement: "schedule-email", destination: "email" },
    },
    {
      event: "video_engagement",
      pagePath: "/",
      data: {
        cta_placement: "home_video_channel_link",
        engagement_type: "channel_click",
        platform: "youtube",
      },
    },
  ];

  it.each(conversionPayloadCases)(
    "$event emits its page, placement, and preserved UTM context",
    ({ event, pagePath, data }) => {
      const gtag = vi.fn();
      const localStorage = createStorage();
      vi.stubGlobal("window", {
        location: {
          pathname: "/landing",
          search:
            "?utm_source=google&utm_medium=cpc&utm_campaign=turning65&utm_term=medicare&utm_content=hero",
        },
        localStorage,
        gtag,
      });
      vi.stubGlobal("document", { title: "Medicare with Ashley" });

      captureUtmParameters();
      window.location.search = "";
      window.location.pathname = pagePath;
      trackEvent(event, data);

      expect(gtag).toHaveBeenCalledWith("event", event, {
        page_path: pagePath,
        page_title: "Medicare with Ashley",
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "turning65",
        utm_term: "medicare",
        utm_content: "hero",
        ...data,
      });
    },
  );
});

describe("GoHighLevel completion messages", () => {
  const iframeWindow = {} as Window;
  const validMessage = {
    origin: "https://link.agent-crm.com",
    source: iframeWindow,
    data: [
      "set-sticky-contacts",
      "_ud",
      "{\"contact_id\":\"test\"}",
      "location-id",
      "fingerprint",
    ],
  };

  it("accepts the verified successful-submission message from the embedded iframe", () => {
    expect(isGhlCompletionMessage(validMessage, iframeWindow)).toBe(true);
  });

  it.each([
    ["wrong origin", { ...validMessage, origin: "https://example.com" }],
    ["wrong iframe", { ...validMessage, source: {} as Window }],
    ["wrong message", { ...validMessage, data: ["sticky-contacts", null, null] }],
  ])("rejects a completion message with the %s", (_label, message) => {
    expect(isGhlCompletionMessage(message, iframeWindow)).toBe(false);
  });

  it("fires a completion callback only once for a valid iframe message", () => {
    const onCompletion = vi.fn();
    const handleMessage = createGhlCompletionHandler(
      () => iframeWindow,
      onCompletion,
    );

    handleMessage(validMessage as MessageEvent);
    handleMessage(validMessage as MessageEvent);

    expect(onCompletion).toHaveBeenCalledTimes(1);
  });

  it("does not fire a completion callback for an invalid message", () => {
    const onCompletion = vi.fn();
    const handleMessage = createGhlCompletionHandler(
      () => iframeWindow,
      onCompletion,
    );

    handleMessage({
      ...validMessage,
      origin: "https://example.com",
    } as MessageEvent);

    expect(onCompletion).not.toHaveBeenCalled();
  });
});

describe("GoHighLevel readiness messages", () => {
  const iframeWindow = {} as Window;
  const validMessage = {
    origin: "https://link.agent-crm.com",
    source: iframeWindow,
    data: "[iFrameResizerChild]Ready",
  };

  it("accepts the verified iframe readiness signal", () => {
    expect(isGhlReadyMessage(validMessage, iframeWindow)).toBe(true);
  });

  it.each([
    ["wrong origin", { ...validMessage, origin: "https://example.com" }],
    ["wrong iframe", { ...validMessage, source: {} as Window }],
    ["wrong message", { ...validMessage, data: "Ready" }],
  ])("rejects a readiness signal with the %s", (_label, message) => {
    expect(isGhlReadyMessage(message, iframeWindow)).toBe(false);
  });
});

describe("schedule destinations", () => {
  it("recognizes both the local schedule route and the direct booking widget", () => {
    vi.stubGlobal("window", {
      location: {
        href: "https://medicarewithashley.com/",
        origin: "https://medicarewithashley.com",
      },
    });

    expect(isScheduleDestination("/schedule")).toBe(true);
    expect(
      isScheduleDestination(
        "https://link.agent-crm.com/widget/booking/L3wahsCgYNk6lKg3Vo40",
      ),
    ).toBe(true);
    expect(scheduleDestinationLabel("/schedule")).toBe("/schedule");
    expect(
      scheduleDestinationLabel(
        "https://link.agent-crm.com/widget/booking/L3wahsCgYNk6lKg3Vo40",
      ),
    ).toBe("go_high_level_booking");
  });

  it("rejects unrelated or lookalike booking destinations", () => {
    vi.stubGlobal("window", {
      location: {
        href: "https://medicarewithashley.com/",
        origin: "https://medicarewithashley.com",
      },
    });

    expect(isScheduleDestination("/contact")).toBe(false);
    expect(
      isScheduleDestination(
        "https://example.com/widget/booking/L3wahsCgYNk6lKg3Vo40",
      ),
    ).toBe(false);
    expect(
      isScheduleDestination(
        "https://link.agent-crm.com/widget/booking/not-ashleys-calendar",
      ),
    ).toBe(false);
  });
});