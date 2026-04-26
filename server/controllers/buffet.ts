import errorHandler from "../middlewares/errorHandler";
import mongoose from "mongoose";
import {
  getDishByCatalogId,
  getDishCatalog,
  validateDishSelection,
} from "../data/dishCatalog";
import { BuffetBooking } from "../models/buffetBooking";
import { BuffetDinner } from "../models/buffetDinner";
import { IUser } from "../types/user";
import { NotFoundError } from "../utils/not-found";

const TAX_PERCENT = 0.05;

const normalizeText = (value?: string) => value?.trim() ?? "";

const cleanFacilities = (facilities?: string[]) => {
  return (facilities ?? [])
    .map((facility) => facility.trim())
    .filter((facility) => facility.length > 0);
};

export const getReservedBuffetSeats = async (buffetDinnerId: string) => {
  const result = await BuffetBooking.aggregate([
    {
      $match: {
        buffetDinner: new mongoose.Types.ObjectId(buffetDinnerId),
        status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: "$buffetDinner",
        reservedSeats: { $sum: "$guestCount" },
      },
    },
  ]);

  return result[0]?.reservedSeats ?? 0;
};

export const getRemainingBuffetCapacity = async (buffetDinner: any) => {
  const reservedSeats = await getReservedBuffetSeats(
    buffetDinner._id ?? buffetDinner.id,
  );
  return Math.max((buffetDinner.maxCapacity ?? 0) - reservedSeats, 0);
};

export const getAllDishes = errorHandler(async () => {
  return getDishCatalog();
});

export const getDishById = errorHandler(async (dishId: string) => {
  const dish = getDishByCatalogId(dishId);
  if (!dish) {
    throw new NotFoundError("Dish not found");
  }
  return dish;
});

const buildBuffetDinnerInput = (buffetDinnerInput: any) => ({
  ...buffetDinnerInput,
  title:
    buffetDinnerInput.title !== undefined
      ? normalizeText(buffetDinnerInput.title)
      : undefined,
  cuisineCategory:
    buffetDinnerInput.cuisineCategory !== undefined
      ? normalizeText(buffetDinnerInput.cuisineCategory)
      : undefined,
  description:
    buffetDinnerInput.description !== undefined
      ? normalizeText(buffetDinnerInput.description)
      : undefined,
  startsAt:
    buffetDinnerInput.startsAt !== undefined
      ? new Date(buffetDinnerInput.startsAt)
      : undefined,
  endsAt:
    buffetDinnerInput.endsAt !== undefined
      ? new Date(buffetDinnerInput.endsAt)
      : undefined,
  facilities:
    buffetDinnerInput.facilities !== undefined
      ? cleanFacilities(buffetDinnerInput.facilities)
      : undefined,
});

const validateBuffetDinnerTime = (startsAt?: Date, endsAt?: Date) => {
  if (startsAt && endsAt && startsAt >= endsAt) {
    throw new Error("Buffet dinner end time must be after start time.");
  }
};

export const getAllBuffetDinners = errorHandler(async () => {
  return BuffetDinner.find().sort({ startsAt: -1 });
});

export const getAvailableBuffetDinners = errorHandler(async () => {
  return BuffetDinner.find({
    active: true,
    startsAt: { $gte: new Date() },
  }).sort({ startsAt: 1 });
});

export const getBuffetDinnerById = errorHandler(
  async (buffetDinnerId: string) => {
    const buffetDinner = await BuffetDinner.findById(buffetDinnerId);
    if (!buffetDinner) {
      throw new NotFoundError("Buffet dinner not found");
    }
    return buffetDinner;
  },
);

export const createBuffetDinner = errorHandler(
  async (buffetDinnerInput: any) => {
    const input = buildBuffetDinnerInput(buffetDinnerInput);
    validateBuffetDinnerTime(input.startsAt, input.endsAt);
    input.includedDishes = validateDishSelection({
      dishIds: input.includedDishes ?? [],
      cuisineCategory: input.cuisineCategory,
    });

    await BuffetDinner.create({
      ...input,
      active: buffetDinnerInput.active ?? true,
    });
    return true;
  },
);

