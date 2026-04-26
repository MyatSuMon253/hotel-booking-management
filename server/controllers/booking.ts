import { IUser } from "../types/user";
import errorHandler from "../middlewares/errorHandler";
import { Booking } from "../models/booking";
import { User } from "../models/user";
import { NotFoundError } from "../utils/not-found";
import { BookingInput } from "../types/booking";
import { pubsub } from "../apollo/pubsub";
import { refundBookingPayment } from "./payment";
import {
  MembershipTier,
  ensureDefaultMembershipTiers,
} from "../models/membershipTier";

const REFERRAL_DISCOUNT_PERCENT = 0.05;
const VALID_REFERRAL_CODES = ["HOTEL5", "WELCOME5", "REFERRAL5"];

const isValidReferralCode = (code: string) =>
  VALID_REFERRAL_CODES.includes(code.trim().toUpperCase());

const getMembershipDiscountPercent = async (tier?: string) => {
  if (!tier) return 0;

  await ensureDefaultMembershipTiers();

  const membershipTier = await MembershipTier.findOne({
    name: tier,
  }).lean();

  if (membershipTier) {
    return membershipTier.active ? membershipTier.discountPercentage / 100 : 0;
  }

  return 0;
};

export const createNewBooking = errorHandler(
  async (bookingInput: any, userId: string) => {
    const {
      room,
      startDate,
      endDate,
      customer,
      rentPerDay,
      daysOfRent,
      additionalNote,
      referralCode,
    } = bookingInput;

    const overlapping = await Booking.findOne({
      room,
      status: { $ne: "cancelled" },
      startDate: { $lt: new Date(endDate) },
      endDate: { $gt: new Date(startDate) },
    });

    if (overlapping) {
      throw new Error("Selected dates overlap with an existing booking");
    }

    const user = await User.findById(userId).lean();
    const membershipTier = user?.membershipTier;
    const normalizedReferralCode = referralCode?.trim();
    const referralIsValid = normalizedReferralCode
      ? isValidReferralCode(normalizedReferralCode)
      : false;

    if (normalizedReferralCode && !membershipTier && !referralIsValid) {
      throw new Error("Invalid referral code.");
    }

    const discountPercent = membershipTier
      ? await getMembershipDiscountPercent(membershipTier)
      : referralIsValid
        ? REFERRAL_DISCOUNT_PERCENT
        : 0;

    const rent = rentPerDay * daysOfRent;
    const tax = rent * 0.05;
    const discount = rent * discountPercent;
    const total = rent + tax - discount;

    const bookingData: any = {
      room,
      startDate,
      endDate,
      customer,
      amount: {
        rent,
        tax,
        discount,
        total,
      },
      daysOfRent,
      rentPerDay,
      additionalNote,
      user: userId,
    };

    if (membershipTier) {
      bookingData.membershipTier = membershipTier;
    }

    if (!membershipTier && referralIsValid) {
      bookingData.referralCode = normalizedReferralCode.toUpperCase();
    }

    const newBooking = await Booking.create(bookingData);

    pubsub.publish("NEW_BOOKING", {
      newBookingNoti: "Ne",
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

    booking.set(bookingInput);

    if (booking.paymentInfo?.method === "cash") {
      booking.paymentInfo.status = "paid";
      booking.status = "confirmed";
    }

    await booking.save();

    return true;
  },
);

export const cancelBooking = errorHandler(
  async (bookingId: string, reason: string | undefined, user: IUser) => {
    const booking = await Booking.findById(bookingId).populate("room");

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    const isAdmin = user.role?.includes("admin");
    const isOwner = booking.user.toString() === user.id;

    if (!isAdmin && !isOwner) {
      throw new Error("You do not have permission to cancel this booking!");
    }

    if (booking.status === "cancelled") {
      throw new Error("Booking is already cancelled");
    }

    if (!isAdmin && new Date() >= new Date(booking.startDate)) {
      throw new Error("Cannot cancel booking after check-in date");
    }

    if (
      booking.paymentInfo?.status === "paid" &&
      booking.paymentInfo?.method === "card" &&
      booking.paymentInfo?.id
    ) {
      await refundBookingPayment(booking);
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    if (reason) booking.cancelReason = reason;

    await booking.save();

    pubsub.publish("BOOKING_CANCELLED", {
      bookingCancelledNoti: booking.id,
    });

    return booking;
  },
);

export const getBookedDatesById = errorHandler(async (roomId: string) => {
  const bookings = await Booking.find({
    room: roomId,
    status: { $ne: "cancelled" },
  });

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
    (booking) =>
      booking.paymentInfo?.status !== "paid" && booking.status !== "cancelled",
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

const getMetaData = errorHandler(async (startDate: Date, endDate: Date) => {
  const salesDataInfo = await Booking.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },

    {
      $facet: {
        /* [
          {_id: {date: "2026-04-04"}, totalSales: 1000, numOfBookings: 10},
          {_id: {date: "2026-04-04"}, totalSales: 1000, numOfBookings: 10}
        ]
          {"2026-04-04": {sales: 1000, bookings: 100}}
        */
        salesData: [
          {
            $group: {
              _id: {
                date: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                  },
                },
              },
              totalSales: { $sum: "$amount.total" },
              numOfBookings: { $sum: 1 },
            },
          },
        ],
        pendingCashData: [
          {
            $match: { "paymentInfo.status": "pending" },
          },
          {
            $group: {
              _id: null,
              totalPendingCash: { $sum: "$amount.total" },
            },
          },
        ],
        paidCashData: [
          {
            $match: {
              "paymentInfo.status": "paid",
              "paymentInfo.method": "cash",
            },
          },
          {
            $group: {
              _id: null,
              totalPaidCash: { $sum: "$amount.total" },
            },
          },
        ],
        paymentMethodData: [
          {
            $group: {
              _id: "$paymentInfo.method",
              count: { $sum: 1 },
              totalAmount: { $sum: "$amount.total" },
            },
          },
          {
            $project: {
              _id: 0,
              method: "$_id",
              count: 1,
              totalAmount: 1,
            },
          },
        ],
        statusData: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              status: "$_id",
              count: 1,
            },
          },
        ],
        cardSalesData: [
          {
            $match: {
              "paymentInfo.status": "paid",
              "paymentInfo.method": "card",
            },
          },
          {
            $group: {
              _id: null,
              totalCardSales: { $sum: "$amount.total" },
            },
          },
        ],
        confirmedBookingsData: [
          {
            $match: { status: "confirmed" },
          },
          {
            $group: {
              _id: null,
              totalConfirmedBookings: { $sum: 1 },
            },
          },
        ],
        cancelledBookingsData: [
          {
            $match: { status: "cancelled" },
          },
          {
            $group: {
              _id: null,
              totalCancelledBookings: { $sum: 1 },
            },
          },
        ],
        roomsBookedData: [
          {
            $group: {
              _id: null,
              roomsBooked: { $addToSet: "$room" },
            },
          },
          {
            $project: {
              roomsBooked: { $size: "$roomsBooked" },
            },
          },
        ],
      },
    },
  ]);

  const {
    salesData: salesDataResult = [],
    pendingCashData: pendingCashDataResult = [],
    paidCashData: paidCashDataResult = [],
    paymentMethodData: paymentMethodDataResult = [],
    statusData: statusDataResult = [],
    cardSalesData: cardSalesDataResult = [],
    confirmedBookingsData: confirmedBookingsDataResult = [],
    cancelledBookingsData: cancelledBookingsDataResult = [],
    roomsBookedData: roomsBookedDataResult = [],
  } = salesDataInfo[0];

  const salesMap = new Map();
  let totalSales = 0;
  let totalBookings = 0;

  salesDataResult?.forEach((data: any) => {
    const date = data?._id?.date; //"2026-04-04"
    const sales = data?.totalSales || 0;
    const bookings = data?.numOfBookings || 0;

    salesMap.set(date, { sales, bookings });
    totalSales += sales;
    totalBookings += bookings;
  });

  // {"2025-10-01":{sales : 1000, bookings:100}}
  let currentDate = new Date(startDate);
  const finalSalesData = [];

  while (currentDate <= endDate) {
    // [
    // 2025-10-01
    // {
    //    2025-10-01,
    //    sales : 1000 || 0,
    //    bookings : 100 || 0
    // }
    // 2025-10-02

    // {
    //    2025-10-02,
    //    sales :  0,
    //    bookings : 0
    // }
    // ]
    const date = currentDate.toISOString().split("T")[0];
    finalSalesData.push({
      date,
      sales: salesMap.get(date)?.sales || 0,
      bookings: salesMap.get(date)?.bookings || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const totalPendingAmount = pendingCashDataResult[0]?.totalPendingCash || 0;
  const totalPaidCashAmount = paidCashDataResult[0]?.totalPaidCash || 0;
  const totalCardSales = cardSalesDataResult[0]?.totalCardSales || 0;
  const totalConfirmedBookings =
    confirmedBookingsDataResult[0]?.totalConfirmedBookings || 0;
  const totalCancelledBookings =
    cancelledBookingsDataResult[0]?.totalCancelledBookings || 0;
  const totalRoomsBooked = roomsBookedDataResult[0]?.roomsBooked || 0;
  const averageBookingValue = totalBookings ? totalSales / totalBookings : 0;

  return {
    salesData: finalSalesData,
    totalSales,
    totalBookings,
    totalPendingAmount,
    totalPaidCashAmount,
    totalCardSales,
    totalConfirmedBookings,
    totalCancelledBookings,
    averageBookingValue,
    totalRoomsBooked,
    paymentMethodDistribution: paymentMethodDataResult,
    statusDistribution: statusDataResult,
  };
});

export const getAllBookings = errorHandler(async () => {
  const bookings = await Booking.find()
    .populate("room")
    .populate("user")
    .sort({ createdAt: -1 });
  return bookings;
});

export const getDashboardMetaData = errorHandler(
  async (startDate: Date, endDate: Date) => {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    const {
      salesData,
      totalSales,
      totalBookings,
      totalPendingAmount,
      totalPaidCashAmount,
      totalCardSales,
      totalConfirmedBookings,
      totalCancelledBookings,
      averageBookingValue,
      totalRoomsBooked,
      paymentMethodDistribution,
      statusDistribution,
    } = await getMetaData(startDate, endDate);

    return {
      sales: salesData,
      totalSales,
      totalBookings,
      totalPendingAmount,
      totalPaidCashAmount,
      totalCardSales,
      totalConfirmedBookings,
      totalCancelledBookings,
      averageBookingValue,
      totalRoomsBooked,
      paymentMethodDistribution,
      statusDistribution,
    };
  },
);
