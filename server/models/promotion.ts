import mongoose from "mongoose";
import { IPromotion } from "../types/promotion";

const promotionSchema = new mongoose.Schema<IPromotion>(
  {
    code: {
      type: String,
      required: [true, "Promotion code is required."],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    discountType: {
      type: String,
      required: [true, "Promotion discount type is required."],
      enum: ["percentage", "fixed"],
    },
    discountValue: {
      type: Number,
      required: [true, "Promotion discount value is required."],
      min: [0, "Discount value must be positive."],
    },
    validFrom: {
      type: Date,
      required: [true, "Promotion start date is required."],
    },
    validTo: {
      type: Date,
      required: [true, "Promotion end date is required."],
    },
    active: {
      type: Boolean,
      default: true,
    },
    maxUses: {
      type: Number,
      min: [0, "Max uses must be zero or greater."],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, "Used count cannot be negative."],
    },
    applicableRooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Promotion = mongoose.model<IPromotion>(
  "Promotion",
  promotionSchema,
);
