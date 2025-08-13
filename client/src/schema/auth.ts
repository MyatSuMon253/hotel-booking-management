import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a vaild email address." })
    .toLowerCase(),
  name: z.string().nonempty({ message: "Name is required." }),
  password: z
    .string()
    .min(6, { message: "Password must have at least 6 characters." }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a vaild email address." })
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: "Password must have at least 6 characters." }),
});
