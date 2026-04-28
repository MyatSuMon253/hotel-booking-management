import { describe, expect, test } from "vitest";
import { Count, Locations, Types } from "../filterData";

describe("filter data", () => {
  test("exports supported filter options", () => {
    expect(Locations).toEqual(["Yangon", "Mandalay", "Bagan", "Shan"]);
    expect(Types).toEqual(["Single", "Double", "Suite"]);
    expect(Count).toEqual([1, 2, 4]);
  });
});
