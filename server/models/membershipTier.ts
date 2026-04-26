import mongoose from "mongoose";
import { IMembershipTier } from "../types/membershipTier";

export const MEMBERSHIP_TIER_NAMES = ["silver", "gold", "diamond"] as const;
export const DEFAULT_MEMBERSHIP_TIERS = [
  { name: "silver", discountPercentage: 10 },
  { name: "gold", discountPercentage: 20 },
  { name: "diamond", discountPercentage: 30 },
] as const;

const membershipTierSchema = new mongoose.Schema<IMembershipTier>(
  {
    name: {
      type: String,
      required: [true, "Membership tier name is required."],
      unique: true,
      lowercase: true,
      trim: true,
      enum: {
        values: MEMBERSHIP_TIER_NAMES,
        message: "Invalid membership tier.",
      },
    },
    discountPercentage: {
      type: Number,
      required: [true, "Membership tier discount is required."],
      min: [0, "Discount percentage must be zero or greater."],
      max: [100, "Discount percentage cannot be greater than 100."],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const MembershipTier = mongoose.model<IMembershipTier>(
  "MembershipTier",
  membershipTierSchema,
);

export const ensureDefaultMembershipTiers = async () => {
  const count = await MembershipTier.countDocuments();
  if (count > 0) return;

  await MembershipTier.insertMany(
    DEFAULT_MEMBERSHIP_TIERS.map((tier) => ({
      ...tier,
      active: true,
    })),
  );
};
