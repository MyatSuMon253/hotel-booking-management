import { createNewRoom, getAllRooms } from "../../controllers/room";
import { Room as RoomType } from "../../types/room";

export const roomResolvers = {
  Query: {
    getAllRooms: async () => await getAllRooms()
  },
  Mutation: {
    createNewRoom: async (_: any, { roomInput }: { roomInput: RoomType }) => await createNewRoom(roomInput)
  }
}