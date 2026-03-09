import { userInfoVar } from "@/apollo/apollo-vars";
import { bookingFormSchema } from "@/schema/booking";
import { useReactiveVar } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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

interface BookingFormProps {
  dates: DateRange | undefined;
  disabledDates?: string[];
}

const BookingForm = ({dates, disabledDates}:BookingFormProps) => {
  const user = useReactiveVar(userInfoVar);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (user) {
      form.reset({
        ...form.getValues(),
        name: user.name,
        email: user.email,
      });
    }
  }, []);

  const onSubmit = (values: z.infer<typeof bookingFormSchema>) => {
    // const { dateRange, name, email, additionalNote } = values;
    console.log(values);
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
                  <span>Tax (10%):</span>
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
