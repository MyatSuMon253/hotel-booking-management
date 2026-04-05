import errorHandler from "../middlewares/errorHandler";
import { Booking } from "../models/booking";
import { Review } from "../models/review";
import Room from "../models/room";
import { ReviewInput } from "../types/review";

export const createAndUpdateReview = errorHandler(
  async (reviewInput: ReviewInput, userId: string) => {
    const isUserCanReview = await canReview(reviewInput.roomId, userId);

    if (!isUserCanReview) {
      throw new Error("This user can't review this room.");
    }

    const isReviewed = await Review.findOne({
      user: userId,
      room: reviewInput.roomId,
    });

    if (isReviewed) {
      const review = await Review.findByIdAndUpdate(
        isReviewed?._id,
        reviewInput,
        { new: true },
      );
      return review;
    } else {
      const review = await Review.create({
        ...reviewInput,
        user: userId,
        room: reviewInput.roomId,
      });

      await Room.findByIdAndUpdate(reviewInput.roomId, {
        $push: { reviews: review?._id },
      });
      return review;
    }
  },
);

export const canReview = errorHandler(
  async (roomId: string, userId: string) => {
    const booking = await Booking.findOne({
      room: roomId,
      user: userId,
      "paymentInfo.status": "paid",
    });

    return !!booking;
  },
);
