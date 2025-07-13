export type Room = {
  roomNumber: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  isAvailable: boolean;
  images: RoomImage[];
  reviews: string[];
  createdAt: string;
  updatedAt: string;
}

type RoomImage = {
  url: string;
  public_id: string;
}