import { describe, expect, test } from "vitest";
import { loginSchema, registerSchema } from "../auth";

describe("auth schema", () => {
  test("normalizes valid register input", () => {
    const parsed = registerSchema.parse({
      email: "USER@EXAMPLE.COM",
      name: "Alice",
      password: "secret1",
    });

    expect(parsed.email).toBe("user@example.com");
  });

  test("rejects invalid login input", () => {
    const result = loginSchema.safeParse({
      email: "bad-email",
      password: "123",
    });

    expect(result.success).toBe(false);
  });
});
