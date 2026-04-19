import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router";
import type { BookingRow, BookingStatus } from "@/types/booking";
import CancelBookingDialog from "./CancelBookingDialog";

const statusVariant: Record<
  BookingStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "destructive",
  completed: "outline",
};

export const getColumns = (
  options: { isAdmin?: boolean } = {},
): ColumnDef<BookingRow>[] => [
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
    accessorKey: "status",
    header: "Booking",
    cell: ({ row }) => {
      const status = row.original.status ?? "pending";
      return (
        <Badge variant={statusVariant[status]}>{status.toUpperCase()}</Badge>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.original.paymentStatus.toUpperCase();
      const variant =
        status === "PAID"
          ? "default"
          : status === "REFUNDED"
            ? "outline"
            : "secondary";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const { id, status, paymentStatus, startDate } = row.original;
      const isCancelled = status === "cancelled";
      const isPaid = paymentStatus === "paid";
      const checkInPassed = new Date(parseInt(startDate)) <= new Date();
      const canCancel =
        !isCancelled && (options.isAdmin || !checkInPassed);

      const primaryLabel = isPaid ? "Get Invoice" : "Pay now";
      const primaryTo = isPaid ? `/invoice/${id}` : `/bookings/${id}/payment`;

      return (
        <div className="flex items-center justify-end gap-2">
          {!isCancelled && (
            <Button size="sm" variant="outline" asChild>
              <Link to={primaryTo}>{primaryLabel}</Link>
            </Button>
          )}
          {canCancel && (
            <CancelBookingDialog bookingId={id} isAdmin={options.isAdmin} />
          )}
        </div>
      );
    },
  },
];

export const columns = getColumns();
