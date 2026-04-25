import { useState } from "react";
import { Link } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useMutation } from "@apollo/client";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";

import type { BookingRow, BookingStatus } from "@/types/booking";
import { GET_ALL_BOOKING } from "@/graphql/queries/booking";
import { UPDATE_BOOKING_PAYMENT } from "@/graphql/mutations/booking";
import CancelBookingDialog from "@/components/booking/CancelBookingDialog";

const bookingStatusVariant: Record<
  BookingStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "destructive",
  completed: "outline",
};

export const columns: ColumnDef<BookingRow>[] = [
  {
    accessorKey: "customerName",
    header: "Name",
    cell: ({ row }) => (
      <Link to={`/rooms/${row.original.roomId}`} className="font-medium">
        {row.original.customerName}
      </Link>
    ),
  },
  {
    accessorKey: "customerEmail",
    header: "Email",
    cell: ({ row }) => (
      <p className="text-sm text-muted-foreground">
        {row.original.customerEmail}
      </p>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
    cell: ({ row }) => (
      <p className="text-sm text-muted-foreground">
        <Badge
          variant={
            row.original.paymentMethod === "card" ? "secondary" : "outline"
          }
        >
          {row.original.paymentMethod}
        </Badge>
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: "Booking",
    cell: ({ row }) => {
      const status = (row.original.status ?? "pending") as BookingStatus;
      return (
        <Badge variant={bookingStatusVariant[status]}>
          {status.toUpperCase()}
        </Badge>
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
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => (
      <p className="text-sm font-semibold">${row.original.total.toFixed(2)}</p>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const [updateBooking, { loading }] = useMutation(UPDATE_BOOKING_PAYMENT, {
        onCompleted: () => {
          toast.success("Booking payment updated");
        },
        refetchQueries: [GET_ALL_BOOKING],
      });

      const [paymentStatus, setPaymentStatus] = useState<
        "paid" | "pending" | string
      >(row.original.paymentStatus);
      const [paymentMethod, setPaymentMethod] = useState<
        "card" | "cash" | string
      >(row.original.paymentMethod);

      const updateBookingHandler = async () => {
        const bookingInput = {
          paymentInfo: {
            status: paymentStatus,
            method: paymentMethod,
          },
        };
        await updateBooking({
          variables: {
            bookingId: row.original.id,
            bookingInput,
          },
        });
      };

      return (
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button variant="outline" size={"sm"}>
                manage booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Manage booking</DialogTitle>
                <DialogDescription>
                  Make changes to this booking. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <div className="text-sm font-medium space-y-1">
                  <p>Room - {row.original.roomTitle}</p>
                  <p>Days Of Rent - {row.original.daysOfRent}</p>
                  <p>
                    Check-in -{" "}
                    {new Date(
                      parseInt(row.original.startDate),
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    Check-out -{" "}
                    {new Date(
                      parseInt(row.original.endDate),
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  {row.original.paymentStatus === "paid" ? (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500">
                        This booking is already paid and confirmed.
                      </p>
                      <Button asChild className="w-full mt-2">
                        <Link to={`/invoice/${row.original.id}`}>
                          View & Download invoice
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <hr className="w-full h-1 my-2" />
                      <h2 className="text-lg font-semibold my-2">
                        Update Booking
                      </h2>
                      <div>
                        <div>
                          <Label className="mb-2">Payment Method</Label>
                          <Select
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Methods</SelectLabel>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="mt-4">
                          <Label className="mb-2">Payment Status</Label>
                          <Select
                            value={paymentStatus}
                            onValueChange={setPaymentStatus}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select payment status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {row.original.status !== "cancelled" && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-medium text-destructive mb-2">
                    Danger zone
                  </p>
                  <CancelBookingDialog
                    bookingId={row.original.id}
                    isAdmin
                    trigger={
                      <Button variant="destructive" className="w-full">
                        Cancel this booking
                      </Button>
                    }
                  />
                </div>
              )}
              {row.original.paymentStatus === "pending" &&
                row.original.status !== "cancelled" && (
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                    <Button
                      type="button"
                      onClick={updateBookingHandler}
                      disabled={loading}
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                )}
            </DialogContent>
          </form>
        </Dialog>
      );
    },
  },
];
