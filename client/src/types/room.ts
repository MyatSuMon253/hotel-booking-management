export type Room = {
  id: string;
  title: string;
  roomNumber?: string;
  type?: string;
  pricePerNight: number;
  capacity: number;
  location: string;
  isAvailable?: boolean;
  images: RoomImage[];
  reviews: string[];
  createdAt?: string;
  updatedAt?: string;
}

type RoomImage = {
  url: string;
  public_id: string;
}