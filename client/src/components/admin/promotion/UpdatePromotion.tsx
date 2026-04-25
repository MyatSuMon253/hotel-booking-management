import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GET_PROMOTION_BY_ID } from "@/graphql/queries/promotion";
import { UPDATE_PROMOTION } from "@/graphql/mutations/promotion";
import { promotionSchema } from "@/schema/promotion";
import type { z } from "zod";

function UpdatePromotion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_PROMOTION_BY_ID, {
    variables: { promotionId: id },
    skip: !id,
  });
  const [updatePromotion] = useMutation(UPDATE_PROMOTION, {
    refetchQueries: [
      { query: GET_PROMOTION_BY_ID, variables: { promotionId: id } },
    ],
    awaitRefetchQueries: true,
  });

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

  useEffect(() => {
    if (data?.getPromotionById) {
      const promotion = data.getPromotionById;
      form.reset({
        code: promotion.code,
        description: promotion.description || "",
        discountType: promotion.discountType as "percentage" | "fixed",
        discountValue: promotion.discountValue,
        validFrom: formatDateInputValue(promotion.validFrom),
        validTo: formatDateInputValue(promotion.validTo),
        active: promotion.active,
        maxUses: promotion.maxUses ?? undefined,
      });
    }
  }, [data]);

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
        <div className="p-8">Promotion not found.</div>
      </AdminLayout>
    );
  }

  const onSubmit = async (values: z.infer<typeof promotionSchema>) => {
    if (!id) return;
    try {
      await updatePromotion({
        variables: {
          promotionId: id,
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
      toast.success("Promotion updated.");
      navigate("/admin/promotions");
    } catch (err) {
      toast.error("Unable to update promotion.");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Edit Promotion</h2>
          <p className="text-sm text-muted-foreground">
            Update the promotion details.
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
              placeholder="Optional description"
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
            <Button type="submit">Save changes</Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/admin/promotions")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

function formatDateInputValue(value: string | number | Date | null | undefined) {
  if (!value) return "";

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  const dateValue = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
    return dateValue.slice(0, 10);
  }

  const date = new Date(/^\d+$/.test(dateValue) ? Number(dateValue) : dateValue);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
}

export default UpdatePromotion;
