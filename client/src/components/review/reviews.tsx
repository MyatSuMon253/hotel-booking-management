import { userInfoVar } from "@/apollo/apollo-vars";
import { useReactiveVar } from "@apollo/client";
import ReviewCard from "./review-card";
import { CardContent } from "../ui/card";
import StarRatings from "react-star-ratings";
import type { IReview } from "@/types/review";

interface Props {
  roomId: string;
  reviews: IReview[];
  canReview: boolean;
  refetch: () => void;
}

function Reviews({ roomId, reviews, canReview, refetch }: Props) {
  const user = useReactiveVar(userInfoVar);
  const myReview = null;

  return (
    <div>
      {!user && (
        <CardContent className="border border-red-500 bg-red-200 py-4 text-sm mt-4 rounded-md">
          <h2 className="text-red-600">You need to login first.</h2>
        </CardContent>
      )}
      {!canReview && user && (
        <CardContent className="border border-red-500 bg-red-200 py-4 text-sm mt-4 rounded-md">
          <h2 className="text-red-600">You need to paid this room first.</h2>
        </CardContent>
      )} 
      {user && canReview && (
        <div>
          <p className="text-sm my-2">
            Drop your thought about this room below
          </p>
          <ReviewCard review={myReview} roomId={roomId} refetch={refetch} />
        </div>
      )}
      {reviews?.length > 0 && (
        <div className="space-y-6 mt-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 shadow-sm p-4 rounded-md "
            >
              <h2 className="text-lg font-medium">{review.user.name}</h2>
              <StarRatings
                rating={review.rating}
                starRatedColor="orange"
                numberOfStars={5}
                starDimension="20px"
                starSpacing="2px"
              />
              <p className="text-sm text-gray-500 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reviews;
