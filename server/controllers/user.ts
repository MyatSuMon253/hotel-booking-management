import bcrypt from "bcryptjs";
import { User } from "../models/user";
import { UserInput } from "../types/user";
// import jwt from "jsonwebtoken";

export const register = async (userInput: UserInput) => {
  const { name, email, password } = userInput;

  const user = await User.findOne({ email });

  if (user) {
    throw new Error("User already exists");
  }

  return await User.create({ name, email, password });
}

export const login = async (email: string, password: string) => {
  const userDoc = await User.findOne({ email }).select("+password");

  if (!userDoc) {
    throw new Error("Invalid Email or Password");
  }

  const isMatch = await bcrypt.compare(password, userDoc.password);

  if (!isMatch) {
    throw new Error("Invalid Email or Password");
  }

  return {
    user: userDoc,
  };
}