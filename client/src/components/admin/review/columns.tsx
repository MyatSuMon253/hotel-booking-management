import { Button } from "@/components/ui/button";
import { DELETE_REVIEW_BY_ID_MUTATION } from "@/graphql/mutations/review";
import { GET_ALL_REVIEWS } from "@/graphql/queries/review";
import type { IReview } from "@/types/review";
import { useMutation } from "@apollo/client";
import type { ColumnDef } from "@tanstack/react-table";
import StarRatings from "react-star-ratings";
import { toast } from "sonner";

export const columns: ColumnDef<IReview>[] = [
  {
    accessorKey: "roomTitle",
    header: "Room",
    cell: ({ row }) => (
      <p className="font-medium">{row.getValue("roomTitle")}</p>
    ),
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => (
      <p className="text-sm font-medium text-gray-500">
        {row.original.comment}
      </p>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <StarRatings
        rating={row.original.rating}
        starRatedColor="orange"
        numberOfStars={5}
        name="rating"
        starDimension="18px"
        starSpacing="1px"
      />
    ),
  },
  {
    id: "actions",
    header: "Manage",
    cell: ({ row }) => {
      const [deleteReview, { loading }] = useMutation(
        DELETE_REVIEW_BY_ID_MUTATION,
        {
          onCompleted: () => {
            toast.success("Review deleted.");
          },
          refetchQueries: [GET_ALL_REVIEWS],
        },
      );

      const handleDeleteReview = async (id: string) => {
        console.log(id);

        await deleteReview({
          variables: {
            reviewId: id,
          },
        });
      };

      return (
        <Button
          size={"sm"}
          variant={"destructive"}
          onClick={() => handleDeleteReview(row.original.id)}
          disabled={loading}
        >
          Delete
        </Button>
      );
    },
  },
];
