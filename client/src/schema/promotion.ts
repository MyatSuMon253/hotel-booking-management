import { z } from "zod";

export const promotionSchema = z.object({
  code: z.string().trim().min(1, { message: "Promotion code is required." }),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z
    .number()
    .min(0.01, { message: "Discount value must be greater than 0." }),
  validFrom: z.string().min(1, { message: "Start date is required." }),
  validTo: z.string().min(1, { message: "End date is required." }),
  active: z.boolean(),
  maxUses: z.number().min(0).optional(),
});
