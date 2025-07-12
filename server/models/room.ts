import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, "Please enter room number."],
  },
  type: {
    type: String,
    required: [true, "Please enter room type."],
  },
  pricePerNight: {
    type: Number,
    required: [true, "Please enter price per night."],
  },
  capacity: {
    type: Number,
    required: [true, "Please enter room capacity."],
  },
  isAvailable: {
    type: Boolean,
    required: [true, "Please enter room availability."],
    default: true,
  },
  images: {
    type: [{
      url: String,
      public_id: String,
    }],
  },
  reviews: {
    type: [String],
  },
}, {
  timestamps: true
})

const Room = mongoose.model("Room", roomSchema);

export default Room;