import { useMutation } from "@apollo/client";
import { Link } from "react-router";
import { toast } from "sonner";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { DELETE_PROMOTION } from "@/graphql/mutations/promotion";
import { GET_ALL_PROMOTIONS } from "@/graphql/queries/promotion";
import type { Promotion } from "@/types/promotion";

interface PromotionActionsProps {
  promotion: Promotion;
}

function PromotionActions({ promotion }: PromotionActionsProps) {
  const [deletePromotion, { loading }] = useMutation(DELETE_PROMOTION, {
    onCompleted: () => {
      toast.success("Promotion removed.");
    },
    onError: () => {
      toast.error("Unable to delete promotion.");
    },
    refetchQueries: [{ query: GET_ALL_PROMOTIONS }],
    awaitRefetchQueries: true,
  });

  return (
    <div className="space-x-3">
      <Button size="sm" variant="outline" asChild>
        <Link to={`/admin/promotions/edit/${promotion.id}`}>Edit</Link>
      </Button>
      <ConfirmDialog
        title={`Delete "${promotion.code}"?`}
        description="This removes the promotion code. This cannot be undone."
        confirmLabel="Delete promotion"
        pendingLabel="Deleting..."
        loading={loading}
        onConfirm={async () => {
          await deletePromotion({
            variables: { promotionId: promotion.id },
          });
        }}
        trigger={
          <Button size="sm" variant="destructive" disabled={loading}>
            Delete
          </Button>
        }
      />
    </div>
  );
}

export default PromotionActions;
