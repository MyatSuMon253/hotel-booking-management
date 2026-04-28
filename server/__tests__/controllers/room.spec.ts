import Room from "../../models/room";
import {
  createNewRoom,
  deleteRoom,
  deleteRoomImage,
  getAllRooms,
  getRoomById,
  updateRoom,
} from "../../controllers/room";
import { deleteImage, uploadMultipleImages } from "../../utils/cloudinary";
import { createRoom } from "../../test/helpers/factories";
import { createMockQuery } from "../../test/helpers/mock-queries";

jest.mock("../../models/room", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.mock("../../utils/cloudinary", () => ({
  uploadMultipleImages: jest.fn(),
  deleteImage: jest.fn(),
}));

describe("room controller", () => {
  test("getAllRooms returns rooms with pagination metadata", async () => {
    const rooms = [createRoom(), createRoom({ _id: "room-2", id: "room-2" })];
    const query = createMockQuery(rooms) as any;
    query.find = jest.fn().mockReturnValue(query);
    query.clone = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(rooms),
    });
    (Room.find as jest.Mock).mockReturnValue(query);

    const result = await getAllRooms("suite", { pricePerNight: { gte: 10 } }, 2);

    expect(query.limit).toHaveBeenCalledWith(5);
    expect(query.skip).toHaveBeenCalledWith(5);
    expect(result).toEqual({
      rooms,
      pagination: { totalRoomCount: 2, perPage: 5 },
    });
  });

  test("createNewRoom maps uploaded images", async () => {
    (uploadMultipleImages as jest.Mock).mockResolvedValue([
      { img_url: "https://example.com/1.jpg", public_id: "img-1" },
    ]);
    const room = createRoom();
    (Room.create as jest.Mock).mockResolvedValue(room);

    const result = await createNewRoom({ images: ["raw-image"] } as any);

    expect(Room.create).toHaveBeenCalledWith(
      expect.objectContaining({
        images: [{ url: "https://example.com/1.jpg", public_id: "img-1" }],
      }),
    );
    expect(result).toBe(room);
  });

  test("createNewRoom rolls back uploaded images on failure", async () => {
    (uploadMultipleImages as jest.Mock).mockResolvedValue([
      { img_url: "https://example.com/1.jpg", public_id: "img-1" },
    ]);
    (Room.create as jest.Mock).mockRejectedValue(new Error("create failed"));
    (deleteImage as jest.Mock).mockResolvedValue(true);

    await expect(createNewRoom({ images: ["raw-image"] } as any)).rejects.toThrow(
      "create failed",
    );
    expect(deleteImage).toHaveBeenCalledWith("img-1");
  });

  test("getRoomById throws for missing room", async () => {
    const query = createMockQuery(null);
    (Room.findById as jest.Mock).mockReturnValue(query);

    await expect(getRoomById("room-1")).rejects.toThrow("Room not found.");
  });

  test("updateRoom appends uploaded images", async () => {
    const room = createRoom();
    (Room.findById as jest.Mock).mockResolvedValue(room);
    (uploadMultipleImages as jest.Mock).mockResolvedValue([
      { img_url: "https://example.com/2.jpg", public_id: "img-2" },
    ]);

    const result = await updateRoom("room-1", { images: ["raw-image"] } as any);

    expect(room.set).toHaveBeenCalledWith(
      expect.objectContaining({
        images: [
          { url: "https://example.com/1.jpg", public_id: "img-1" },
          { url: "https://example.com/2.jpg", public_id: "img-2" },
        ],
      }),
    );
    expect(room.save).toHaveBeenCalled();
    expect(result).toBe("Room is updated.");
  });

  test("deleteRoomImage removes image from room", async () => {
    (Room.findById as jest.Mock).mockResolvedValue(createRoom());
    (deleteImage as jest.Mock).mockResolvedValue(true);

    await expect(deleteRoomImage("room-1", "img-1")).resolves.toBe(true);
    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith("room-1", {
      $pull: { images: { public_id: "img-1" } },
    });
  });

  test("deleteRoom removes images and room record", async () => {
    const room = createRoom({
      images: [
        { url: "https://example.com/1.jpg", public_id: "img-1" },
        { url: "https://example.com/2.jpg", public_id: "img-2" },
      ],
    });
    (Room.findById as jest.Mock).mockResolvedValue(room);
    (deleteImage as jest.Mock).mockResolvedValue(true);

    const result = await deleteRoom("room-1");

    expect(room.deleteOne).toHaveBeenCalled();
    expect(result).toBe("Room is destory!");
  });
});
