import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Promotion } from "@/types/promotion";
import PromotionActions from "./PromotionActions";

export const columns: ColumnDef<Promotion>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <p className="font-medium">{row.original.code}</p>,
  },
  {
    accessorKey: "discountType",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">{formatDiscountType(row.original)}</Badge>
    ),
  },
  {
    accessorKey: "discountValue",
    header: "Value",
    cell: ({ row }) => <p>{formatDiscountValue(row.original)}</p>,
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.active ? "default" : "secondary"}>
        {row.original.active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "valid",
    header: "Valid",
    cell: ({ row }) => (
      <p className="text-sm text-muted-foreground">
        {formatDate(row.original.validFrom)} - {formatDate(row.original.validTo)}
      </p>
    ),
  },
  {
    id: "uses",
    header: "Uses",
    cell: ({ row }) => (
      <p className="text-sm">
        {row.original.usedCount}
        {row.original.maxUses ? ` / ${row.original.maxUses}` : ""}
      </p>
    ),
  },
  {
    id: "actions",
    header: "Manage",
    cell: ({ row }) => <PromotionActions promotion={row.original} />,
  },
];

function formatDiscountType(promotion: Promotion) {
  return promotion.discountType === "percentage" ? "Percentage" : "Fixed";
}

function formatDiscountValue(promotion: Promotion) {
  if (promotion.discountType === "percentage") {
    return `${promotion.discountValue}%`;
  }

  return `$${promotion.discountValue.toFixed(2)}`;
}

function formatDate(value: string) {
  const dateValue = String(value);
  const date = new Date(/^\d+$/.test(dateValue) ? Number(dateValue) : dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
}
