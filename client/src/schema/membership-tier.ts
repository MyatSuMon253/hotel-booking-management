import { z } from "zod";

export const membershipTierSchema = z.object({
  name: z.enum(["silver", "gold", "diamond"]),
  discountPercentage: z
    .number()
    .min(0, { message: "Discount must be at least 0%." })
    .max(100, { message: "Discount cannot be greater than 100%." }),
  active: z.boolean(),
});
