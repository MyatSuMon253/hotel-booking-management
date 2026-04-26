import { GET_BUFFET_BOOKING_BY_ID } from "@/graphql/queries/buffet";
import { useQuery } from "@apollo/client";
import { CheckCircle2, Clock, FileText } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router";
import Loader from "../common/Loader";
import NotFound from "../common/NotFound";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

function BuffetConfirmationPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const { data, loading, error } = useQuery(GET_BUFFET_BOOKING_BY_ID, {
    variables: { buffetBookingId: id },
    fetchPolicy: "network-only",
  });

  if (loading) return <Loader />;
  if (error) return <NotFound />;

  const booking = data?.getBuffetBookingById;
  if (!booking) return <NotFound />;

  const isPaid = booking.paymentInfo?.status === "paid";
  const isCash = booking.paymentInfo?.method === "cash";
  const headline = isPaid
    ? "Payment received"
    : isCash
      ? "Buffet booking confirmed"
      : status === "cancelled"
        ? "Payment was cancelled"
        : "Finishing payment...";
  const subheadline = isPaid
    ? "Your buffet dinner seats are confirmed."
    : isCash
      ? "Please settle the balance at the hotel."
      : status === "cancelled"
        ? "No charge was made. You can retry payment."
        : "This page will update after Stripe confirms payment.";

  return (
    <section className="mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            {isPaid ? (
              <CheckCircle2 className="h-14 w-14 text-green-600" />
            ) : (
              <Clock className="h-14 w-14 text-amber-500" />
            )}
          </div>
          <CardTitle className="text-2xl">{headline}</CardTitle>
          <CardDescription>{subheadline}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 rounded-md border p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking ID</span>
              <span className="font-mono text-xs">{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Buffet dinner</span>
              <Link
                to={`/buffets/${booking.buffetDinner.id}`}
                className="font-medium underline"
              >
                {booking.buffetDinner.title}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guests</span>
              <span className="font-medium">{booking.guestCount}</span>
            </div>
            <div className="flex justify-between text-base">
              <span className="font-semibold">
                {isPaid ? "Amount paid" : "Amount due"}
              </span>
              <span className="font-bold">${booking.amount.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Payment method</span>
              <span className="uppercase">{booking.paymentInfo?.method ?? "-"}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {status === "cancelled" ? (
              <Button asChild className="flex-1">
                <Link to={`/buffet-bookings/${booking.id}/payment`}>
                  Retry payment
                </Link>
              </Button>
            ) : (
              <Button asChild className="flex-1">
                <Link to="/buffets">Browse buffets</Link>
              </Button>
            )}
            <Button variant="outline" asChild className="flex-1">
              <Link to="/bookings">
                <FileText className="mr-2 h-4 w-4" />
                My bookings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default BuffetConfirmationPage;
