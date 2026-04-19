import { GET_BOOKING_BY_ID } from "@/graphql/queries/booking";
import { useQuery } from "@apollo/client";
import { Link, useParams, useSearchParams } from "react-router";
import Loader from "../common/Loader";
import NotFound from "../common/NotFound";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle2, Clock, FileText, Receipt } from "lucide-react";

function PaymentConfirmation() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const { data, loading, error } = useQuery(GET_BOOKING_BY_ID, {
    variables: { bookingId: id },
    fetchPolicy: "network-only",
  });

  if (loading) return <Loader />;
  if (error) return <NotFound />;

  const booking = data?.getBookingById;
  if (!booking) return <NotFound />;

  const isPaid = booking.paymentInfo?.status === "paid";
  const isCash = booking.paymentInfo?.method === "cash";
  const checkIn = new Date(Number(booking.startDate)).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short", year: "numeric" },
  );
  const checkOut = new Date(Number(booking.endDate)).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short", year: "numeric" },
  );

  const headline = isPaid
    ? "Payment received"
    : isCash
      ? "Booking confirmed — pay at check-in"
      : status === "cancelled"
        ? "Payment was cancelled"
        : "Finishing payment…";

  const subheadline = isPaid
    ? "Your booking is confirmed. A receipt is available below."
    : isCash
      ? "Please settle the balance at the front desk within 4 hours of arrival."
      : status === "cancelled"
        ? "No charge was made. You can retry payment from this booking."
        : "This page will update as soon as we confirm the payment with Stripe.";

  return (
    <section className="layout max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            {isPaid ? (
              <CheckCircle2 className="h-14 w-14 text-green-600" />
            ) : (
              <Clock className="h-14 w-14 text-amber-500" />
            )}
          </div>
          <CardTitle className="text-2xl">{headline}</CardTitle>
          <CardDescription>{subheadline}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking ID</span>
              <span className="font-mono text-xs">{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room</span>
              <Link
                to={`/rooms/${booking.room.id}`}
                className="font-medium underline"
              >
                {booking.room.title}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in</span>
              <span className="font-medium">{checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-out</span>
              <span className="font-medium">{checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nights</span>
              <span className="font-medium">{booking.daysOfRent}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-base">
              <span className="font-semibold">
                {isPaid ? "Amount paid" : "Amount due"}
              </span>
              <span className="font-bold">
                ${booking.amount.total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Payment method</span>
              <span className="uppercase">
                {booking.paymentInfo?.method ?? "—"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {isPaid ? (
              <Button asChild className="flex-1">
                <Link to={`/invoice/${booking.id}`}>
                  <Receipt className="mr-2 h-4 w-4" />
                  View invoice
                </Link>
              </Button>
            ) : status === "cancelled" ? (
              <Button asChild className="flex-1">
                <Link to={`/bookings/${booking.id}/payment`}>
                  Retry payment
                </Link>
              </Button>
            ) : (
              <Button asChild className="flex-1">
                <Link to={`/bookings/${booking.id}/payment`}>
                  Back to payment
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild className="flex-1">
              <Link to="/bookings">
                <FileText className="mr-2 h-4 w-4" />
                All my bookings
              </Link>
            </Button>
          </div>

          {isPaid && (
            <p className="text-xs text-muted-foreground text-center">
              A confirmation has been sent to{" "}
              <span className="font-medium">{booking.customer.email}</span>.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default PaymentConfirmation;
