import mongoose from "mongoose";
import {
  BuffetBookingStatus,
  IBuffetBooking,
} from "../types/buffet";
import { PaymentMethods, PaymentStatus } from "../types/booking";

const buffetBookingSchema = new mongoose.Schema<IBuffetBooking>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buffetDinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuffetDinner",
      required: true,
    },
    customer: {
      type: {
        name: String,
        email: String,
      },
      required: true,
    },
    guestCount: {
      type: Number,
      required: [true, "Guest count is required."],
      min: [1, "Guest count must be at least 1."],
    },
    pricePerGuest: {
      type: Number,
      required: [true, "Price per guest is required."],
    },
    amount: {
      type: {
        subtotal: Number,
        tax: Number,
        total: Number,
      },
      required: true,
    },
    paymentInfo: {
      type: {
        id: String,
        status: {
          type: String,
          enum: { values: PaymentStatus, message: "Invalid payment status" },
          default: "pending",
        },
        method: {
          type: String,
          enum: { values: PaymentMethods, message: "Invalid payment method" },
        },
      },
    },
    status: {
      type: String,
      enum: { values: BuffetBookingStatus, message: "Invalid booking status" },
      default: "pending",
    },
    cancelledAt: Date,
    cancelReason: String,
    additionalNote: String,
  },
  {
    timestamps: true,
  },
);

export const BuffetBooking = mongoose.model<IBuffetBooking>(
  "BuffetBooking",
  buffetBookingSchema,
);
