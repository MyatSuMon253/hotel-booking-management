import mongoose from "mongoose";

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
    resetPasswordToken: String,
    resetPasswordExpire: String,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);