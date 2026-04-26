import errorHandler from "../middlewares/errorHandler";
import { BuffetBooking } from "../models/buffetBooking";
import { Booking } from "../models/booking";
import { IBooking } from "../types/booking";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const stripeCheckoutSession = errorHandler(async (bookingId: string) => {
  const booking = await Booking.findById(bookingId).populate("room");

  if (!booking) {
    throw new Error("Booking not found");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${process.env.CLIENT_URL}/bookings/${booking.id}/confirmation?status=success`,
    cancel_url: `${process.env.CLIENT_URL}/bookings/${booking.id}/payment?status=cancelled`,
    client_reference_id: booking.id,
    metadata: {
      bookingType: "room",
      bookingId: booking.id,
    },
    customer_email: booking.customer.email,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: booking.amount.total * 100,
          product_data: {
            name: booking.room.title,
            description: booking.room.description,
            images: [booking.room.images[0]?.url],
          },
        },
        quantity: 1,
      },
    ],
  });

  return { url: session.url };
});

export const stripeBuffetCheckoutSession = errorHandler(
  async (buffetBookingId: string) => {
    const booking = await BuffetBooking.findById(buffetBookingId).populate(
      "buffetDinner",
    );

    if (!booking) {
      throw new Error("Buffet booking not found");
    }

    const buffetDinner = booking.buffetDinner as any;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.CLIENT_URL}/buffet-bookings/${booking.id}/confirmation?status=success`,
      cancel_url: `${process.env.CLIENT_URL}/buffet-bookings/${booking.id}/payment?status=cancelled`,
      client_reference_id: booking.id,
      customer_email: booking.customer.email,
      mode: "payment",
      metadata: {
        bookingType: "buffet",
        bookingId: booking.id,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(booking.amount.total * 100),
            product_data: {
              name: buffetDinner.title,
              description: `${new Date(
                buffetDinner.startsAt,
              ).toLocaleString()} for ${booking.guestCount} guest(s)`,
              images: buffetDinner.imageUrl ? [buffetDinner.imageUrl] : [],
            },
          },
          quantity: 1,
        },
      ],
    });

    return { url: session.url };
  },
);

export const webhookHandler = errorHandler(
  async (signature: string, rawBody: string) => {
    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.client_reference_id;

        const paymentInfo = {
          id: session.payment_intent,
          status: session.payment_status || "paid",
          method: session.payment_method_types[0],
        };

        if (session.metadata?.bookingType === "buffet") {
          await BuffetBooking.findByIdAndUpdate(bookingId, {
            paymentInfo,
            status: "confirmed",
          });

          return true;
        }

        await Booking.findByIdAndUpdate(bookingId, {
          paymentInfo,
          status: "confirmed",
        });

        return true;
      }
    } catch (error: any) {
      throw new Error(`Webhook Error: ${error?.message}`);
    }
  },
);

export const refundBookingPayment = async (booking: IBooking & any) => {
  if (!booking.paymentInfo?.id || booking.paymentInfo.status !== "paid") {
    return null;
  }

  const refund = await stripe.refunds.create({
    payment_intent: booking.paymentInfo.id,
  });

  booking.refundInfo = {
    id: refund.id,
    amount: (refund.amount ?? 0) / 100,
    status: refund.status ?? "pending",
    refundedAt: new Date(),
  };
  booking.paymentInfo.status = "refunded";

  return refund;
};
