import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
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
          onError: (err) => toast.error(err.message),
          refetchQueries: [GET_ALL_REVIEWS],
        },
      );

      return (
        <ConfirmDialog
          title="Delete this review?"
          description="The review will be removed from the room permanently. This cannot be undone."
          confirmLabel="Delete review"
          pendingLabel="Deleting..."
          loading={loading}
          onConfirm={async () => {
            await deleteReview({ variables: { reviewId: row.original.id } });
          }}
          trigger={
            <Button size={"sm"} variant={"destructive"} disabled={loading}>
              Delete
            </Button>
          }
        />
      );
    },
  },
];
