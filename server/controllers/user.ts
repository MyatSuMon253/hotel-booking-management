import bcrypt from "bcryptjs";
import { Response } from "express";
import jwt from "jsonwebtoken";
import errorHandler from "../middlewares/errorHandler";
import { User } from "../models/user";
import { UserInput } from "../types/user";
import { deleteImage, uploadSingleImage } from "../utils/cloudinary";

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
        url: response.image_url,
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
