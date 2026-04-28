import { describe, expect, test } from "vitest";
import { membershipTierSchema } from "../membership-tier";

describe("membership tier schema", () => {
  test("rejects values above 100 percent", () => {
    expect(
      membershipTierSchema.safeParse({
        name: "gold",
        discountPercentage: 120,
        active: true,
      }).success,
    ).toBe(false);
  });
});
