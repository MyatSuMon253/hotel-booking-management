import { Room } from "./room";
import { IUser } from "./user";

export const PaymentMethods = ["card", "cash"];
export const PaymentStatus = ["paid", "pending", "refunded"];
export const BookingStatus = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
];

export interface IBooking {
  id: string;
  user: IUser;
  room: Room;
  startDate: Date;
  endDate: Date;
  customer: {
    name: string;
    email: string;
  };
  amount: {
    rent: number;
    discount: number;
    tax: number;
    total: number;
  };
  daysOfRent: number;
  rentPerDay: number;
  paymentInfo: {
    id: string;
    status: string;
    method: string;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
  cancelledAt?: Date;
  cancelReason?: string;
  refundInfo?: {
    id: string;
    amount: number;
    status: string;
    refundedAt: Date;
  };
  additionalNote?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingInput = {
  room: string;
  startDate: Date;
  endDate: Date;
  customer: {
    name: string;
    email: string;
  };
  amount: {
    rent: number;
    discount: number;
    tax: number;
    total: number;
  };
  paymentInfo: {
    status: string;
    id: string;
    method: "cash" | "card";
  };
  daysOfRent: number;
  rentPerDay: number;
  additionalNote?: string;
};
