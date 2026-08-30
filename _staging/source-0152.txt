import { describe, expect, it } from "vitest";
import { getConsultationCopyrightYear } from "./FreeConsultation";

describe("getConsultationCopyrightYear", () => {
  it("shows the outgoing year on Dec 31", () => {
    expect(getConsultationCopyrightYear(new Date(2025, 11, 31, 23, 59))).toBe(2025);
  });

  it("rolls the distraction-free page copyright forward on Jan 1", () => {
    expect(getConsultationCopyrightYear(new Date(2026, 0, 1, 0, 1))).toBe(2026);
  });
});