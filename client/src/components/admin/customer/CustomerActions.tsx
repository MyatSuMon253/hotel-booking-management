import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DELETE_USER_MUTATION,
  UPDATE_USER_ROLE_MUTATION,
} from "@/graphql/mutations/user";
import { GET_ALL_MEMBERSHIP_TIERS } from "@/graphql/queries/membership-tier";
import { GET_ALL_USERS } from "@/graphql/queries/user";
import type { MembershipTier } from "@/types/membership-tier";
import type { User } from "@/types/user";

interface CustomerActionsProps {
  customer: User;
}

const fallbackMembershipTiers = ["silver", "gold", "diamond"] as const;

function CustomerActions({ customer }: CustomerActionsProps) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(customer.role?.[0] ?? "user");
  const [status, setStatus] = useState(
    customer.isActive ? "active" : "inactive",
  );
  const [membershipTier, setMembershipTier] = useState(
    customer.membershipTier ?? "none",
  );
  const [extraPoints, setExtraPoints] = useState("0");

  const { data: membershipTierData } = useQuery(GET_ALL_MEMBERSHIP_TIERS);

  const activeMembershipTiers: MembershipTier[] =
    membershipTierData?.getAllMembershipTiers?.filter(
      (tier: MembershipTier) => tier.active,
    ) ?? [];
  const tierOptions = [
    ...new Set([
      ...(activeMembershipTiers.length > 0
        ? activeMembershipTiers.map((tier) => tier.name)
        : fallbackMembershipTiers),
      ...(customer.membershipTier ? [customer.membershipTier] : []),
    ]),
  ];

  const [updateUser, { loading: isUpdating }] = useMutation(
    UPDATE_USER_ROLE_MUTATION,
    {
      onCompleted: () => {
        toast.success("Customer updated.");
        setOpen(false);
        setExtraPoints("0");
      },
      onError: (err) => toast.error(err.message),
      refetchQueries: [GET_ALL_USERS],
    },
  );

  const [deleteUser, { loading: isDeleting }] = useMutation(
    DELETE_USER_MUTATION,
    {
      onCompleted: () => toast.success("Customer deleted."),
      onError: (err) => toast.error(err.message),
      refetchQueries: [GET_ALL_USERS],
    },
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setRole(customer.role?.[0] ?? "user");
      setStatus(customer.isActive ? "active" : "inactive");
      setMembershipTier(customer.membershipTier ?? "none");
      setExtraPoints("0");
    }
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const referralPointsAdjustment = Number(extraPoints || 0);

    if (!Number.isInteger(referralPointsAdjustment)) {
      toast.error("Extra points must be a whole number.");
      return;
    }

    if (referralPointsAdjustment < 0) {
      toast.error("Extra points cannot be negative.");
      return;
    }

    await updateUser({
      variables: {
        userId: customer.id,
        roles: [role],
        isActive: status === "active",
        membershipTier: membershipTier === "none" ? null : membershipTier,
        referralPointsAdjustment,
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="secondary" asChild>
        <Link to={`/admin/customers/${customer.id}`}>
          <Eye data-icon="inline-start" />
          View
        </Link>
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Edit data-icon="inline-start" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Edit customer</DialogTitle>
              <DialogDescription>
                Update role, membership, account status, and referral points for{" "}
                {customer.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`role-${customer.id}`}>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id={`role-${customer.id}`} className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles</SelectLabel>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`status-${customer.id}`}>Account status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger
                    id={`status-${customer.id}`}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Deactivated</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`membership-tier-${customer.id}`}>
                  Membership tier
                </Label>
                <Select
                  value={membershipTier}
                  onValueChange={setMembershipTier}
                >
                  <SelectTrigger
                    id={`membership-tier-${customer.id}`}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select membership tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tiers</SelectLabel>
                      <SelectItem value="none">None</SelectItem>
                      {tierOptions.map((tier) => (
                        <SelectItem key={tier} value={tier}>
                          {formatTierName(tier)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`extra-points-${customer.id}`}>
                  Add extra points
                </Label>
                <Input
                  id={`extra-points-${customer.id}`}
                  min={0}
                  step={1}
                  type="number"
                  value={extraPoints}
                  onChange={(event) => setExtraPoints(event.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Current points: {customer.referralPoints ?? 0}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isUpdating}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        title={`Delete "${customer.name}"?`}
        description="This removes the customer account. This cannot be undone."
        confirmLabel="Delete customer"
        pendingLabel="Deleting..."
        loading={isDeleting}
        onConfirm={async () => {
          await deleteUser({ variables: { userId: customer.id } });
        }}
        trigger={
          <Button size="sm" variant="destructive" disabled={isDeleting}>
            <Trash2 data-icon="inline-start" />
            Delete
          </Button>
        }
      />
    </div>
  );
}

function formatTierName(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default CustomerActions;
