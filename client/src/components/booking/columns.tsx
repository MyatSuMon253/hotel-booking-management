import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router";
import type { BookingRow } from "@/types/booking";

export const columns: ColumnDef<BookingRow>[] = [
  {
    accessorKey: "roomTitle",
    header: "Name",
    cell: ({ row }) => (
      <Link to={`/rooms/${row.original.roomId}`} className="font-medium">
        {row.original.roomTitle}
      </Link>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Check-in",
    cell: ({ row }) => (
      <p className="text-sm text-muted-foreground">
        {new Date(parseInt(row.original.startDate)).toLocaleDateString()}
      </p>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Check-out",
    cell: ({ row }) => (
      <p className="text-sm text-muted-foreground">
        {new Date(parseInt(row.original.endDate)).toLocaleDateString()}
      </p>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => (
      <p className="text-sm font-semibold">${row.original.total.toFixed(2)}</p>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.paymentStatus.toUpperCase();
      return (
        <Badge variant={status === "PENDING" ? "secondary" : "default"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      const label = status === "paid" ? "Get Invoice" : "Pay now";

      return (
        <Button size={"sm"} variant={"outline"} asChild>
          <Link
            to={
              status === "paid"
                ? `/invoice/${row.original.id}`
                : `/bookings/${row.original.id}/payment`
            }
          >
            {label}
          </Link>
        </Button>
      );
    },
  },
];
