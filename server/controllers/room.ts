import APIFilters from "../utils/apiFilters";
import errorHandler from "../middlewares/errorHandler";
import Room from "../models/room";
import { RoomFilters, RoomInput, Room as RoomType } from "../types/room";
import { NotFoundError } from "../utils/not-found";
import { deleteImage, uploadMultipleImages } from "../utils/cloudinary";

export const getAllRooms = errorHandler(
  async (query: string, filters: RoomFilters, page: number) => {
    const perPage = 5;
    const apiFilters = new APIFilters(Room).search(query).filters(filters);

    let rooms = await apiFilters.model;
    const totalRoomCount = rooms.length;

    apiFilters.pagination(page, perPage);
    rooms = await apiFilters.model.clone();

    if (!rooms) {
      throw new NotFoundError("Rooms not found");
    }

    return { rooms, pagination: { totalRoomCount, perPage } };
  },
);

export const createNewRoom = errorHandler(async (roomInput: RoomInput) => {
  let uploadedImageUrls: { img_url: string; public_id: string }[] = [];

  try {
    uploadedImageUrls = await uploadMultipleImages(
      roomInput.images,
      "golden-compass/rooms",
    );
    const newRoom = await Room.create({
      ...roomInput,
      images: uploadedImageUrls.map((img) => {
        return {
          url: img.img_url,
          public_id: img.public_id,
        };
      }),
    });
    return newRoom;
  } catch (error) {
    if (uploadedImageUrls.length > 0) {
      const deletedPromises = uploadedImageUrls.map((img) => {
        return deleteImage(img.public_id);
      });

      await Promise.all(deletedPromises);
    }
    throw error;
  }
});

export const getRoomById = errorHandler(async (roomId: string) => {
  const room = await Room.findById(roomId).populate({
    path: "reviews",
    populate: {
      path: "user",
      model: "User",
    },
  });

  if (!room) {
    throw new NotFoundError("Room not found.");
  }
  return room;
});

export const updateRoom = errorHandler(
  async (roomId: string, roomInput: RoomInput) => {
    const room = await Room.findById(roomId);

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    let uploadedImageUrls: { img_url: string; public_id: string }[] = [];

    if (roomInput.images?.length > 0) {
      uploadedImageUrls = await uploadMultipleImages(
        roomInput.images,
        "golden-compass/rooms",
      );
    }

    await room
      .set({
        ...roomInput,
        images:
          uploadedImageUrls.length > 0
            ? [
                ...room.images,
                ...uploadedImageUrls.map((img) => ({
                  url: img.img_url,
                  public_id: img.public_id,
                })),
              ]
            : room.images,
      })
      .save();
    return "Room is updated.";
  },
);

export const deleteRoomImage = errorHandler(
  async (roomId: string, imageId: string) => {
    const room = await Room.findById(roomId);

    if (!room) {
      throw new Error("Room not found");
    }

    const isDeleted = await deleteImage(imageId);
    if (isDeleted) {
      await Room.findByIdAndUpdate(roomId, {
        $pull: {
          images: {
            public_id: imageId,
          },
        },
      });

      return true;
    } else {
      throw new Error("Image not deleted");
    }
  },
);

export const deleteRoom = errorHandler(async (roomId: string) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new NotFoundError("Room not found.");
  }

  if (room?.images?.length > 0) {
    room?.images.forEach(async (img) => {
      await deleteImage(img.public_id!);
    });
  }

  await room.deleteOne();
  return "Room is destory!";
});
