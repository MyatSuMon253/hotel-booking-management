import {
  stripeBuffetCheckoutSession,
  stripeCheckoutSession,
} from "../../controllers/payment";

export const paymentResolver = {
  Mutation: {
    stripeCheckoutSession: async (
      _: any,
      { bookingId }: { bookingId: string },
    ) => stripeCheckoutSession(bookingId),
    stripeBuffetCheckoutSession: async (
      _: any,
      { buffetBookingId }: { buffetBookingId: string },
    ) => stripeBuffetCheckoutSession(buffetBookingId),
  },
};
