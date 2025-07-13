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

export const updateRoom = async (roomId: string, roomInput: RoomType) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  await room.set(roomInput).save();

  return "Room is updated successfully";
}

export const deleteRoom = async (roomId: string) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  await room.deleteOne();

  return "Room is deleted successfully";
}