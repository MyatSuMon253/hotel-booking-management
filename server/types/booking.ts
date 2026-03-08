import { Room } from "./room";
import { IUser } from "./user";

export const PaymentMethods = ["card", "cash"];
export const PaymentStatus = ["paid", "pending"];

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
