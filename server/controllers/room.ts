import Room from "../models/room";
import { Room as RoomType } from "../types/room";

export const getAllRooms = async () => {
  const rooms = await Room.find();
  return rooms
}

export const createNewRoom = async (roomInput: RoomType) => {
  const newRoom = await Room.create(roomInput)
  return newRoom;
}

export const getRoomById = async (roomId: string) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  return room;
}