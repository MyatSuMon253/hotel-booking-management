import { useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { CANCEL_BOOKING_MUTATION } from "@/graphql/mutations/booking";
import {
  GET_ALL_BOOKING,
  GET_BOOKING_BY_USER,
} from "@/graphql/queries/booking";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

type Props = {
  bookingId: string;
  isAdmin?: boolean;
  trigger?: React.ReactNode;
};

function CancelBookingDialog({ bookingId, isAdmin, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const [cancelBooking, { loading }] = useMutation(CANCEL_BOOKING_MUTATION, {
    refetchQueries: [
      { query: GET_BOOKING_BY_USER },
      ...(isAdmin ? [{ query: GET_ALL_BOOKING }] : []),
    ],
    onCompleted: (data) => {
      const refunded = data?.cancelBooking?.refundInfo?.id;
      toast.success(
        refunded
          ? "Booking cancelled and refund issued"
          : "Booking cancelled",
      );
      setOpen(false);
      setReason("");
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="destructive">
            Cancel
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this booking?</DialogTitle>
          <DialogDescription>
            This cannot be undone. If the booking has been paid by card, a full
            refund will be issued automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="cancel-reason">Reason (optional)</Label>
          <Textarea
            id="cancel-reason"
            placeholder="Let us know why you're cancelling"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Keep booking
          </Button>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={() =>
              cancelBooking({
                variables: {
                  bookingId,
                  reason: reason.trim() || null,
                },
              })
            }
          >
            {loading ? "Cancelling..." : "Confirm cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CancelBookingDialog;
