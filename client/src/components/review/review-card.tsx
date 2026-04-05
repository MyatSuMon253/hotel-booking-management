import { CREATE_AND_UPDATE_REVIEW_MUTATION } from "@/graphql/mutations/review";
import { reviewSchema } from "@/schema/review";
import type { IReview } from "@/types/review";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Card, CardContent } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import StarRatings from "react-star-ratings";
import { Button } from "../ui/button";

interface Props {
  review: IReview | null;
  roomId: string;
  refetch: () => void;
}

function ReviewCard({ review, roomId, refetch }: Props) {
  const [createAndUpdateReview, { loading }] = useMutation(
    CREATE_AND_UPDATE_REVIEW_MUTATION,
    {
      onCompleted() {
        toast.success("Review added successfully.");
      },
    },
  );

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: review?.rating ?? 0,
      comment: review?.comment ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof reviewSchema>) {
    const rating = values.rating;
    const comment = values.comment;
    try {
      await createAndUpdateReview({
        variables: {
          reviewInput: { rating, comment, roomId },
        },
      });
      form.reset();
      refetch();
    } catch (err: any) {
      console.log(err.message);
      toast.error(
        err.message.includes(":") ? err.message.split(":")[1] : err.message,
      );
    }
  }
  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your rating</FormLabel>
                  <FormControl>
                    <StarRatings
                      rating={field.value}
                      starRatedColor="orange"
                      changeRating={field.onChange}
                      numberOfStars={5}
                      name="rating"
                      starDimension="26px"
                      starSpacing="2px"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "..." : review ? "update review" : "post review"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ReviewCard;
