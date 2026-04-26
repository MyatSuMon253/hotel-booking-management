import { useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/AdminLayout";
import Loader from "@/components/common/Loader";
import NotFound from "@/components/common/NotFound";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  CANCEL_BUFFET_BOOKING,
  UPDATE_BUFFET_BOOKING_PAYMENT,
} from "@/graphql/mutations/buffet";
import { GET_ALL_BUFFET_BOOKINGS } from "@/graphql/queries/buffet";
import type { BuffetBooking } from "@/types/buffet";
import { useState } from "react";

function BuffetBookingList() {
  const { data, loading, error } = useQuery(GET_ALL_BUFFET_BOOKINGS);

  if (loading) return <Loader />;
  if (error) return <NotFound />;

  const buffetBookings: BuffetBooking[] = data?.getAllBuffetBookings ?? [];

  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold">Dinner Bookings</h2>
        <p className="text-sm text-muted-foreground">
          Review and manage buffet dinner reservations.
        </p>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Buffet dinner bookings</CardTitle>
          <CardDescription>
            Track guests, payments, and booking status for dinner events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">Dinner</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Guests</th>
                  <th className="p-3 text-left">Payment</th>
                  <th className="p-3 text-left">Booking</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Manage</th>
                </tr>
              </thead>
              <tbody>
                {buffetBookings.map((booking) => (
                  <BuffetBookingRow key={booking.id} booking={booking} />
                ))}
                {buffetBookings.length === 0 && (
                  <tr>
                    <td className="p-6 text-center" colSpan={7}>
                      No dinner bookings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

interface BuffetBookingRowProps {
  booking: BuffetBooking;
}

function BuffetBookingRow({ booking }: BuffetBookingRowProps) {
  const [paymentStatus, setPaymentStatus] = useState<string>(
    booking.paymentInfo?.status ?? "pending",
  );
  const [paymentMethod, setPaymentMethod] = useState<string>(
    booking.paymentInfo?.method ?? "cash",
  );

  const [updateBuffetBookingPayment, { loading: isUpdating }] = useMutation(
    UPDATE_BUFFET_BOOKING_PAYMENT,
    {
      refetchQueries: [{ query: GET_ALL_BUFFET_BOOKINGS }],
      awaitRefetchQueries: true,
      onCompleted: () => toast.success("Dinner booking payment updated."),
      onError: () => toast.error("Unable to update dinner booking payment."),
    },
  );

  const [cancelBuffetBooking, { loading: isCancelling }] = useMutation(
    CANCEL_BUFFET_BOOKING,
    {
      refetchQueries: [{ query: GET_ALL_BUFFET_BOOKINGS }],
      awaitRefetchQueries: true,
      onCompleted: () => toast.success("Dinner booking cancelled."),
      onError: () => toast.error("Unable to cancel dinner booking."),
    },
  );

  const handleUpdatePayment = async () => {
    await updateBuffetBookingPayment({
      variables: {
        buffetBookingId: booking.id,
        bookingInput: {
          paymentInfo: {
            status: paymentStatus,
            method: paymentMethod,
          },
        },
      },
    });
  };

  return (
    <tr className="border-t align-top">
      <td className="p-3">
        <Link
          to={`/buffets/${booking.buffetDinner.id}`}
          className="font-medium underline"
        >
          {booking.buffetDinner.title}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDateTime(booking.buffetDinner.startsAt)}
        </p>
      </td>
      <td className="p-3">
        <p className="font-medium">{booking.customer.name}</p>
        <p className="text-xs text-muted-foreground">{booking.customer.email}</p>
      </td>
      <td className="p-3">{booking.guestCount}</td>
      <td className="p-3">
        <div className="flex flex-col gap-1">
          <Badge variant={getPaymentVariant(booking.paymentInfo?.status)}>
            {(booking.paymentInfo?.status ?? "pending").toUpperCase()}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {booking.paymentInfo?.method ?? "cash"}
          </span>
        </div>
      </td>
      <td className="p-3">
        <Badge variant={getBookingVariant(booking.status)}>
          {booking.status.toUpperCase()}
        </Badge>
      </td>
      <td className="p-3 font-semibold">${booking.amount.total.toFixed(2)}</td>
      <td className="p-3">
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Manage
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage dinner booking</DialogTitle>
                <DialogDescription>
                  Update payment details for this buffet dinner booking.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="rounded-md border p-3 text-sm">
                  <p className="font-medium">{booking.buffetDinner.title}</p>
                  <p className="text-muted-foreground">
                    {booking.guestCount} guest(s), total $
                    {booking.amount.total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="mb-2">Payment method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Methods</SelectLabel>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2">Payment status</Label>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={handleUpdatePayment}
                  disabled={isUpdating || booking.status === "cancelled"}
                >
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {booking.status !== "cancelled" && (
            <ConfirmDialog
              title="Cancel dinner booking?"
              description="This cancels the reservation and releases the reserved buffet seats."
              confirmLabel="Cancel booking"
              pendingLabel="Cancelling..."
              loading={isCancelling}
              onConfirm={async () => {
                await cancelBuffetBooking({
                  variables: { buffetBookingId: booking.id },
                });
              }}
              trigger={
                <Button size="sm" variant="destructive" disabled={isCancelling}>
                  Cancel
                </Button>
              }
            />
          )}
        </div>
      </td>
    </tr>
  );
}

function getPaymentVariant(status?: string) {
  if (status === "paid") return "default";
  if (status === "refunded") return "outline";
  return "secondary";
}

function getBookingVariant(status: string) {
  if (status === "confirmed") return "default";
  if (status === "cancelled") return "destructive";
  if (status === "completed") return "outline";
  return "secondary";
}

function formatDateTime(value: string) {
  const date = new Date(/^\d+$/.test(String(value)) ? Number(value) : value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

export default BuffetBookingList;
