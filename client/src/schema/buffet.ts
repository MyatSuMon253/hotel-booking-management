import { z } from "zod";

export const buffetDinnerSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required." }),
  cuisineCategory: z
    .string()
    .trim()
    .min(1, { message: "Cuisine category is required." }),
  description: z.string().optional(),
  eventDate: z.string().min(1, { message: "Event date is required." }),
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  includedDishes: z.array(z.string()).min(1, {
    message: "Select at least one included dish.",
  }),
  maxCapacity: z
    .number()
    .min(1, { message: "Maximum capacity must be at least 1." }),
  pricePerGuest: z
    .number()
    .min(0.01, { message: "Price per guest must be greater than 0." }),
  facilities: z.array(z.string()),
  active: z.boolean(),
});

export const buffetBookingSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  guestCount: z
    .number()
    .min(1, { message: "Guest count must be at least 1." }),
  additionalNote: z.string().optional(),
});
