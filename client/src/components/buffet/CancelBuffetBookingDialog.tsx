import { useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { CANCEL_BUFFET_BOOKING } from "@/graphql/mutations/buffet";
import {
  GET_ALL_BUFFET_BOOKINGS,
  GET_BUFFET_BOOKINGS_BY_USER,
} from "@/graphql/queries/buffet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CancelBuffetBookingDialogProps {
  buffetBookingId: string;
  isAdmin?: boolean;
  trigger?: React.ReactNode;
}

function CancelBuffetBookingDialog({
  buffetBookingId,
  isAdmin,
  trigger,
}: CancelBuffetBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const [cancelBuffetBooking, { loading }] = useMutation(
    CANCEL_BUFFET_BOOKING,
    {
      refetchQueries: [
        { query: GET_BUFFET_BOOKINGS_BY_USER },
        ...(isAdmin ? [{ query: GET_ALL_BUFFET_BOOKINGS }] : []),
      ],
      awaitRefetchQueries: true,
      onCompleted: () => {
        toast.success("Buffet booking cancelled.");
        setOpen(false);
        setReason("");
      },
      onError: (err) => toast.error(err.message),
    },
  );

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
          <DialogTitle>Cancel this buffet booking?</DialogTitle>
          <DialogDescription>
            This releases your reserved dinner seats. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="buffet-cancel-reason">Reason (optional)</Label>
          <Textarea
            id="buffet-cancel-reason"
            placeholder="Let us know why you're cancelling"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Keep booking
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={() =>
              cancelBuffetBooking({
                variables: {
                  buffetBookingId,
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

export default CancelBuffetBookingDialog;
