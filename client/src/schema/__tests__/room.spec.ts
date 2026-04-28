import { describe, expect, test } from "vitest";
import { createRoomSchema } from "../room";

describe("room schema", () => {
  test("accepts valid room input", () => {
    expect(
      createRoomSchema.safeParse({
        title: "Suite",
        description: "Sea view",
        type: "Suite",
        roomNumber: "101",
        pricePerNight: 120,
        location: "Bagan",
        isAvailable: true,
        images: ["img1"],
        capacity: 2,
      }).success,
    ).toBe(true);
  });
});
