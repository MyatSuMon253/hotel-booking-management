import { createAndUpdateReview } from "../../controllers/review";
import { ReviewInput } from "../../types/review";
import { IUser } from "../../types/user";

export const reviewResolvers = {
  Query: {},
  Mutation: {
    createAndUpdateReview: async (
      _: any,
      { reviewInput }: { reviewInput: ReviewInput },
      { user }: { user: IUser },
    ) => createAndUpdateReview(reviewInput, user?.id),
  },
};
