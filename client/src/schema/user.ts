import { z } from "zod";

export const updateUserInfoSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .toLowerCase(),
  name: z.string().nonempty({ message: "Name is required." }),
});

export const updateUserPasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
    confirmPassword: z
      .string({ error: "Please enter password again" })
      .min(6, { message: "Password must be at least 6 characters long." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password do not match!",
    path: ["confirmPassword"],
  });
