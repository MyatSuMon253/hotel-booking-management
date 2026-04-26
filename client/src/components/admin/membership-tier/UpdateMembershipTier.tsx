import { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UPDATE_MEMBERSHIP_TIER } from "@/graphql/mutations/membership-tier";
import { GET_MEMBERSHIP_TIER_BY_ID } from "@/graphql/queries/membership-tier";
import { membershipTierSchema } from "@/schema/membership-tier";
import type { z } from "zod";

function UpdateMembershipTier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_MEMBERSHIP_TIER_BY_ID, {
    variables: { membershipTierId: id },
    skip: !id,
  });
  const [updateMembershipTier] = useMutation(UPDATE_MEMBERSHIP_TIER, {
    refetchQueries: [
      { query: GET_MEMBERSHIP_TIER_BY_ID, variables: { membershipTierId: id } },
    ],
    awaitRefetchQueries: true,
  });

  const form = useForm<z.infer<typeof membershipTierSchema>>({
    resolver: zodResolver(membershipTierSchema),
    defaultValues: {
      name: "silver",
      discountPercentage: 10,
      active: true,
    },
  });

  useEffect(() => {
    if (data?.getMembershipTierById) {
      const membershipTier = data.getMembershipTierById;
      form.reset({
        name: membershipTier.name,
        discountPercentage: membershipTier.discountPercentage,
        active: membershipTier.active,
      });
    }
  }, [data, form]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">Loading...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">Membership tier not found.</div>
      </AdminLayout>
    );
  }

  const onSubmit = async (values: z.infer<typeof membershipTierSchema>) => {
    if (!id) return;
    try {
      await updateMembershipTier({
        variables: {
          membershipTierId: id,
          membershipTierInput: values,
        },
      });
      toast.success("Membership tier updated.");
      navigate("/admin/membership-tiers");
    } catch {
      toast.error("Unable to update membership tier.");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Edit Membership Tier</h2>
          <p className="text-sm text-muted-foreground">
            Update tier discount and active status.
          </p>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-md border p-6"
        >
          <label className="block space-y-2">
            <span>Tier</span>
            <select
              className="w-full rounded border px-3 py-2"
              {...form.register("name")}
            >
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="diamond">Diamond</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span>Discount percentage</span>
            <Input
              type="number"
              min={0}
              max={100}
              step="0.01"
              {...form.register("discountPercentage", {
                valueAsNumber: true,
              })}
              placeholder="10"
            />
          </label>
          <label className="block space-y-2 space-x-2">
            <span>Active</span>
            <input
              type="checkbox"
              {...form.register("active")}
              className="h-4 w-4"
            />
          </label>
          <div className="flex items-center gap-3">
            <Button type="submit">Save changes</Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/admin/membership-tiers")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default UpdateMembershipTier;
