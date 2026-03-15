import { userInfoVar } from "@/apollo/apollo-vars";
import { bookingFormSchema } from "@/schema/booking";
import { useMutation, useReactiveVar } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type z from "zod";
import RangeCalendar from "./RangeCalendar";
import { Textarea } from "../ui/textarea";
import type { DateRange } from "react-day-picker";
import { adjustTimeZone, calculateAmount, getDaysOfRent } from "@/lib/helpers";
import { toast } from "sonner";
import { CREATE_BOOKING_MUTATION } from "@/graphql/mutations/booking";

interface BookingFormProps {
  dates?: DateRange | undefined;
  disabledDates?: string[];
  rentPerDay?: number;
  roomId: string;
}

const BookingForm = ({
  dates,
  disabledDates,
  rentPerDay = 0,
  roomId,
}: BookingFormProps) => {
  const user = useReactiveVar(userInfoVar);
  const navigate = useNavigate();

  const [isBookingAvailable, setIsBookingAvailable] = useState(true);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      additionalNote: "",
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
    },
  });

  const dateRange = form.watch("dateRange");

  const [daysOfRent, setDaysOfRent] = useState(0);
  const [amount, setAmount] = useState({
    rent: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });

  useEffect(() => {
    const days = getDaysOfRent(dateRange);
    setDaysOfRent(days);
  }, [dateRange]);

  useEffect(() => {
    setAmount(calculateAmount(rentPerDay, daysOfRent));
  }, [daysOfRent, rentPerDay]);

  useEffect(() => {
    if (user) {
      form.reset({
        ...form.getValues(),
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const [createBooking, { loading }] = useMutation(CREATE_BOOKING_MUTATION, {
    onCompleted() {
      toast.success("Booking successful.");
    },
  });

  const onSubmit = async (values: z.infer<typeof bookingFormSchema>) => {
    const { dateRange, name, email, additionalNote } = values;

    if (!dateRange.from || !dateRange.to || daysOfRent <= 0) {
      return toast.error("Please select booking dates");
    }

    const customer = {
      name,
      email,
    };

    const newBookingData = {
      amount,
      customer,
      daysOfRent,
      rentPerDay,
      room: roomId,
      startDate: adjustTimeZone(dateRange.from),
      endDate: adjustTimeZone(dateRange.to),
      additionalNote,
    };

    const { data } = await createBooking({
      variables: { bookingInput: newBookingData },
    });

    if (data) {
      return navigate(`/bookings/${data?.createNewBooking?.id}/payment`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Booking</CardTitle>
        <CardDescription>Enter the details to rent this room.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking dates</FormLabel>
                  <FormControl>
                    <RangeCalendar
                      dates={dates}
                      disabledDates={disabledDates}
                      onDateChange={field.onChange}
                      onAvailabilityChange={setIsBookingAvailable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional note</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Type your additional note here."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <h2 className="text-lg font-semibold">Summary</h2>
              <p className="mb-4 text-sm text-secondary-foreground">
                Check and confirm your booking
              </p>
              <div className=" space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span>Days of Rent:</span>
                  <span className="font-medium"> {daysOfRent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rent per Day:</span>
                  <span className="font-medium"> {rentPerDay}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Toatal Rent:</span>
                  <span className="font-medium"> {amount.rent.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax (5%):</span>
                  <span className="font-medium"> {amount.tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex items-center justify-between">
                  <span>Est. Total:</span>
                  <span className="font-bold">{amount.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            {user && (
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !isBookingAvailable || daysOfRent <= 0}
              >
                Place Booking
              </Button>
            )}
            {!user && (
              <Button
                type="button"
                className="w-full"
                variant={"secondary"}
                asChild
              >
                <Link to={"/login"}>Login to rent</Link>
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
