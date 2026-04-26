import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { MembershipTier } from "@/types/membership-tier";
import MembershipTierActions from "./MembershipTierActions";

export const columns: ColumnDef<MembershipTier>[] = [
  {
    accessorKey: "name",
    header: "Tier",
    cell: ({ row }) => (
      <p className="font-medium capitalize">{row.original.name}</p>
    ),
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount",
    cell: ({ row }) => <p>{row.original.discountPercentage}%</p>,
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
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => (
      <p className="text-sm text-muted-foreground">
        {formatDate(row.original.updatedAt)}
      </p>
    ),
  },
  {
    id: "actions",
    header: "Manage",
    cell: ({ row }) => <MembershipTierActions membershipTier={row.original} />,
  },
];

function formatDate(value: string) {
  const dateValue = String(value);
  const date = new Date(/^\d+$/.test(dateValue) ? Number(dateValue) : dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
}
