import Room from "../models/room"
import { Room as RoomType } from "../types/room"

export const getAllRooms = () => {
  return "Hello GraphQL from controller"
}

export const createNewRoom = async (roomInput: RoomType) => {
  const newRoom = await Room.create(roomInput)
  return newRoom;
}