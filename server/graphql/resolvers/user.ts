import { Response } from "express";
import {
  forgetPassword,
  getAllUsers,
  getUserById,
  login,
  register,
  resetPassword,
  updateUser,
  updateUserPassword,
  updateUserProfile,
  uploadAvatar,
  deleteUserById,
  validateReferralCode,
} from "../../controllers/user";
import { IUser, UserInput } from "../../types/user";

export const userResolvers = {
  Query: {
    currentUser: async (_: any, __: any, { user }: { user: IUser }) => {
      if (user?.membershipTier && !user.referralCode) {
        await user.save();
      }
      return user;
    },
    logout: async (_: any, __: any, { res }: { res: Response }) => {
      res.cookie("token", null, { maxAge: 0 });
      return true;
    },
    getAllUsers: async () => getAllUsers(),
    getUserById: async (_: any, { userId }: { userId: string }) =>
      getUserById(userId),
    validateReferralCode: async (_: any, { code }: { code: string }) =>
      validateReferralCode(code),
  },
  Mutation: {
    updateUser: async (
      _: any,
      {
        userId,
        roles,
        isActive,
        membershipTier,
      }: {
        userId: string;
        roles?: string[];
        isActive?: boolean;
        membershipTier?: string;
      },
    ) => updateUser(userId, { role: roles, isActive, membershipTier }),
    deleteUser: async (_: any, { userId }: { userId: string }) =>
      deleteUserById(userId),
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
    updateUserPassword: async (
      _: any,
      {
        oldPassword,
        newPassword,
      }: { oldPassword: string; newPassword: string },
      { user }: { user: IUser },
    ) => updateUserPassword(oldPassword, newPassword, user._id),
    forgetPassword: async (_: any, { email }: { email: string }) => {
      forgetPassword(email);
    },
    resetPassword: async (
      _: any,
      {
        token,
        newPassword,
        confirmNewPassword,
      }: { token: string; newPassword: string; confirmNewPassword: string },
    ) => {
      resetPassword(token, newPassword, confirmNewPassword);
    },
  },
};
