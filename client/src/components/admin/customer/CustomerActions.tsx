import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router";
import { toast } from "sonner";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { GET_ALL_USERS } from "@/graphql/queries/user";
import type { User } from "@/types/user";

interface CustomerActionsProps {
  customer: User;
}

function CustomerActions({ customer }: CustomerActionsProps) {
  const [role, setRole] = useState(customer.role?.[0] ?? "user");
  const [status, setStatus] = useState(
    customer.isActive ? "active" : "inactive",
  );
  const [membershipTier, setMembershipTier] = useState(
    customer.membershipTier ?? "none",
  );

  const [updateUser, { loading: isUpdating }] = useMutation(
    UPDATE_USER_ROLE_MUTATION,
    {
      onCompleted: () => toast.success("Customer updated."),
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

  const handleUpdate = async () => {
    await updateUser({
      variables: {
        userId: customer.id,
        roles: [role],
        isActive: status === "active",
        membershipTier: membershipTier === "none" ? null : membershipTier,
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="secondary" asChild>
        <Link to={`/admin/customers/${customer.id}`}>View</Link>
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit customer</DialogTitle>
            <DialogDescription>
              Update role, status, and membership tier for {customer.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full">
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
            <div>
              <Label className="mb-2">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2">Member tier</Label>
              <Select value={membershipTier} onValueChange={setMembershipTier}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select member tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tiers</SelectLabel>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="diamond">Diamond</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isUpdating}>
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            </DialogClose>
          </DialogFooter>
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
            Delete
          </Button>
        }
      />
    </div>
  );
}

export default CustomerActions;
