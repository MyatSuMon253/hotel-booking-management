import bcrypt from "bcryptjs";
import { Response } from "express";
import jwt from "jsonwebtoken";
import errorHandler from "../middlewares/errorHandler";
import { User } from "../models/user";
import { UserInput } from "../types/user";
import { deleteImage, uploadSingleImage } from "../utils/cloudinary";
import { forgetPasswordEmailTemplate } from "../utils/forget-password-email";
import { sendEmail } from "../utils/sendEmail";
import crypto from "crypto";

export const register = errorHandler(async (userInput: UserInput) => {
  const { name, email, password } = userInput;

  const user = await User.findOne({ email });

  if (user) {
    throw new Error("User already exists");
  }

  return await User.create({ name, email, password });
});

export const login = errorHandler(
  async (email: string, password: string, res: Response) => {
    const userDoc = await User.findOne({ email }).select("+password");

    if (!userDoc) {
      throw new Error("Invaild Email or Password.");
    }

    const isPassMatch = await bcrypt.compare(password, userDoc.password);

    if (!isPassMatch) {
      throw new Error("Invaild Email or Password.");
    }

    const token = jwt.sign({ _id: userDoc._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return userDoc;
  },
);

export const uploadAvatar = errorHandler(
  async (image: string, userId: string) => {
    const userDoc = await User.findById(userId);

    if (!userDoc) {
      throw new Error("User not found!");
    }

    const response = await uploadSingleImage(image, "baganhotel/avatar");

    if (userDoc.avatar?.public_id) {
      await deleteImage(userDoc.avatar?.public_id);
    }

    await User.findByIdAndUpdate(userId, {
      avatar: {
        url: response.img_url,
        public_id: response.public_id,
      },
    });

    return true;
  },
);

export const updateUserProfile = errorHandler(
  async (userInfo: Partial<UserInput>, userId: string) => {
    const userDoc = await User.findById(userId);

    if (!userDoc) {
      throw new Error("User not found!");
    }

    userDoc.set(userInfo).save();

    return true;
  },
);

export const getAllUsers = errorHandler(async () => {
  await ensureReferralCodesForMembers();
  return await User.find().sort({ createdAt: -1 });
});

export const getUserById = errorHandler(async (userId: string) => {
  const userDoc = await User.findById(userId);
  if (!userDoc) {
    throw new Error("User not found");
  }
  if (userDoc.membershipTier && !userDoc.referralCode) {
    await userDoc.save();
  }
  return userDoc;
});

export const validateReferralCode = errorHandler(async (code: string) => {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return { isValid: false, ownerName: null };
  }

  const referralOwner = await User.findOne({
    referralCode: normalizedCode,
    membershipTier: { $exists: true, $ne: null },
    isActive: true,
  });

  return {
    isValid: !!referralOwner,
    ownerName: referralOwner?.name ?? null,
  };
});

export const updateUser = errorHandler(
  async (
    userId: string,
    updates: Partial<Pick<UserInput, "role">> & {
      isActive?: boolean;
      membershipTier?: "silver" | "gold" | "diamond" | null;
      referralPointsAdjustment?: number;
    },
  ) => {
    const userDoc = await User.findById(userId);

    if (!userDoc) {
      throw new Error("User not found!");
    }

    if (updates.role) {
      userDoc.role = updates.role;
    }
    if (typeof updates.isActive === "boolean") {
      userDoc.isActive = updates.isActive;
    }
    if (Object.prototype.hasOwnProperty.call(updates, "membershipTier")) {
      if (updates.membershipTier) {
        userDoc.membershipTier = updates.membershipTier;
      } else {
        userDoc.membershipTier = undefined;
        userDoc.referralCode = undefined;
      }
    }
    if (typeof updates.referralPointsAdjustment === "number") {
      if (updates.referralPointsAdjustment < 0) {
        throw new Error("Referral points adjustment cannot be negative.");
      }

      userDoc.referralPoints =
        (userDoc.referralPoints ?? 0) + updates.referralPointsAdjustment;
    }

    await userDoc.save();
    return true;
  },
);

export const deleteUserById = errorHandler(async (userId: string) => {
  const userDoc = await User.findByIdAndDelete(userId);

  if (!userDoc) {
    throw new Error("User not found!");
  }

  return true;
});

export const updateUserPassword = errorHandler(
  async (oldPassword: string, newPassword: string, userId: string) => {
    const userDoc = await User.findById(userId).select("+password");

    if (!userDoc) {
      throw new Error("User not found!");
    }
    console.log("updateUserPassword", oldPassword, userDoc.password);
    const isMatch = await bcrypt.compare(oldPassword, userDoc.password);

    if (!isMatch) {
      throw new Error("Your old password is wrong!");
    }

    userDoc.password = newPassword;
    await userDoc.save();

    return true;
  },
);

async function ensureReferralCodesForMembers() {
  const membersWithoutCodes = await User.find({
    membershipTier: { $exists: true, $ne: null },
    $or: [{ referralCode: { $exists: false } }, { referralCode: null }],
  });

  await Promise.all(membersWithoutCodes.map((userDoc) => userDoc.save()));
}

export const forgetPassword = errorHandler(async (customer_email: string) => {
  const user = await User.findOne({ email: customer_email });

  if (!user) {
    throw new Error("User not found with this email address.");
  }

  const token = user.generatePasswordResetToken();
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const body = forgetPasswordEmailTemplate(resetUrl);

  try {
    await sendEmail({
      customer_email: user.email,
      subject: "Your password is reset.",
      body,
    });
  } catch (error: any) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    throw new Error(error?.message);
  }

  return true;
});

export const resetPassword = errorHandler(
  async (token: string, newPassword: string, confirmNewPassword: string) => {
    const reset_token = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: reset_token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Token is invalid");
    }

    if (newPassword !== confirmNewPassword) {
      throw new Error("Password do not match");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return true;
  },
);
