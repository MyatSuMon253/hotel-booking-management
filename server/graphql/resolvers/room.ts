import {
  createNewRoom,
  deleteRoom,
  deleteRoomImage,
  getAllRooms,
  getRoomById,
  updateRoom,
} from "../../controllers/room";
import { RoomFilters, Room as RoomType } from "../../types/room";

export const roomResolvers = {
  Query: {
    getAllRooms: async (
      _: any,
      {
        query,
        filters,
        page,
      }: { query: string; filters: RoomFilters; page: number },
    ) => await getAllRooms(query, filters, page),
    getRoomById: async (_: any, { roomId }: { roomId: string }) =>
      await getRoomById(roomId),
  },
  Mutation: {
    createNewRoom: async (_: any, { roomInput }: { roomInput: RoomType }) =>
      await createNewRoom(roomInput),
    updateRoom: async (
      _: any,
      { roomId, roomInput }: { roomId: string; roomInput: RoomType },
    ) => await updateRoom(roomId, roomInput),
    deleteRoom: async (_: any, { roomId }: { roomId: string }) =>
      await deleteRoom(roomId),
    deleteRoomImage: async (
      _: any,
      { roomId, imageId }: { roomId: string; imageId: string },
    ) => await deleteRoomImage(roomId, imageId),
  },
};
