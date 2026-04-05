import { Document } from "mongoose";
import { IUser } from "./user";
import { Room } from "./room";

export interface IReview extends Document {
  _id: string;
  user: IUser;
  room: Room;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewInput {
  rating: number;
  comment: string;
  roomId: string;
}