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

export const getBookedDatesById = errorHandler(async (roomId: string) => {
  const bookings = await Booking.find({ room: roomId });

  const bookedDates = bookings.flatMap((booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    const dates = [];

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date));
    }

    return dates;
  });

  return bookedDates;
});

export const getBookingByUser = errorHandler(async (userId: string) => {
  const bookings = await Booking.find({ user: userId })
    .populate("room")
    .sort({ createdAt: -1 });

  const totalBookings = bookings.length;

  const unpaidBookings = bookings.filter(
    (booking) => booking.paymentInfo?.status !== "paid",
  );

  const needToPay = unpaidBookings.reduce((sum, booking) => {
    return sum + (booking?.amount?.total || 0);
  }, 0);

  return {
    bookings,
    meta: {
      totalBookings,
      unpaidBookings: unpaidBookings.length,
      needToPay,
    },
  };
});
