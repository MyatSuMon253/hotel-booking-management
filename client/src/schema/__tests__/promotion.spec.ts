import { describe, expect, test } from "vitest";
import { promotionSchema } from "../promotion";

describe("promotion schema", () => {
  test("rejects zero discount value", () => {
    expect(
      promotionSchema.safeParse({
        code: "SAVE10",
        discountType: "percentage",
        discountValue: 0,
        validFrom: "2026-05-01",
        validTo: "2026-05-10",
        active: true,
      }).success,
    ).toBe(false);
  });
});
