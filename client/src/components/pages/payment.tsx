import {
  GET_BOOKING_BY_ID,
  GET_BOOKING_BY_USER,
} from "@/graphql/queries/booking";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useNavigate, useParams } from "react-router";
import Loader from "../common/Loader";
import NotFound from "../common/NotFound";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CreditCard, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UPDATE_BOOKING_PAYMENT } from "@/graphql/mutations/booking";
import { toast } from "sonner";
import { STRIPE_CHECKOUT_MUTATION } from "@/graphql/mutations/payment";

function PaymentPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [option, setOption] = useState<"card" | "cash">("cash");

  const { data, loading, error } = useQuery(GET_BOOKING_BY_ID, {
    variables: { bookingId: params.id },
  });

  const [updateBookingPayment] = useMutation(UPDATE_BOOKING_PAYMENT, {
    onCompleted: () => {
      toast.success("Booking confirmed — pay at check-in.");
      navigate(`/bookings/${params.id}/confirmation`);
    },
    refetchQueries: [GET_BOOKING_BY_USER],
  });

  const [stripeCheckoutSession, { loading: checkoutLoading }] = useMutation(
    STRIPE_CHECKOUT_MUTATION,
    {
      onCompleted: (data) => {
        const checkoutUrl = data?.stripeCheckoutSession?.url;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        }
      },
    },
  );

  const bookingData = data?.getBookingById;

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NotFound />;
  }

  const changePaymentOption = (opt: "card" | "cash") => {
    setOption(opt);
  };

  const paymentConfirmHandler = async () => {
    if (option === "cash") {
      const bookingInput = {
        paymentInfo: {
          method: "cash",
        },
      };

      await updateBookingPayment({
        variables: { bookingId: params?.id, bookingInput },
      });
    }

    if (option === "card") {
      await stripeCheckoutSession({
        variables: { bookingId: params.id },
      });
    }
  };

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary - #{bookingData.id}</CardTitle>
          <CardDescription>
            Here is the your booking infomation.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="grid-cols-1">
            <div className=" space-y-1.5">
              <div className="flex items-center justify-between">
                <span>Days of Rent:</span>
                <span className="font-medium"> {bookingData.daysOfRent}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rent per Day:</span>
                <span className="font-medium"> {bookingData.rentPerDay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Toatal Rent:</span>
                <span className="font-medium">
                  {bookingData.amount.rent.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax (10%):</span>
                <span className="font-medium">
                  {bookingData.amount.tax.toFixed(2)}
                </span>
              </div>
              <hr />
              <div className="flex items-center justify-between">
                <span>Est. Total:</span>
                <span className="font-bold">
                  {bookingData.amount.total.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span>{bookingData.room.title}</span>
                <Link
                  to={`/rooms/${bookingData.room.id}`}
                  className="font-medium underline text-sm"
                >
                  view details
                </Link>
              </div>
            </div>
          </div>
          <div className="grid-cols-1">
            <h2 className="font-semibold">Choose a payment method</h2>
            <p className="text-sm mb-1 font-medium text-red-600">
              Pay with cash must be paid in 4 hours.
            </p>
            <div className="flex gap-2">
              <div
                className={cn(
                  "border-3  text-sm p-4 border-gray-200 w-full rounded-md flex flex-col items-center gap-2 text-gray-400 cursor-pointer",
                  option === "cash" && "border-black text-black",
                )}
                onClick={() => changePaymentOption("cash")}
              >
                <Wallet />
                <p>Pay with cash</p>
              </div>
              <div
                className={cn(
                  "border-3  text-sm p-4 border-gray-200 w-full rounded-md flex flex-col items-center gap-2 text-gray-400 cursor-pointer",
                  option === "card" && "border-black text-black",
                )}
                onClick={() => changePaymentOption("card")}
              >
                <CreditCard />
                <p>Pay with card</p>
              </div>
            </div>
            <Button
              className="w-full mt-2 cursor-pointer"
              onClick={paymentConfirmHandler}
              disabled={checkoutLoading}
            >
              Booking confirm with {option === "cash" ? "cash" : "card"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default PaymentPage;
