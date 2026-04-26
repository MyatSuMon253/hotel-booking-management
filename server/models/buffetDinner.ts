import mongoose from "mongoose";
import { IBuffetDinner } from "../types/buffet";

const buffetDinnerSchema = new mongoose.Schema<IBuffetDinner>(
  {
    title: {
      type: String,
      required: [true, "Buffet dinner title is required."],
      trim: true,
    },
    cuisineCategory: {
      type: String,
      required: [true, "Cuisine category is required."],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    startsAt: {
      type: Date,
      required: [true, "Start time is required."],
    },
    endsAt: {
      type: Date,
      required: [true, "End time is required."],
    },
    includedDishes: [
      {
        type: String,
        required: true,
      },
    ],
    maxCapacity: {
      type: Number,
      required: [true, "Maximum capacity is required."],
      min: [1, "Maximum capacity must be at least 1."],
    },
    pricePerGuest: {
      type: Number,
      required: [true, "Price per guest is required."],
      min: [0.01, "Price per guest must be greater than 0."],
    },
    facilities: [
      {
        type: String,
        trim: true,
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const BuffetDinner = mongoose.model<IBuffetDinner>(
  "BuffetDinner",
  buffetDinnerSchema,
);
