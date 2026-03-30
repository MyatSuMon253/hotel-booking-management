import errorHandler from "../middlewares/errorHandler";
import { Booking } from "../models/booking";
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
    success_url: `${process.env.CLIENT_URL}/bookings`,
    cancel_url: `${process.env.CLIENT_URL}/bookings`,
    client_reference_id: booking.id,
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

export const webhookHandler = errorHandler(
  async (signature: string, rawBody: string) => {
    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );

      if (event.type === "checkout.session.completed") {
        console.log(event.data.object)

        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.client_reference_id;

        const paymentInfo = {
          id: session.payment_intent,
          status: session.payment_status || 'paid',
          method: session.payment_method_types[0],
        };

        await Booking.findByIdAndUpdate(bookingId, { paymentInfo });

        return true;
      }
    } catch (error: any) {
      throw new Error(`Webhook Error: ${error?.message}`);
    }
  },
);
