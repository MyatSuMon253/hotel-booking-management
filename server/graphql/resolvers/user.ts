import { Response } from "express";
import {
  login,
  register,
  updateUserProfile,
  uploadAvatar,
} from "../../controllers/user";
import { IUser, UserInput } from "../../types/user";

export const userResolvers = {
  Query: {
    currentUser: async (_: any, __: any, { user }: { user: IUser }) => {
      return user;
    },
    logout: async (_: any, __: any, { res }: { res: Response }) => {
      res.cookie("token", null, { maxAge: 0 });
      return true;
    },
  },
  Mutation: {
    register: async (
      _: any,
      {
        userInput,
      }: {
        userInput: UserInput;
      },
    ) => register(userInput),
    login: async (
      _: any,
      { email, password }: { email: string; password: string },
      { res }: { res: Response },
    ) => login(email, password, res),
    uploadAvatar: async (
      _: any,
      { image }: { image: string },
      { user }: { user: IUser },
    ) => uploadAvatar(image, user._id),
    updateUserProfile: async (
      _: any,
      { userInfo }: { userInfo: Partial<UserInput> },
      { user }: { user: IUser },
    ) => updateUserProfile(userInfo, user._id),
  },
};
