import { describe, expect, it } from "vitest";
import { getEnrollmentYears } from "./PartBPenaltyCalculator";

describe("getEnrollmentYears", () => {
  it("keeps a 15-year selection window centered on Dec 31's calendar year", () => {
    const years = getEnrollmentYears(new Date(2025, 11, 31, 23, 59));

    expect(years).toHaveLength(15);
    expect(years[0]).toBe(2018);
    expect(years.at(-1)).toBe(2032);
  });

  it("advances the entire selection window on Jan 1", () => {
    const years = getEnrollmentYears(new Date(2026, 0, 1, 0, 1));

    expect(years).toHaveLength(15);
    expect(years[0]).toBe(2019);
    expect(years.at(-1)).toBe(2033);
  });
});