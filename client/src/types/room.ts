import type { IReview } from "./review";

export type Room = {
  id: string;
  roomNumber: string;
  title?: string;
  description?: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  isAvailable: boolean;
  images: RoomImage[];
  reviews: IReview[];
  location: string;
  createdAt: string;
  updatedAt: string;
  canReview: boolean;
  ratings: {
    value: number;
    count: number;
  };
};

type RoomImage = {
  url: string;
  public_id: string;
};
