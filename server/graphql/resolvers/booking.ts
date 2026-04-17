import { pubsub } from "../../apollo/pubsub";
import {
  createNewBooking,
  getAllBookings,
  getBookedDatesById,
  getBookingById,
  getBookingByUser,
  getDashboardMetaData,
  updateBookingPayment,
} from "../../controllers/booking";
import { BookingInput } from "../../types/booking";
import { IUser } from "../../types/user";

export const bookingResolvers = {
  Subscription: {
    newBookingNoti: {
      subscribe: () => {
        return pubsub.asyncIterableIterator(["NEW_BOOKING"]);
      }
    }
  },
  Query: {
    getBookingById: async (
      _: any,
      { bookingId }: { bookingId: string },
      { user }: { user: IUser },
    ) => getBookingById(bookingId, user),
    getBookedDatesById: async (_: any, { roomId }: { roomId: string }) =>
      getBookedDatesById(roomId),
    getBookingByUser: async (
      _parent: any,
      _args: any,
      { user }: { user: IUser },
    ) => getBookingByUser(user.id),
    getAllBookings: async () => getAllBookings(),
    getDashboardMetaData: async (
      _: any,
      { startDate, endDate }: { startDate: Date; endDate: Date },
    ) => getDashboardMetaData(startDate, endDate),
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
