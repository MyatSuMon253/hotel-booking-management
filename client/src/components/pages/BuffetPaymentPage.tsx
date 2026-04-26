import {
  UPDATE_BUFFET_BOOKING_PAYMENT,
} from "@/graphql/mutations/buffet";
import { STRIPE_BUFFET_CHECKOUT_MUTATION } from "@/graphql/mutations/payment";
import {
  GET_BUFFET_BOOKING_BY_ID,
  GET_BUFFET_BOOKINGS_BY_USER,
} from "@/graphql/queries/buffet";
import { useMutation, useQuery } from "@apollo/client";
import { CreditCard, Wallet } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";

function BuffetPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [option, setOption] = useState<"card" | "cash">("cash");
  const { data, loading, error } = useQuery(GET_BUFFET_BOOKING_BY_ID, {
    variables: { buffetBookingId: id },
  });
  const [updateBuffetBookingPayment] = useMutation(
    UPDATE_BUFFET_BOOKING_PAYMENT,
    {
      onCompleted: () => {
        toast.success("Buffet booking confirmed — pay at arrival.");
        navigate(`/buffet-bookings/${id}/confirmation`);
      },
      refetchQueries: [{ query: GET_BUFFET_BOOKINGS_BY_USER }],
    },
  );
  const [stripeBuffetCheckoutSession, { loading: checkoutLoading }] =
    useMutation(STRIPE_BUFFET_CHECKOUT_MUTATION, {
      onCompleted: (data) => {
        const checkoutUrl = data?.stripeBuffetCheckoutSession?.url;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        }
      },
    });

  if (loading) return <Loader />;
  if (error) return <NotFound />;

  const booking = data?.getBuffetBookingById;
  if (!booking) return <NotFound />;

  const paymentConfirmHandler = async () => {
    if (option === "cash") {
      await updateBuffetBookingPayment({
        variables: {
          buffetBookingId: id,
          bookingInput: {
            paymentInfo: {
              method: "cash",
            },
          },
        },
      });
    }

    if (option === "card") {
      await stripeBuffetCheckoutSession({
        variables: { buffetBookingId: id },
      });
    }
  };

  return (
    <section className="layout">
      <Card>
        <CardHeader>
          <CardTitle>Buffet Booking Summary - #{booking.id}</CardTitle>
          <CardDescription>Choose a payment method for this dinner.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span>Buffet dinner</span>
              <Link
                to={`/buffets/${booking.buffetDinner.id}`}
                className="font-medium underline"
              >
                {booking.buffetDinner.title}
              </Link>
            </div>
            <div className="flex justify-between">
              <span>Guests</span>
              <span className="font-medium">{booking.guestCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Price per guest</span>
              <span className="font-medium">${booking.pricePerGuest.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">${booking.amount.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span className="font-medium">${booking.amount.tax.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t pt-2 text-base">
              <span className="font-semibold">Total</span>
              <span className="font-bold">${booking.amount.total.toFixed(2)}</span>
            </div>
          </div>
          <div>
            <h2 className="font-semibold">Choose a payment method</h2>
            <p className="mb-2 text-sm font-medium text-red-600">
              Pay with cash must be paid at the hotel.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className={cn(
                  "flex w-full cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-gray-200 p-4 text-sm text-gray-500",
                  option === "cash" && "border-black text-black",
                )}
                onClick={() => setOption("cash")}
              >
                <Wallet />
                <span>Pay with cash</span>
              </button>
              <button
                type="button"
                className={cn(
                  "flex w-full cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-gray-200 p-4 text-sm text-gray-500",
                  option === "card" && "border-black text-black",
                )}
                onClick={() => setOption("card")}
              >
                <CreditCard />
                <span>Pay with card</span>
              </button>
            </div>
            <Button
              className="mt-3 w-full"
              onClick={paymentConfirmHandler}
              disabled={checkoutLoading}
            >
              Confirm with {option === "cash" ? "cash" : "card"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default BuffetPaymentPage;