export const updateBuffetDinner = errorHandler(
  async (buffetDinnerId: string, buffetDinnerInput: any) => {
    const buffetDinner = await BuffetDinner.findById(buffetDinnerId);
    if (!buffetDinner) {
      throw new NotFoundError("Buffet dinner not found");
    }

    const input = buildBuffetDinnerInput(buffetDinnerInput);
    const cuisineCategory = input.cuisineCategory ?? buffetDinner.cuisineCategory;
    validateBuffetDinnerTime(
      input.startsAt ?? buffetDinner.startsAt,
      input.endsAt ?? buffetDinner.endsAt,
    );

    if (input.includedDishes !== undefined || input.cuisineCategory !== undefined) {
      input.includedDishes = validateDishSelection({
        dishIds: input.includedDishes ?? buffetDinner.includedDishes,
        cuisineCategory,
      });
    }

    const maxCapacity = input.maxCapacity ?? buffetDinner.maxCapacity;
    const reservedSeats = await getReservedBuffetSeats(buffetDinner.id);
    if (maxCapacity < reservedSeats) {
      throw new Error("Maximum capacity cannot be lower than reserved seats.");
    }

    buffetDinner.set(input);
    await buffetDinner.save();
    return true;
  },
);

export const deleteBuffetDinner = errorHandler(
  async (buffetDinnerId: string) => {
    const hasBookings = await BuffetBooking.exists({ buffetDinner: buffetDinnerId });
    if (hasBookings) {
      throw new Error("Cannot delete a buffet dinner that has bookings.");
    }

    const buffetDinner = await BuffetDinner.findByIdAndDelete(buffetDinnerId);
    if (!buffetDinner) {
      throw new NotFoundError("Buffet dinner not found");
    }

    return true;
  },
);

export const createBuffetBooking = errorHandler(
  async (bookingInput: any, userId: string) => {
    const buffetDinner = await BuffetDinner.findById(
      bookingInput.buffetDinner,
    );
    if (!buffetDinner) {
      throw new NotFoundError("Buffet dinner not found");
    }

    if (!buffetDinner.active || buffetDinner.startsAt < new Date()) {
      throw new Error("This buffet dinner is no longer available.");
    }

    const guestCount = Number(bookingInput.guestCount);
    const remainingCapacity = await getRemainingBuffetCapacity(buffetDinner);
    if (guestCount > remainingCapacity) {
      throw new Error("Not enough buffet seats are available.");
    }

    const subtotal = buffetDinner.pricePerGuest * guestCount;
    const tax = subtotal * TAX_PERCENT;
    const total = subtotal + tax;

    return BuffetBooking.create({
      buffetDinner: buffetDinner.id,
      user: userId,
      customer: bookingInput.customer,
      guestCount,
      pricePerGuest: buffetDinner.pricePerGuest,
      amount: {
        subtotal,
        tax,
        total,
      },
      additionalNote: bookingInput.additionalNote,
      paymentInfo: {
        status: "pending",
      },
      status: "pending",
    });
  },
);

export const getAllBuffetBookings = errorHandler(async () => {
  return BuffetBooking.find()
    .populate("buffetDinner")
    .populate("user")
    .sort({ createdAt: -1 });
});

export const getBuffetBookingById = errorHandler(
  async (buffetBookingId: string, user: IUser) => {
    const booking = await BuffetBooking.findById(buffetBookingId)
      .populate("buffetDinner")
      .populate("user");

    if (!booking) {
      throw new NotFoundError("Buffet booking not found");
    }

    if (!user.role?.includes("admin") && booking.user._id.toString() !== user.id) {
      throw new Error("You do not have permission to view this buffet booking.");
    }

    return booking;
  },
);

export const getBuffetBookingsByUser = errorHandler(async (userId: string) => {
  return BuffetBooking.find({ user: userId })
    .populate("buffetDinner")
    .sort({ createdAt: -1 });
});

export const updateBuffetBookingPayment = errorHandler(
  async (buffetBookingId: string, bookingInput: any, user: IUser) => {
    const booking = await BuffetBooking.findById(buffetBookingId);

    if (!booking) {
      throw new NotFoundError("Buffet booking not found");
    }

    if (!user.role?.includes("admin") && booking.user.toString() !== user.id) {
      throw new Error("You do not have permission to update this buffet booking.");
    }

    booking.set(bookingInput);

    if (booking.paymentInfo?.status === "paid") {
      booking.paymentInfo.status = "paid";
      booking.status = "confirmed";
    }

    await booking.save();
    return true;
  },
);

export const cancelBuffetBooking = errorHandler(
  async (buffetBookingId: string, reason: string | undefined, user: IUser) => {
    const booking = await BuffetBooking.findById(buffetBookingId);

    if (!booking) {
      throw new NotFoundError("Buffet booking not found");
    }

    const isAdmin = user.role?.includes("admin");
    const isOwner = booking.user.toString() === user.id;

    if (!isAdmin && !isOwner) {
      throw new Error("You do not have permission to cancel this buffet booking.");
    }

    if (booking.status === "cancelled") {
      throw new Error("Buffet booking is already cancelled.");
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    if (reason) booking.cancelReason = reason;

    await booking.save();
    return booking;
  },
);
