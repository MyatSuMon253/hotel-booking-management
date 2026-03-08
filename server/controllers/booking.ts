import errorHandler from "../middlewares/errorHandler";
import { Booking } from "../models/booking";

export const createNewBooking = errorHandler(
  async (bookingInput: any, userId: string) => {
    const newBooking = await Booking.create({
      ...bookingInput,
      user: userId,
    });

    return newBooking;
  },
);
