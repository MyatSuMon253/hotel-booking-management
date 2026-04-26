import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CREATE_MEMBERSHIP_TIER } from "@/graphql/mutations/membership-tier";
import { membershipTierSchema } from "@/schema/membership-tier";
import type { z } from "zod";

function CreateMembershipTier() {
  const navigate = useNavigate();
  const [createMembershipTier] = useMutation(CREATE_MEMBERSHIP_TIER);

  const form = useForm<z.infer<typeof membershipTierSchema>>({
    resolver: zodResolver(membershipTierSchema),
    defaultValues: {
      name: "silver",
      discountPercentage: 10,
      active: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof membershipTierSchema>) => {
    try {
      await createMembershipTier({
        variables: {
          membershipTierInput: values,
        },
      });
      toast.success("Membership tier created.");
      navigate("/admin/membership-tiers");
    } catch {
      toast.error("Unable to create membership tier.");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Create Membership Tier</h2>
          <p className="text-sm text-muted-foreground">
            Add one of the supported membership tiers.
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
            <Button type="submit">Create tier</Button>
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

export default CreateMembershipTier;
