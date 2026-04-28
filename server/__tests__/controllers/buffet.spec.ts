import { BuffetBooking } from "../../models/buffetBooking";
import { BuffetDinner } from "../../models/buffetDinner";
import {
  cancelBuffetBooking,
  createBuffetBooking,
  createBuffetDinner,
  getDishById,
  getRemainingBuffetCapacity,
  updateBuffetBookingPayment,
  updateBuffetDinner,
} from "../../controllers/buffet";
import * as dishCatalog from "../../data/dishCatalog";
import {
  createBuffetBooking as createBuffetBookingFactory,
  createBuffetDinner as createBuffetDinnerFactory,
} from "../../test/helpers/factories";
import { createMockQuery } from "../../test/helpers/mock-queries";

jest.mock("../../models/buffetBooking", () => ({
  BuffetBooking: {
    aggregate: jest.fn(),
    exists: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock("../../models/buffetDinner", () => ({
  BuffetDinner: {
    findById: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
  },
}));

describe("buffet controller", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("getDishById returns catalog dish", async () => {
    jest
      .spyOn(dishCatalog, "getDishWithImageByCatalogId")
      .mockResolvedValue({ id: "dish-1", name: "Dish 1" } as any);

    await expect(getDishById("dish-1")).resolves.toEqual({
      id: "dish-1",
      name: "Dish 1",
    });
  });

  test("createBuffetDinner validates and creates dinner", async () => {
    jest.spyOn(dishCatalog, "validateDishSelection").mockReturnValue(["dish-1"]);

    const result = await createBuffetDinner({
      title: " Seafood Night ",
      cuisineCategory: " Seafood ",
      description: " Fresh ",
      imageUrl: " url ",
      startsAt: "2026-05-10T18:00:00.000Z",
      endsAt: "2026-05-10T21:00:00.000Z",
      includedDishes: ["dish-1"],
      facilities: [" Live Music ", " "],
      maxCapacity: 30,
      pricePerGuest: 20,
    });

    expect(BuffetDinner.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Seafood Night",
        cuisineCategory: "Seafood",
        facilities: ["Live Music"],
        active: true,
      }),
    );
    expect(result).toBe(true);
  });

  test("updateBuffetDinner rejects lower than reserved seats", async () => {
    const dinner = createBuffetDinnerFactory({
      _id: "507f1f77bcf86cd799439011",
      id: "507f1f77bcf86cd799439011",
      maxCapacity: 30,
    });
    (BuffetDinner.findById as jest.Mock).mockResolvedValue(dinner);
    (BuffetBooking.aggregate as jest.Mock).mockResolvedValue([
      { reservedSeats: 20 },
    ]);

    await expect(
      updateBuffetDinner("buffet-1", { maxCapacity: 10 }),
    ).rejects.toThrow("Maximum capacity cannot be lower than reserved seats.");
  });

  test("getRemainingBuffetCapacity subtracts reserved seats", async () => {
    (BuffetBooking.aggregate as jest.Mock).mockResolvedValue([
      { reservedSeats: 12 },
    ]);

    const result = await getRemainingBuffetCapacity(
      createBuffetDinnerFactory({
        _id: "507f1f77bcf86cd799439012",
        id: "507f1f77bcf86cd799439012",
        maxCapacity: 20,
      }),
    );

    expect(result).toBe(8);
  });

  test("createBuffetBooking calculates totals", async () => {
    const dinner = createBuffetDinnerFactory({
      _id: "507f1f77bcf86cd799439013",
      id: "507f1f77bcf86cd799439013",
      startsAt: new Date("2026-05-20T18:00:00.000Z"),
      pricePerGuest: 15,
      maxCapacity: 20,
    });
    (BuffetDinner.findById as jest.Mock).mockResolvedValue(dinner);
    (BuffetBooking.aggregate as jest.Mock).mockResolvedValue([{ reservedSeats: 5 }]);
    const booking = createBuffetBookingFactory();
    (BuffetBooking.create as jest.Mock).mockResolvedValue(booking);

    const result = await createBuffetBooking(
      {
        buffetDinner: "buffet-1",
        guestCount: 2,
        customer: { name: "Alice", email: "alice@example.com" },
      },
      "user-1",
    );

    expect(BuffetBooking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: { subtotal: 30, tax: 1.5, total: 31.5 },
        status: "pending",
      }),
    );
    expect(result).toBe(booking);
  });

  test("createBuffetBooking rejects when seats are insufficient", async () => {
    const dinner = createBuffetDinnerFactory({
      _id: "507f1f77bcf86cd799439014",
      id: "507f1f77bcf86cd799439014",
      startsAt: new Date("2026-05-20T18:00:00.000Z"),
      maxCapacity: 10,
    });
    (BuffetDinner.findById as jest.Mock).mockResolvedValue(dinner);
    (BuffetBooking.aggregate as jest.Mock).mockResolvedValue([{ reservedSeats: 9 }]);

    await expect(
      createBuffetBooking(
        {
          buffetDinner: "buffet-1",
          guestCount: 2,
          customer: { name: "Alice", email: "alice@example.com" },
        },
        "user-1",
      ),
    ).rejects.toThrow("Not enough buffet seats are available.");
  });

  test("updateBuffetBookingPayment confirms paid bookings", async () => {
    const booking = createBuffetBookingFactory();
    (BuffetBooking.findById as jest.Mock).mockResolvedValue(booking);

    const result = await updateBuffetBookingPayment(
      "buffet-booking-1",
      { paymentInfo: { status: "paid" } },
      { id: "user-1", role: ["user"] } as any,
    );

    expect(booking.status).toBe("confirmed");
    expect(booking.save).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test("cancelBuffetBooking cancels booking for owner", async () => {
    const booking = createBuffetBookingFactory({
      user: { toString: () => "user-1" },
    });
    (BuffetBooking.findById as jest.Mock).mockResolvedValue(booking);

    const result = await cancelBuffetBooking(
      "buffet-booking-1",
      "Change of plan",
      { id: "user-1", role: ["user"] } as any,
    );

    expect(booking.status).toBe("cancelled");
    expect(booking.save).toHaveBeenCalled();
    expect(result).toBe(booking);
  });
});
