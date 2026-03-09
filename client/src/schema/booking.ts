import { z } from "zod";

export const bookingFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a vaild email address." })
    .toLowerCase(),
  name: z.string().nonempty({ message: "Name is required." }),
  additionalNote: z.string().optional(),
  dateRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine((values) => !!values.from && !!values.to, {
      message: "Please select booking dates",
    }),
});
