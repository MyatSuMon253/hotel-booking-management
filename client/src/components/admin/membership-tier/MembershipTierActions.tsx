import { useMutation } from "@apollo/client";
import { Link } from "react-router";
import { toast } from "sonner";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { DELETE_MEMBERSHIP_TIER } from "@/graphql/mutations/membership-tier";
import { GET_ALL_MEMBERSHIP_TIERS } from "@/graphql/queries/membership-tier";
import type { MembershipTier } from "@/types/membership-tier";

interface MembershipTierActionsProps {
  membershipTier: MembershipTier;
}

function MembershipTierActions({
  membershipTier,
}: MembershipTierActionsProps) {
  const [deleteMembershipTier, { loading }] = useMutation(
    DELETE_MEMBERSHIP_TIER,
    {
      onCompleted: () => {
        toast.success("Membership tier removed.");
      },
      onError: () => {
        toast.error("Unable to delete membership tier.");
      },
      refetchQueries: [{ query: GET_ALL_MEMBERSHIP_TIERS }],
      awaitRefetchQueries: true,
    },
  );

  return (
    <div className="space-x-3">
      <Button size="sm" variant="outline" asChild>
        <Link to={`/admin/membership-tiers/edit/${membershipTier.id}`}>
          Edit
        </Link>
      </Button>
      <ConfirmDialog
        title={`Delete "${membershipTier.name}"?`}
        description="This removes the membership tier discount. This cannot be undone."
        confirmLabel="Delete tier"
        pendingLabel="Deleting..."
        loading={loading}
        onConfirm={async () => {
          await deleteMembershipTier({
            variables: { membershipTierId: membershipTier.id },
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

export default MembershipTierActions;
