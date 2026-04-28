import { describe, expect, test } from "vitest";
import { bookingFormSchema } from "../booking";

describe("booking schema", () => {
  test("accepts valid booking input", () => {
    expect(
      bookingFormSchema.safeParse({
        email: "USER@EXAMPLE.COM",
        name: "Alice",
        referralCode: " SAVE5 ",
        additionalNote: "Late check-in",
        dateRange: {
          from: new Date("2026-05-01"),
          to: new Date("2026-05-03"),
        },
      }).success,
    ).toBe(true);
  });
});
