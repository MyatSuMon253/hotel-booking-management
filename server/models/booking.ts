import mongoose from "mongoose";
import {
  BookingStatus,
  IBooking,
  PaymentMethods,
  PaymentStatus,
} from "../types/booking";

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    customer: {
      type: {
        name: String,
        email: String,
      },
      required: true,
    },
    amount: {
      type: {
        rent: Number,
        discount: Number,
        tax: Number,
        total: Number,
      },
      required: true,
    },
    membershipTier: {
      type: String,
      enum: {
        values: ["silver", "gold", "diamond"],
        message: "Invalid membership tier.",
      },
    },
    referralCode: String,
    referralOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    daysOfRent: {
      type: Number,
      required: true,
    },
    rentPerDay: {
      type: Number,
      required: true,
    },
    paymentInfo: {
      type: {
        id: String,
        status: {
          type: String,
          enum: { values: PaymentStatus, message: "Invaild payment status" },
          default: "pending",
        },
        method: {
          type: String,
          enum: { values: PaymentMethods, message: "Invaild payment method" },
        },
      },
    },
    status: {
      type: String,
      enum: { values: BookingStatus, message: "Invalid booking status" },
      default: "pending",
    },
    cancelledAt: Date,
    cancelReason: String,
    refundInfo: {
      type: {
        id: String,
        amount: Number,
        status: String,
        refundedAt: Date,
      },
    },
    additionalNote: String,
  },
  {
    timestamps: true,
  },
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
