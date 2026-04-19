export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export type BookingRow = {
  id: string;
  roomTitle: string;
  roomId: string;
  startDate: string;
  endDate: string;
  total: number;
  daysOfRent: number;
  paymentStatus: "paid" | "pending" | "refunded";
  paymentMethod: "card" | "cash";
  status: BookingStatus;
  customerEmail: string;
  customerName: string;
};
