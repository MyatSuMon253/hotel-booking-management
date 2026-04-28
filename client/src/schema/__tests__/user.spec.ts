import { describe, expect, test } from "vitest";
import {
  forgetPassword,
  resetPasswordSchema,
  updateUserInfoSchema,
  updateUserPasswordSchema,
} from "../user";

describe("user schema", () => {
  test("validates user info", () => {
    expect(
      updateUserInfoSchema.parse({
        email: "USER@EXAMPLE.COM",
        name: "Alice",
      }),
    ).toEqual({
      email: "user@example.com",
      name: "Alice",
    });
  });

  test("rejects mismatched password confirmation", () => {
    const result = updateUserPasswordSchema.safeParse({
      oldPassword: "secret1",
      newPassword: "secret2",
      confirmPassword: "secret3",
    });

    expect(result.success).toBe(false);
  });

  test("validates reset and forget password flows", () => {
    expect(
      resetPasswordSchema.safeParse({
        newPassword: "secret1",
        confirmNewPassword: "secret1",
      }).success,
    ).toBe(true);

    expect(
      forgetPassword.parse({
        email: "USER@EXAMPLE.COM",
      }),
    ).toEqual({ email: "user@example.com" });
  });
});
