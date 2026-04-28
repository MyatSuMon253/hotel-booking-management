import { describe, expect, test } from "vitest";
import { buffetBookingSchema, buffetDinnerSchema } from "../buffet";

describe("buffet schema", () => {
  test("accepts valid buffet dinner input", () => {
    expect(
      buffetDinnerSchema.safeParse({
        title: "Seafood Night",
        cuisineCategory: "Seafood",
        description: "Fresh seafood",
        imageUrl: "https://example.com/image.jpg",
        eventDate: "2026-05-10",
        startTime: "18:00",
        endTime: "21:00",
        includedDishes: ["dish-1"],
        maxCapacity: 30,
        pricePerGuest: 20,
        facilities: ["Live Music"],
        active: true,
      }).success,
    ).toBe(true);
  });

  test("rejects invalid buffet booking guest count", () => {
    expect(
      buffetBookingSchema.safeParse({
        name: "Alice",
        email: "alice@example.com",
        guestCount: 0,
      }).success,
    ).toBe(false);
  });
});
