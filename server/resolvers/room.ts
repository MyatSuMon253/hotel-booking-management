import { getAllRooms } from "../controllers/room";

export const roomResolvers = {
  Query: {
    getAllRooms: async () => await getAllRooms()
  }
}