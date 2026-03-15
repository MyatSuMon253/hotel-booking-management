export type BookingRow = {
  id: string;
  roomTitle: string;
  roomId: string;
  startDate: string;
  endDate: string;
  total: number;
  daysOfRent: number;
  paymentStatus: "paid" | "pending";
  paymentMethod: "card" | "cash";
  customerEmail: string;
  customerName: string;
};
