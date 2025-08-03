import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role?: string[];
  avatar: {
    url: string;
    public_id: string;
  };
  resetPasswordToken: string | undefined;
  resetPasswordExpire: Date | undefined;
  createdAt: string;
  updatedAt: string;
  generatePasswordResetToken(): string;
}

export type UserInput = {
  name: string;
  email: string;
  password: string;
  role?: string[];
};