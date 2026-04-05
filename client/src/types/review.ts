import type { Room } from "./room";
import type { User } from "./user";

export interface IReview {
  id: string;
  user: User;
  room: Room;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
