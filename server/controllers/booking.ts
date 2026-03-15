import { IUser } from "../types/user";
import errorHandler from "../middlewares/errorHandler";
import { Booking } from "../models/booking";
import { NotFoundError } from "../utils/not-found";
import { BookingInput } from "../types/booking";

export const createNewBooking = errorHandler(
  async (bookingInput: any, userId: string) => {
    const newBooking = await Booking.create({
      ...bookingInput,
      user: userId,
    });

    return newBooking;
  },
);

export const getBookingById = errorHandler(
  async (bookingId: string, user: IUser) => {
    const booking = await Booking.findById(bookingId).populate("room");

    if (!booking) {
      throw new NotFoundError("Book ing not found");
    }

    if (!user.role?.includes("admin") && booking.user.toString() !== user.id) {
      throw new Error("You do not have permission to view this booking!");
    }

    return booking;
  },
);

export const updateBookingPayment = errorHandler(
  async (
    bookingId: string,
    bookingInput: Partial<BookingInput>,
    user: IUser,
  ) => {
    const booking = await Booking.findById(bookingId).populate("room");

    if (!booking) {
      throw new NotFoundError("Book ing not found");
    }

    if (!user.role?.includes("admin") && booking.user.toString() !== user.id) {
      throw new Error("You do not have permission to view this booking!");
    }

    await booking.set(bookingInput).save();

    return true;
  },
);
