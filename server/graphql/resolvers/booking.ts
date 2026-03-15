import { BookingInput } from "types/booking";
import {
  createNewBooking,
  getBookingById,
  updateBookingPayment,
} from "../../controllers/booking";
import { IUser } from "types/user";

export const bookingResolvers = {
  Query: {
    getBookingById: async (
      _: any,
      { bookingId }: { bookingId: string },
      { user }: { user: IUser },
    ) => getBookingById(bookingId, user),
  },
  Mutation: {
    createNewBooking: async (
      _: any,
      { bookingInput }: { bookingInput: any },
      { user }: { user: IUser },
    ) => createNewBooking(bookingInput, user._id),
    updateBookingPayment: async (
      _: any,
      {
        bookingId,
        bookingInput,
      }: { bookingId: string; bookingInput: Partial<BookingInput> },
      { user }: { user: IUser },
    ) => updateBookingPayment(bookingId, bookingInput, user),
  },
};
