import type { IReview } from "./review";

export type Room = {
  id: string;
  title?: string;
  description?: string;
  roomNumber?: string;
  type?: string;
  pricePerNight: number;
  capacity: number;
  location: string;
  isAvailable?: boolean;
  images: RoomImage[];
  reviews: IReview[];
  createdAt?: string;
  updatedAt?: string;
};

type RoomImage = {
  url: string;
  public_id: string;
};
