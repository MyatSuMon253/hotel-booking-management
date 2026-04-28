import { describe, expect, test, vi } from "vitest";
import {
  REFERRAL_DISCOUNT_PERCENT,
  adjustTimeZone,
  calculateAmount,
  formatAmount,
  formatDate,
  getDaysOfRent,
  getMembershipDiscountPercent,
  updateSearchParams,
} from "../helpers";

describe("helpers", () => {
  test("updateSearchParams appends and updates values", () => {
    const params = new URLSearchParams("page=1");

    expect(updateSearchParams(params, "page", "2").get("page")).toBe("2");
    expect(updateSearchParams(params, "q", "suite").get("q")).toBe("suite");
  });

  test("formatDate formats string timestamps and Date values", () => {
    expect(formatDate(String(new Date("2026-05-01").getTime()))).toBe(
      "2026, 05-01",
    );
    expect(formatDate(new Date("2026-05-02"))).toBe("2026, 05-02");
  });

  test("getMembershipDiscountPercent maps tiers", () => {
    expect(getMembershipDiscountPercent("silver")).toBe(0.1);
    expect(getMembershipDiscountPercent("gold")).toBe(0.2);
    expect(getMembershipDiscountPercent("diamond")).toBe(0.3);
    expect(getMembershipDiscountPercent("unknown")).toBe(0);
    expect(REFERRAL_DISCOUNT_PERCENT).toBe(0.05);
  });

  test("calculateAmount returns rent, tax, discount, and total", () => {
    expect(calculateAmount(100, 2, 0.1)).toEqual({
      rent: 200,
      tax: 10,
      discount: 20,
      total: 190,
    });
  });

  test("getDaysOfRent returns whole-day difference", () => {
    expect(
      getDaysOfRent({
        from: new Date("2026-05-01T18:00:00.000Z"),
        to: new Date("2026-05-04T08:00:00.000Z"),
      }),
    ).toBe(2);
    expect(getDaysOfRent()).toBe(0);
  });

  test("adjustTimeZone returns adjusted local date", () => {
    const date = new Date("2026-05-01T00:00:00.000Z");
    const spy = vi.spyOn(date, "getTimezoneOffset").mockReturnValue(60);

    const result = adjustTimeZone(date);

    expect(result?.toISOString()).toBe("2026-04-30T23:00:00.000Z");
    spy.mockRestore();
  });

  test("formatAmount formats with separators", () => {
    expect(formatAmount(1234567)).toBe("1,234,567");
  });
});
