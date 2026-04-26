import {
  cancelBuffetBooking,
  createBuffetBooking,
  createBuffetDinner,
  deleteBuffetDinner,
  getAllBuffetBookings,
  getAllBuffetDinners,
  getAllDishes,
  getAvailableBuffetDinners,
  getBuffetBookingById,
  getBuffetBookingsByUser,
  getBuffetDinnerById,
  getDishById,
  getRemainingBuffetCapacity,
  updateBuffetBookingPayment,
  updateBuffetDinner,
} from "../../controllers/buffet";
import { getDishesByCatalogIds } from "../../data/dishCatalog";
import { BuffetDinner } from "../../models/buffetDinner";
import { IUser } from "../../types/user";

export const buffetResolvers = {
  BuffetDinner: {
    remainingCapacity: async (parent: any) =>
      getRemainingBuffetCapacity(parent),
    includedDishes: async (parent: any) => {
      if (!Array.isArray(parent.includedDishes)) {
        return [];
      }

      if (parent.includedDishes[0]?.name) {
        return parent.includedDishes;
      }

      return getDishesByCatalogIds(parent.includedDishes);
    },
  },
  BuffetBooking: {
    buffetDinner: async (parent: any) => {
      if (parent.buffetDinner?.title) {
        return parent.buffetDinner;
      }

      return BuffetDinner.findById(parent.buffetDinner);
    },
  },
  Query: {
    getAllDishes: async () => getAllDishes(),
    getDishById: async (_: any, { dishId }: { dishId: string }) =>
      getDishById(dishId),
    getAllBuffetDinners: async () => getAllBuffetDinners(),
    getAvailableBuffetDinners: async () => getAvailableBuffetDinners(),
    getBuffetDinnerById: async (
      _: any,
      { buffetDinnerId }: { buffetDinnerId: string },
    ) => getBuffetDinnerById(buffetDinnerId),
    getAllBuffetBookings: async () => getAllBuffetBookings(),
    getBuffetBookingById: async (
      _: any,
      { buffetBookingId }: { buffetBookingId: string },
      { user }: { user: IUser },
    ) => getBuffetBookingById(buffetBookingId, user),
    getBuffetBookingsByUser: async (
      _parent: any,
      _args: any,
      { user }: { user: IUser },
    ) => getBuffetBookingsByUser(user.id),
  },
  Mutation: {
    createBuffetDinner: async (
      _: any,
      { buffetDinnerInput }: { buffetDinnerInput: any },
    ) => createBuffetDinner(buffetDinnerInput),
    updateBuffetDinner: async (
      _: any,
      {
        buffetDinnerId,
        buffetDinnerInput,
      }: { buffetDinnerId: string; buffetDinnerInput: any },
    ) => updateBuffetDinner(buffetDinnerId, buffetDinnerInput),
    deleteBuffetDinner: async (
      _: any,
      { buffetDinnerId }: { buffetDinnerId: string },
    ) => deleteBuffetDinner(buffetDinnerId),
    createBuffetBooking: async (
      _: any,
      { bookingInput }: { bookingInput: any },
      { user }: { user: IUser },
    ) => createBuffetBooking(bookingInput, user._id),
    updateBuffetBookingPayment: async (
      _: any,
      {
        buffetBookingId,
        bookingInput,
      }: { buffetBookingId: string; bookingInput: any },
      { user }: { user: IUser },
    ) => updateBuffetBookingPayment(buffetBookingId, bookingInput, user),
    cancelBuffetBooking: async (
      _: any,
      { buffetBookingId, reason }: { buffetBookingId: string; reason?: string },
      { user }: { user: IUser },
    ) => cancelBuffetBooking(buffetBookingId, reason, user),
  },
};
