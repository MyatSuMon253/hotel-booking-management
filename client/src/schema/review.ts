import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().min(1, "Please give a rating"),
  comment: z.string().min(3, "Comment is too short"),
});
