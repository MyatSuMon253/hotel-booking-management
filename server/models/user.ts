import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import crypto from "crypto";
import { IUser } from "../types/user";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password."],
      minLength: [6, "Your password must be longer than 6 characters."],
      select: false,
    },
    avatar: {
      url: String,
      public_id: String,
    },
    role: {
      type: [String],
      default: "user",
      enum: {
        values: ["user", "admin"],
        message: "Please select a corret role.",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    membershipTier: {
      type: String,
      enum: {
        values: ["silver", "gold", "diamond"],
        message: "Invalid membership tier.",
      },
    },
    referralCode: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    referralPoints: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.membershipTier || this.referralCode) {
    return next();
  }

  const UserModel = this.constructor as mongoose.Model<IUser>;
  let referralCode = "";
  let codeExists = true;

  while (codeExists) {
    const prefix = this.name
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 4)
      .toUpperCase()
      .padEnd(4, "RHB");
    referralCode = `${prefix}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    codeExists = !!(await UserModel.exists({
      _id: { $ne: this._id },
      referralCode,
    }));
  }

  this.referralCode = referralCode;
  next();
});

userSchema.methods.generatePasswordResetToken = function (): string {
  const token = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return token;
};

export const User = mongoose.model<IUser>("User", userSchema);
