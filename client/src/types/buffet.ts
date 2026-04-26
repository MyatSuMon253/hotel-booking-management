export interface Dish {
  id: string;
  name: string;
  cuisineCategory: string;
  description?: string;
  imageUrl?: string;
}

export interface BuffetDinner {
  id: string;
  title: string;
  cuisineCategory: string;
  description?: string;
  imageUrl?: string;
  startsAt: string;
  endsAt: string;
  includedDishes: Dish[];
  maxCapacity: number;
  remainingCapacity: number;
  pricePerGuest: number;
  facilities: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BuffetBooking {
  id: string;
  buffetDinner: BuffetDinner;
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
    status?: "paid" | "pending" | "refunded";
    method?: "card" | "cash";
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
  additionalNote?: string;
  createdAt: string;
  updatedAt: string;
}
