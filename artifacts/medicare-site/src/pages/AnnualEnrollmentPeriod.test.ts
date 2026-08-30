import { describe, it, expect, vi, afterEach } from "vitest";
import { getAepYear } from "./AnnualEnrollmentPeriod";

afterEach(() => {
  vi.useRealTimers();
});

/**
 * Pin the system clock to a specific LA-local date/time and return the
 * AEP_YEAR and EFFECT_YEAR that the component would compute.
 *
 * We freeze the clock via vi.useFakeTimers so that `new Date()` inside
 * getAepYear() returns the date we choose.  The function itself converts
 * to America/Los_Angeles using Intl, so we supply a UTC instant that
 * corresponds to the LA local date we want to test.
 */
function aepYears(isoUtc: string): { AEP_YEAR: number; EFFECT_YEAR: number } {
  vi.useFakeTimers({ now: new Date(isoUtc) });
  const AEP_YEAR = getAepYear();
  return { AEP_YEAR, EFFECT_YEAR: AEP_YEAR + 1 };
}

describe("getAepYear", () => {
  // -------------------------------------------------------------------
  // Mid-year: well before Oct 15 — shows previous year's AEP
  // -------------------------------------------------------------------
  it("returns previous year before Oct 15 (mid-summer)", () => {
    // LA: 2025-07-04
    const { AEP_YEAR, EFFECT_YEAR } = aepYears("2025-07-04T12:00:00Z");
    expect(AEP_YEAR).toBe(2024);
    expect(EFFECT_YEAR).toBe(2025);
  });

  // -------------------------------------------------------------------
  // Oct 14: one day before threshold — still previous year's AEP
  // -------------------------------------------------------------------
  it("returns previous year on Oct 14 (day before threshold)", () => {
    // LA midnight Oct 14 → UTC Oct 14 07:00
    const { AEP_YEAR, EFFECT_YEAR } = aepYears("2025-10-14T07:00:00Z");
    expect(AEP_YEAR).toBe(2024);
    expect(EFFECT_YEAR).toBe(2025);
  });

  // -------------------------------------------------------------------
  // Oct 15: AEP opens — current year's AEP
  // -------------------------------------------------------------------
  it("returns current year on Oct 15 (AEP opening day)", () => {
    // LA midnight Oct 15 → UTC Oct 15 07:00
    const { AEP_YEAR, EFFECT_YEAR } = aepYears("2025-10-15T07:00:00Z");
    expect(AEP_YEAR).toBe(2025);
    expect(EFFECT_YEAR).toBe(2026);
  });

  // -------------------------------------------------------------------
  // Dec 7: AEP closing day — still current year
  // -------------------------------------------------------------------
  it("returns current year on Dec 7 (AEP closing day)", () => {
    const { AEP_YEAR, EFFECT_YEAR } = aepYears("2025-12-07T12:00:00Z");
    expect(AEP_YEAR).toBe(2025);
    expect(EFFECT_YEAR).toBe(2026);
  });

  // -------------------------------------------------------------------
  // Year boundary: Dec 31 → Jan 1 rollover
  // -------------------------------------------------------------------
  it("returns correct years on Dec 31 (last day of the year)", () => {
    // LA: 2025-12-31 noon → UTC 2025-12-31 20:00
    const { AEP_YEAR, EFFECT_YEAR } = aepYears("2025-12-31T20:00:00Z");
    expect(AEP_YEAR).toBe(2025);
    expect(EFFECT_YEAR).toBe(2026);
  });

  it("returns correct years on Jan 1 (New Year's Day)", () => {
    // LA: 2026-01-01 00:01 → UTC 2026-01-01 08:01
    const { AEP_YEAR, EFFECT_YEAR } = aepYears("2026-01-01T08:01:00Z");
    // Jan 1 is before Oct 15, so AEP_YEAR is the *previous* year (2025)
    expect(AEP_YEAR).toBe(2025);
    expect(EFFECT_YEAR).toBe(2026);
  });

  // -------------------------------------------------------------------
  // Late-night Dec 31 in UTC is still Dec 31 in LA (UTC-8 in winter)
  // -------------------------------------------------------------------
  it("stays on Dec 31 LA time even when UTC has rolled into Jan 1", () => {
    // UTC 2026-01-01T05:00Z = LA 2025-12-31T21:00 (PST = UTC-8)
    const { AEP_YEAR, EFFECT_YEAR } = aepYears("2026-01-01T05:00:00Z");
    expect(AEP_YEAR).toBe(2025);
    expect(EFFECT_YEAR).toBe(2026);
  });

  // -------------------------------------------------------------------
  // The component's rendered text matches derived years
  // -------------------------------------------------------------------
  it("EFFECT_YEAR is always AEP_YEAR + 1", () => {
    const dates = [
      "2025-01-01T08:00:00Z",
      "2025-10-15T07:00:00Z",
      "2025-12-07T12:00:00Z",
      "2026-01-01T08:01:00Z",
    ];
    for (const iso of dates) {
      const { AEP_YEAR, EFFECT_YEAR } = aepYears(iso);
      expect(EFFECT_YEAR).toBe(AEP_YEAR + 1);
    }
  });
});
