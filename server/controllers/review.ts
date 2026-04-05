import errorHandler from "../middlewares/errorHandler";
import { Review } from "../models/review";
import Room from "../models/room";
import { ReviewInput } from "../types/review";

export const createAndUpdateReview = errorHandler(
  async (reviewInput: ReviewInput, userId: string) => {
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
