import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_PROMOTION } from "@/graphql/mutations/promotion";
import { promotionSchema } from "@/schema/promotion";
import type { z } from "zod";

function CreatePromotion() {
  const navigate = useNavigate();
  const [createPromotion] = useMutation(CREATE_PROMOTION);

  const form = useForm<z.infer<typeof promotionSchema>>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      validFrom: "",
      validTo: "",
      active: true,
      maxUses: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof promotionSchema>) => {
    try {
      await createPromotion({
        variables: {
          promotionInput: {
            code: values.code.trim().toUpperCase(),
            description: values.description,
            discountType: values.discountType,
            discountValue: values.discountValue,
            validFrom: values.validFrom,
            validTo: values.validTo,
            active: values.active,
            maxUses: values.maxUses ? Number(values.maxUses) : undefined,
          },
        },
      });
      toast.success("Promotion created.");
      navigate("/admin/promotions");
    } catch (err) {
      toast.error("Unable to create promotion.");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Create Promotion</h2>
          <p className="text-sm text-muted-foreground">
            Add a new promotion code for discounts.
          </p>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-md border p-6"
        >
          <label className="block space-y-2">
            <span>Code</span>
            <Input {...form.register("code")} placeholder="SUMMER20" />
          </label>
          <label className="block space-y-2">
            <span>Description</span>
            <Textarea
              {...form.register("description")}
              placeholder="Enter a short promotion description"
              rows={3}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span>Discount type</span>
              <select
                className="w-full rounded border px-3 py-2"
                {...form.register("discountType")}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed amount</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span>Discount value</span>
              <Input
                type="number"
                step="0.01"
                {...form.register("discountValue", { valueAsNumber: true })}
                placeholder="10"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span>Valid from</span>
              <Input type="date" {...form.register("validFrom")} />
            </label>
            <label className="block space-y-2">
              <span>Valid to</span>
              <Input type="date" {...form.register("validTo")} />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 space-x-2">
              <span>Active</span>
              <input
                type="checkbox"
                {...form.register("active")}
                className="h-4 w-4"
              />
            </label>
            <label className="block space-y-2">
              <span>Max uses</span>
              <Input
                type="number"
                min={0}
                {...form.register("maxUses", { valueAsNumber: true })}
                placeholder="Optional"
              />
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit">Create promotion</Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/admin/promotions")}
            >
              {"Cancel"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default CreatePromotion;
