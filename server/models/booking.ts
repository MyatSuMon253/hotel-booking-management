import mongoose from "mongoose";
import { IBooking, PaymentMethods, PaymentStatus } from "../types/booking";

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
    additionalNote: String,
  },
  {
    timestamps: true,
  },
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
