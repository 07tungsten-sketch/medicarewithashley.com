import { describe, expect, it } from "vitest";
import { getFooterCopyrightYear } from "./Footer";

describe("getFooterCopyrightYear", () => {
  it("shows the outgoing year on Dec 31", () => {
    expect(getFooterCopyrightYear(new Date(2025, 11, 31, 23, 59))).toBe(2025);
  });

  it("rolls the visible copyright year forward on Jan 1", () => {
    expect(getFooterCopyrightYear(new Date(2026, 0, 1, 0, 1))).toBe(2026);
  });
});