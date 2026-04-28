import { pubsub } from "../../apollo/pubsub";
import { Booking } from "../../models/booking";
import { MembershipTier } from "../../models/membershipTier";
import { User } from "../../models/user";
import {
  cancelBooking,
  createNewBooking,
  getBookedDatesById,
  getBookingByUser,
  getDashboardMetaData,
  updateBookingPayment,
} from "../../controllers/booking";
import { refundBookingPayment } from "../../controllers/payment";
import { createBooking, createUser } from "../../test/helpers/factories";
import { createMockQuery } from "../../test/helpers/mock-queries";

jest.mock("../../apollo/pubsub", () => ({
  pubsub: { publish: jest.fn(), asyncIterableIterator: jest.fn() },
}));

jest.mock("../../models/booking", () => ({
  Booking: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    aggregate: jest.fn(),
  },
}));

jest.mock("../../models/user", () => ({
  User: {
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.mock("../../models/membershipTier", () => ({
  MembershipTier: {
    findOne: jest.fn(),
  },
  ensureDefaultMembershipTiers: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../controllers/payment", () => ({
  refundBookingPayment: jest.fn(),
}));

describe("booking controller", () => {
  test("createNewBooking rejects overlapping dates", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValue(createBooking());

    await expect(
      createNewBooking(
        {
          room: "room-1",
          startDate: "2026-05-10",
          endDate: "2026-05-12",
        },
        "user-1",
      ),
    ).rejects.toThrow("Selected dates overlap with an existing booking");
  });

  test("createNewBooking applies membership discount", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValue(null);
    (User.findById as jest.Mock).mockReturnValue(
      createMockQuery(createUser({ membershipTier: "gold" })),
    );
    (MembershipTier.findOne as jest.Mock).mockReturnValue(
      createMockQuery({ active: true, discountPercentage: 20 }),
    );
    const booking = createBooking();
    (Booking.create as jest.Mock).mockResolvedValue(booking);

    const result = await createNewBooking(
      {
        room: "room-1",
        startDate: "2026-05-10",
        endDate: "2026-05-12",
        customer: { name: "Alice", email: "alice@example.com" },
        rentPerDay: 100,
        daysOfRent: 2,
      },
      "user-1",
    );

    expect(Booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: { rent: 200, tax: 10, discount: 40, total: 170 },
        membershipTier: "gold",
      }),
    );
    expect(pubsub.publish).toHaveBeenCalledWith("NEW_BOOKING", {
      newBookingNoti: "Ne",
    });
    expect(result).toBe(booking);
  });

  test("createNewBooking applies referral discount and points", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValue(null);
    (User.findById as jest.Mock).mockReturnValue(createMockQuery(createUser()));
    (User.findOne as jest.Mock).mockResolvedValue(
      createUser({ _id: "owner-1", id: "owner-1", name: "Owner" }),
    );
    const booking = createBooking();
    (Booking.create as jest.Mock).mockResolvedValue(booking);

    await createNewBooking(
      {
        room: "room-1",
        startDate: "2026-05-10",
        endDate: "2026-05-12",
        customer: { name: "Alice", email: "alice@example.com" },
        rentPerDay: 100,
        daysOfRent: 2,
        referralCode: "save5",
      },
      "user-1",
    );

    expect(Booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        referralCode: "SAVE5",
        amount: { rent: 200, tax: 10, discount: 10, total: 200 },
      }),
    );
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith("owner-1", {
      $inc: { referralPoints: 5 },
    });
  });

  test("createNewBooking rejects invalid referral code", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValue(null);
    (User.findById as jest.Mock).mockReturnValue(createMockQuery(createUser()));
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      createNewBooking(
        {
          room: "room-1",
          startDate: "2026-05-10",
          endDate: "2026-05-12",
          customer: { name: "Alice", email: "alice@example.com" },
          rentPerDay: 100,
          daysOfRent: 2,
          referralCode: "bad",
        },
        "user-1",
      ),
    ).rejects.toThrow("Invalid referral code.");
  });

  test("updateBookingPayment confirms cash bookings", async () => {
    const booking = createBooking();
    (Booking.findById as jest.Mock).mockReturnValue(createMockQuery(booking));

    const result = await updateBookingPayment(
      "booking-1",
      { paymentInfo: { method: "cash" } } as any,
      { id: "user-1", role: ["user"] } as any,
    );

    expect(booking.status).toBe("confirmed");
    expect(booking.paymentInfo.status).toBe("paid");
    expect(booking.save).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test("cancelBooking refunds paid card booking", async () => {
    const booking = createBooking({
      paymentInfo: { status: "paid", method: "card", id: "pi_123" },
      startDate: new Date("2026-05-20"),
    });
    (Booking.findById as jest.Mock).mockReturnValue(createMockQuery(booking));
    (refundBookingPayment as jest.Mock).mockResolvedValue({ id: "re_1" });

    const result = await cancelBooking(
      "booking-1",
      "Change of plan",
      { id: "user-1", role: ["user"] } as any,
    );

    expect(refundBookingPayment).toHaveBeenCalledWith(booking);
    expect(booking.status).toBe("cancelled");
    expect(pubsub.publish).toHaveBeenCalledWith("BOOKING_CANCELLED", {
      bookingCancelledNoti: "booking-1",
    });
    expect(result).toBe(booking);
  });

  test("getBookedDatesById expands date range", async () => {
    (Booking.find as jest.Mock).mockResolvedValue([
      createBooking({
        startDate: new Date("2026-05-10"),
        endDate: new Date("2026-05-12"),
      }),
    ]);

    const result = await getBookedDatesById("room-1");

    expect(result).toHaveLength(3);
  });

  test("getBookingByUser returns meta summary", async () => {
    const bookings = [
      createBooking({ amount: { total: 100 }, paymentInfo: { status: "pending" } }),
      createBooking({
        _id: "booking-2",
        id: "booking-2",
        amount: { total: 50 },
        paymentInfo: { status: "paid" },
      }),
    ];
    (Booking.find as jest.Mock).mockReturnValue(createMockQuery(bookings));

    const result = await getBookingByUser("user-1");

    expect(result.meta).toEqual({
      totalBookings: 2,
      unpaidBookings: 1,
      needToPay: 100,
    });
  });

  test("getDashboardMetaData maps aggregate data", async () => {
    (Booking.aggregate as jest.Mock).mockResolvedValue([
      {
        salesData: [
          {
            _id: { date: "2026-05-01" },
            totalSales: 100,
            numOfBookings: 1,
          },
        ],
        pendingCashData: [{ totalPendingCash: 30 }],
        paidCashData: [{ totalPaidCash: 20 }],
        paymentMethodData: [{ method: "cash", count: 1, totalAmount: 20 }],
        statusData: [{ status: "confirmed", count: 1 }],
        cardSalesData: [{ totalCardSales: 80 }],
        confirmedBookingsData: [{ totalConfirmedBookings: 1 }],
        cancelledBookingsData: [{ totalCancelledBookings: 0 }],
        roomsBookedData: [{ roomsBooked: 1 }],
      },
    ]);

    const result = await getDashboardMetaData(
      new Date("2026-05-01"),
      new Date("2026-05-02"),
    );

    expect(result.sales).toHaveLength(2);
    expect(result.totalSales).toBe(100);
    expect(result.totalBookings).toBe(1);
    expect(result.averageBookingValue).toBe(100);
  });
});
