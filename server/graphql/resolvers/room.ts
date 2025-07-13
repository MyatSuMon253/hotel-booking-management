import { createNewRoom, getAllRooms, getRoomById, updateRoom } from "../../controllers/room";
import { Room as RoomType } from "../../types/room";

export const roomResolvers = {
  Query: {
    getAllRooms: async () => await getAllRooms(),
    getRoomById: async (_: any, { roomId }: { roomId: string }) => await getRoomById(roomId)
  },
  Mutation: {
    createNewRoom: async (_: any, { roomInput }: { roomInput: RoomType }) => await createNewRoom(roomInput),
    updateRoom: async (_: any, { roomId, roomInput }: { roomId: string, roomInput: RoomType }) => await updateRoom(roomId, roomInput)
  }
}