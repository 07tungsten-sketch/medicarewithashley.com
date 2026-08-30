type AnalyticsValue = string | number | boolean;
type AnalyticsData = Record<string, AnalyticsValue>;

const UTM_STORAGE_KEY = "medicare_with_ashley_utm";
const GHL_EMBED_ORIGIN = "https://link.agent-crm.com";
const GHL_COMPLETION_MESSAGE = "set-sticky-contacts";
const GHL_READY_MESSAGE = "[iFrameResizerChild]Ready";
const GHL_BOOKING_PATH = "/widget/booking/L3wahsCgYNk6lKg3Vo40";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    loadGoogleAnalytics?: () => Promise<void>;
  }
}

function readStoredUtm(): AnalyticsData {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.localStorage.getItem(UTM_STORAGE_KEY);
    if (!stored) return {};

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([key, value]) =>
          UTM_KEYS.includes(key as (typeof UTM_KEYS)[number]) &&
          typeof value === "string" &&
          value.length > 0,
      ),
    );
  } catch {
    return {};
  }
}

export function captureUtmParameters(): void {
  if (typeof window === "undefined") return;

  const currentUtm: AnalyticsData = {};
  const searchParams = new URLSearchParams(window.location.search);

  for (const key of UTM_KEYS) {
    const value = searchParams.get(key);
    if (value) currentUtm[key] = value;
  }

  if (Object.keys(currentUtm).length === 0) return;

  try {
    window.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(currentUtm));
  } catch {
    // Tracking must remain best-effort when storage is unavailable.
  }
}

function getUtmParameters(): AnalyticsData {
  captureUtmParameters();
  return readStoredUtm();
}

export function trackEvent(name: string, data: AnalyticsData = {}): void {
  if (typeof window === "undefined") return;

  const payload: AnalyticsData = {
    page_path: window.location.pathname,
    page_title: document.title,
    ...getUtmParameters(),
    ...data,
  };

  try {
    window.gtag?.("event", name, payload);
  } catch {
    // Analytics failures must never interrupt a visitor action.
  }
}

export async function waitForAnalytics(timeoutMs = 800): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    await Promise.race([
      window.loadGoogleAnalytics?.() ?? Promise.resolve(),
      new Promise<void>((resolve) => window.setTimeout(resolve, timeoutMs)),
    ]);
  } catch {
    // Navigation must continue even if analytics cannot load.
  }
}

export function isGhlCompletionMessage(
  event: Pick<MessageEvent, "data" | "origin" | "source">,
  iframeWindow: Window | null,
): boolean {
  if (
    !iframeWindow ||
    event.origin !== GHL_EMBED_ORIGIN ||
    event.source !== iframeWindow ||
    !Array.isArray(event.data)
  ) {
    return false;
  }

  return (
    event.data.length >= 5 &&
    event.data[0] === GHL_COMPLETION_MESSAGE &&
    typeof event.data[1] === "string" &&
    typeof event.data[2] === "string"
  );
}

export function isGhlReadyMessage(
  event: Pick<MessageEvent, "data" | "origin" | "source">,
  iframeWindow: Window | null,
): boolean {
  return Boolean(
    iframeWindow &&
      event.origin === GHL_EMBED_ORIGIN &&
      event.source === iframeWindow &&
      event.data === GHL_READY_MESSAGE,
  );
}

export function createGhlCompletionHandler(
  getIframeWindow: () => Window | null,
  onCompletion: () => void,
): (event: MessageEvent) => void {
  let completed = false;

  return (event: MessageEvent) => {
    if (
      completed ||
      !isGhlCompletionMessage(event, getIframeWindow())
    ) {
      return;
    }

    completed = true;
    onCompletion();
  };
}

export function analyticsPlacementFor(link: HTMLAnchorElement): string {
  return (
    link.dataset.analyticsPlacement ??
    link.closest("[data-testid]")?.getAttribute("data-testid") ??
    "unknown"
  );
}

export function isScheduleDestination(href: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const destination = new URL(href, window.location.href);
    const pathname = destination.pathname.replace(/\/+$/, "") || "/";
    const isLocalSchedule =
      destination.origin === window.location.origin && pathname === "/schedule";
    const isDirectGhlBooking =
      destination.origin === GHL_EMBED_ORIGIN && pathname === GHL_BOOKING_PATH;
    return isLocalSchedule || isDirectGhlBooking;
  } catch {
    return false;
  }
}

export function scheduleDestinationLabel(href: string): string {
  try {
    const destination = new URL(href, "https://medicarewithashley.com");
    return destination.origin === GHL_EMBED_ORIGIN
      ? "go_high_level_booking"
      : "/schedule";
  } catch {
    return "/schedule";
  }
}

export function isYoutubeDestination(href: string): boolean {
  try {
    const destination = new URL(href, "https://medicarewithashley.com");
    return (
      destination.hostname === "youtube.com" ||
      destination.hostname.endsWith(".youtube.com") ||
      destination.hostname === "youtu.be"
    );
  } catch {
    return false;
  }
}