import { createNewBooking } from "../../controllers/booking";
import { IUser } from "types/user";

export const bookingResolvers = {
  Mutation: {
    createNewBooking: async (
      _: any,
      { bookingInput }: { bookingInput: any },
      { user }: { user: IUser },
    ) => createNewBooking(bookingInput, user._id),
  },
};
