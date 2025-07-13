import mongoose from "mongoose";
import Room from "../models/room";
import { rooms } from "./data";

const seedRooms = async () => {
  try {
    await mongoose.connect("mongodb+srv://myatsumon2531999:lAFveQNC2VSCVnBg@cluster0.r822czp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

    await Room.deleteMany();
    console.log('Rooms are deleted');

    await Room.insertMany(rooms);
    console.log('Rooms are added');

    process.exit()
  } catch (error) {
    console.log(error)
    process.exit()
  }
}

seedRooms();