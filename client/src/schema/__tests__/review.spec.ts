import { describe, expect, test } from "vitest";
import { reviewSchema } from "../review";

describe("review schema", () => {
  test("requires rating and minimum comment length", () => {
    expect(reviewSchema.safeParse({ rating: 0, comment: "ok" }).success).toBe(
      false,
    );
    expect(
      reviewSchema.safeParse({ rating: 5, comment: "Great stay" }).success,
    ).toBe(true);
  });
});
