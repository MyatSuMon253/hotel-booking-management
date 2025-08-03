import { User } from "../models/user";
import { UserInput } from "../types/user";

export const register = async (userInput: UserInput) => {
  const { name, email, password } = userInput;

  const user = await User.findOne({ email });

  if (user) {
    throw new Error("User already exists");
  }

  return await User.create({ name, email, password });
}