import { IUser } from "./user";

export const BuffetBookingStatus = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
];

export interface IDish {
  id: string;
  name: string;
  cuisineCategory: string;
  description?: string;
  imageUrl?: string;
}

export interface IBuffetDinner {
  id: string;
  title: string;
  cuisineCategory: string;
  description?: string;
  imageUrl?: string;
  startsAt: Date;
  endsAt: Date;
  includedDishes: string[];
  maxCapacity: number;
  pricePerGuest: number;
  facilities: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBuffetBooking {
  id: string;
  user: IUser;
  buffetDinner: IBuffetDinner;
  customer: {
    name: string;
    email: string;
  };
  guestCount: number;
  pricePerGuest: number;
  amount: {
    subtotal: number;
    tax: number;
    total: number;
  };
  paymentInfo?: {
    id?: string;
    status?: string;
    method?: string;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
  cancelledAt?: Date;
  cancelReason?: string;
  additionalNote?: string;
  createdAt: string;
  updatedAt: string;
}
