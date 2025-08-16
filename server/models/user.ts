import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { IUser } from "types/user";

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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// userSchema.methods.generatePasswordResetToken = function (): string {
//   const token = crypto.randomBytes(20).toString("hex");

//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(token)
//     .digest("hex");

//   this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//   return token;
// };

export const User = mongoose.model<IUser>("User", userSchema);
