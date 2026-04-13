import { z } from "zod";

export const createRoomSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
  roomNumber: z.string().nonempty({ message: "Room number is required." }),
  pricePerNight: z.number().min(3, { message: "Room price is required." }),
  location: z.string().nonempty({ message: "Location is required." }),
  isAvailable: z.boolean().default(true),
  images: z.string().array().optional(),
  capacity: z.number().min(1, { message: "Capacity is required." }),
});
