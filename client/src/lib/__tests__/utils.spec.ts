import { describe, expect, test } from "vitest";
import { cn } from "../utils";

describe("cn", () => {
  test("merges class names and resolves tailwind conflicts", () => {
    expect(cn("px-2", "text-sm", "px-4")).toBe("text-sm px-4");
  });
});
