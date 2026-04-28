const stripeState = {
  createSession: jest.fn(),
  constructEvent: jest.fn(),
  createRefund: jest.fn(),
};

jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    checkout: { sessions: { create: stripeState.createSession } },
    webhooks: { constructEvent: stripeState.constructEvent },
    refunds: { create: stripeState.createRefund },
  }));
});

import { BuffetBooking } from "../../models/buffetBooking";
import { Booking } from "../../models/booking";
import {
  refundBookingPayment,
  stripeBuffetCheckoutSession,
  stripeCheckoutSession,
  webhookHandler,
} from "../../controllers/payment";
import {
  createBooking,
  createBuffetBooking,
  createBuffetDinner,
} from "../../test/helpers/factories";
import { createMockQuery } from "../../test/helpers/mock-queries";

jest.mock("../../models/booking", () => ({
  Booking: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.mock("../../models/buffetBooking", () => ({
  BuffetBooking: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("payment controller", () => {
  test("stripeCheckoutSession returns payment url", async () => {
    const booking = createBooking({
      room: createBuffetDinner({
        title: "Suite",
        description: "Sea view",
        images: [{ url: "https://example.com/room.jpg" }],
      }),
      amount: { total: 120 },
    });
    (Booking.findById as jest.Mock).mockReturnValue(createMockQuery(booking));
    stripeState.createSession.mockResolvedValue({ url: "https://checkout" });

    const result = await stripeCheckoutSession("booking-1");

    expect(stripeState.createSession).toHaveBeenCalled();
    expect(result).toEqual({ url: "https://checkout" });
  });

  test("stripeBuffetCheckoutSession returns payment url", async () => {
    const booking = createBuffetBooking({
      buffetDinner: createBuffetDinner({ imageUrl: "https://example.com/d.jpg" }),
      amount: { total: 42 },
      guestCount: 2,
    });
    (BuffetBooking.findById as jest.Mock).mockReturnValue(createMockQuery(booking));
    stripeState.createSession.mockResolvedValue({ url: "https://buffet-checkout" });

    const result = await stripeBuffetCheckoutSession("buffet-booking-1");

    expect(stripeState.createSession).toHaveBeenCalled();
    expect(result).toEqual({ url: "https://buffet-checkout" });
  });

  test("webhookHandler updates room booking", async () => {
    stripeState.constructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          client_reference_id: "booking-1",
          payment_intent: "pi_123",
          payment_status: "paid",
          payment_method_types: ["card"],
          metadata: { bookingType: "room" },
        },
      },
    });

    await expect(webhookHandler("sig", "body")).resolves.toBe(true);
    expect(Booking.findByIdAndUpdate).toHaveBeenCalledWith("booking-1", {
      paymentInfo: { id: "pi_123", status: "paid", method: "card" },
      status: "confirmed",
    });
  });

  test("webhookHandler updates buffet booking", async () => {
    stripeState.constructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          client_reference_id: "buffet-booking-1",
          payment_intent: "pi_456",
          payment_status: "paid",
          payment_method_types: ["card"],
          metadata: { bookingType: "buffet" },
        },
      },
    });

    await expect(webhookHandler("sig", "body")).resolves.toBe(true);
    expect(BuffetBooking.findByIdAndUpdate).toHaveBeenCalledWith(
      "buffet-booking-1",
      {
        paymentInfo: { id: "pi_456", status: "paid", method: "card" },
        status: "confirmed",
      },
    );
  });

  test("webhookHandler wraps Stripe errors", async () => {
    stripeState.constructEvent.mockImplementation(() => {
      throw new Error("bad signature");
    });

    await expect(webhookHandler("sig", "body")).rejects.toThrow(
      "Webhook Error: bad signature",
    );
  });

  test("refundBookingPayment updates booking refund info", async () => {
    stripeState.createRefund.mockResolvedValue({
      id: "re_123",
      amount: 2100,
      status: "succeeded",
    });
    const booking = createBooking({
      paymentInfo: { id: "pi_123", status: "paid" },
    });

    const result = await refundBookingPayment(booking as any);

    expect(stripeState.createRefund).toHaveBeenCalledWith({
      payment_intent: "pi_123",
    });
    expect(booking.paymentInfo.status).toBe("refunded");
    expect(result).toEqual({
      id: "re_123",
      amount: 2100,
      status: "succeeded",
    });
  });
});
