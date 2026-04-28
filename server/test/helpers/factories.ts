type BaseDoc = {
  _id?: string;
  id?: string;
  save?: jest.Mock<Promise<unknown>, []>;
  set?: jest.Mock<any, [unknown]>;
  deleteOne?: jest.Mock<Promise<unknown>, []>;
};

export const createDoc = <T extends object>(
  data: T & BaseDoc,
): T & Required<BaseDoc> => {
  const doc: T & Required<BaseDoc> = {
    _id: data._id ?? "id-1",
    id: data.id ?? data._id ?? "id-1",
    save: jest.fn().mockResolvedValue(undefined),
    set: jest.fn(),
    deleteOne: jest.fn().mockResolvedValue(undefined),
    ...data,
  };

  if (!data.set) {
    doc.set = jest.fn((updates: unknown) => {
      Object.assign(doc as object, updates);
      return doc;
    });
  }

  if (!data.save) {
    doc.save = jest.fn().mockResolvedValue(doc);
  }

  if (!data.deleteOne) {
    doc.deleteOne = jest.fn().mockResolvedValue(undefined);
  }

  return doc;
};

export const createUser = (overrides: Record<string, unknown> = {}) =>
  createDoc({
    _id: "user-1",
    id: "user-1",
    name: "Alice",
    email: "alice@example.com",
    password: "hashed-password",
    role: ["user"],
    isActive: true,
    membershipTier: undefined,
    referralCode: undefined,
    referralPoints: 0,
    generatePasswordResetToken: jest.fn().mockReturnValue("reset-token"),
    ...overrides,
  });

export const createRoom = (overrides: Record<string, unknown> = {}) =>
  createDoc({
    _id: "room-1",
    id: "room-1",
    title: "Suite",
    description: "Sea view",
    images: [{ url: "https://example.com/1.jpg", public_id: "img-1" }],
    reviews: [],
    ...overrides,
  });

export const createBooking = (overrides: Record<string, unknown> = {}) =>
  createDoc({
    _id: "booking-1",
    id: "booking-1",
    user: "user-1",
    room: createRoom(),
    startDate: new Date("2026-05-10"),
    endDate: new Date("2026-05-12"),
    customer: { name: "Alice", email: "alice@example.com" },
    amount: { rent: 200, tax: 10, discount: 0, total: 210 },
    paymentInfo: { status: "pending", method: "cash" },
    status: "pending",
    ...overrides,
  });

export const createBuffetDinner = (overrides: Record<string, unknown> = {}) =>
  createDoc({
    _id: "buffet-1",
    id: "buffet-1",
    title: "Seafood Night",
    cuisineCategory: "Seafood",
    description: "Fresh seafood",
    startsAt: new Date("2026-05-10T18:00:00.000Z"),
    endsAt: new Date("2026-05-10T21:00:00.000Z"),
    includedDishes: ["dish-1"],
    maxCapacity: 50,
    pricePerGuest: 20,
    active: true,
    ...overrides,
  });

export const createBuffetBooking = (overrides: Record<string, unknown> = {}) =>
  createDoc({
    _id: "buffet-booking-1",
    id: "buffet-booking-1",
    user: "user-1",
    buffetDinner: createBuffetDinner(),
    customer: { name: "Alice", email: "alice@example.com" },
    guestCount: 2,
    amount: { subtotal: 40, tax: 2, total: 42 },
    paymentInfo: { status: "pending", method: "cash" },
    status: "pending",
    ...overrides,
  });

export const createReview = (overrides: Record<string, unknown> = {}) =>
  createDoc({
    _id: "review-1",
    id: "review-1",
    user: "user-1",
    room: "room-1",
    rating: 4,
    comment: "Nice stay",
    ...overrides,
  });

export const createPromotion = (overrides: Record<string, unknown> = {}) =>
  createDoc({
    _id: "promotion-1",
    id: "promotion-1",
    code: "SAVE10",
    discountType: "percentage",
    discountValue: 10,
    validFrom: new Date("2026-05-01"),
    validTo: new Date("2026-05-31"),
    active: true,
    usedCount: 0,
    ...overrides,
  });

export const createMembershipTier = (
  overrides: Record<string, unknown> = {},
) =>
  createDoc({
    _id: "tier-1",
    id: "tier-1",
    name: "silver",
    discountPercentage: 10,
    active: true,
    ...overrides,
  });
