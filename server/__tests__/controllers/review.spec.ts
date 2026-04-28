import { Booking } from "../../models/booking";
import { Review } from "../../models/review";
import Room from "../../models/room";
import {
  canReview,
  createAndUpdateReview,
  deleteReviewById,
} from "../../controllers/review";
import { createReview } from "../../test/helpers/factories";

jest.mock("../../models/booking", () => ({
  Booking: { findOne: jest.fn() },
}));

jest.mock("../../models/review", () => ({
  Review: {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock("../../models/room", () => ({
  __esModule: true,
  default: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("review controller", () => {
  test("canReview returns true for paid booking", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValue({ _id: "booking-1" });

    await expect(canReview("room-1", "user-1")).resolves.toBe(true);
  });

  test("createAndUpdateReview updates existing review", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValue({ _id: "booking-1" });
    (Review.findOne as jest.Mock).mockResolvedValue(createReview());
    const updated = createReview({ comment: "Updated" });
    (Review.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);

    const result = await createAndUpdateReview(
      { roomId: "room-1", rating: 5, comment: "Updated" } as any,
      "user-1",
    );

    expect(Review.findByIdAndUpdate).toHaveBeenCalled();
    expect(result).toBe(updated);
  });

  test("createAndUpdateReview creates and pushes new review", async () => {
    (Booking.findOne as jest.Mock).mockResolvedValue({ _id: "booking-1" });
    (Review.findOne as jest.Mock).mockResolvedValue(null);
    const review = createReview();
    (Review.create as jest.Mock).mockResolvedValue(review);

    const result = await createAndUpdateReview(
      { roomId: "room-1", rating: 4, comment: "Nice" } as any,
      "user-1",
    );

    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith("room-1", {
      $push: { reviews: "review-1" },
    });
    expect(result).toBe(review);
  });

  test("deleteReviewById removes review and room reference", async () => {
    const review = createReview();
    (Review.findById as jest.Mock).mockResolvedValue(review);

    await expect(deleteReviewById("review-1")).resolves.toBe(true);
    expect(Room.findByIdAndUpdate).toHaveBeenCalledWith("room-1", {
      $pull: { reviews: "review-1" },
    });
    expect(Review.findByIdAndDelete).toHaveBeenCalledWith("review-1");
  });
});
