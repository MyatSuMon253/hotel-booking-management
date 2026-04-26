import { userInfoVar } from "@/apollo/apollo-vars";
import { CREATE_BUFFET_BOOKING } from "@/graphql/mutations/buffet";
import { GET_BUFFET_DINNER_BY_ID } from "@/graphql/queries/buffet";
import { buffetBookingSchema } from "@/schema/buffet";
import type { BuffetDinner } from "@/types/buffet";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import Loader from "../common/Loader";
import NotFound from "../common/NotFound";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import type { z } from "zod";

function BuffetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useReactiveVar(userInfoVar);
  const { data, loading, error } = useQuery(GET_BUFFET_DINNER_BY_ID, {
    variables: { buffetDinnerId: id },
    skip: !id,
    fetchPolicy: "network-only",
  });
  const [createBuffetBooking, { loading: isBooking }] = useMutation(
    CREATE_BUFFET_BOOKING,
    {
      onCompleted: () => toast.success("Buffet booking created."),
      onError: (err) => toast.error(err.message || "Unable to book buffet."),
    },
  );

  const form = useForm<z.infer<typeof buffetBookingSchema>>({
    resolver: zodResolver(buffetBookingSchema),
    defaultValues: {
      name: "",
      email: "",
      guestCount: 1,
      additionalNote: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        ...form.getValues(),
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  if (loading) return <Loader />;
  if (error) return <NotFound />;

  const buffetDinner: BuffetDinner | undefined = data?.getBuffetDinnerById;
  if (!buffetDinner) return <NotFound />;

  const guestCount = form.watch("guestCount") || 1;
  const subtotal = buffetDinner.pricePerGuest * guestCount;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const hasCapacity = buffetDinner.remainingCapacity > 0;

  const handleSubmit = async (values: z.infer<typeof buffetBookingSchema>) => {
    if (!id) return;
    if (values.guestCount > buffetDinner.remainingCapacity) {
      toast.error("Guest count exceeds remaining seats.");
      return;
    }

    const response = await createBuffetBooking({
      variables: {
        bookingInput: {
          buffetDinner: id,
          customer: {
            name: values.name,
            email: values.email,
          },
          guestCount: values.guestCount,
          additionalNote: values.additionalNote,
        },
      },
    });

    const bookingId = response.data?.createBuffetBooking?.id;
    if (bookingId) {
      navigate(`/buffet-bookings/${bookingId}/payment`);
    }
  };

  return (
    <section className="layout grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        {buffetDinner.imageUrl && (
          <img
            src={buffetDinner.imageUrl}
            alt={buffetDinner.title}
            className="h-72 w-full rounded-t-lg object-cover"
          />
        )}
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-3xl">{buffetDinner.title}</CardTitle>
            <Badge variant="outline">{buffetDinner.cuisineCategory}</Badge>
          </div>
          <CardDescription>{formatDateRange(buffetDinner)}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <p className="text-muted-foreground">{buffetDinner.description}</p>
          <div>
            <h3 className="font-semibold">Included dishes</h3>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {buffetDinner.includedDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="flex items-center gap-3 rounded-md border p-2"
                >
                  {dish.imageUrl && (
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="h-14 w-20 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{dish.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {dish.cuisineCategory}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Facilities</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {buffetDinner.facilities.map((facility) => (
                <Badge key={facility} variant="outline">
                  {facility}
                </Badge>
              ))}
              {buffetDinner.facilities.length === 0 && (
                <span className="text-sm text-muted-foreground">None listed.</span>
              )}
            </div>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground">Price per guest</p>
              <p className="font-semibold">${buffetDinner.pricePerGuest.toFixed(2)}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground">Seats left</p>
              <p className="font-semibold">{buffetDinner.remainingCapacity}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground">Capacity</p>
              <p className="font-semibold">{buffetDinner.maxCapacity}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reserve seats</CardTitle>
          <CardDescription>Book seats for this buffet dinner.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <label className="flex flex-col gap-2">
              <span>Name</span>
              <Input {...form.register("name")} />
            </label>
            <label className="flex flex-col gap-2">
              <span>Email</span>
              <Input {...form.register("email")} />
            </label>
            <label className="flex flex-col gap-2">
              <span>Guests</span>
              <Input
                type="number"
                min={1}
                max={buffetDinner.remainingCapacity}
                {...form.register("guestCount", { valueAsNumber: true })}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span>Additional note</span>
              <Textarea {...form.register("additionalNote")} />
            </label>
            <div className="rounded-md border p-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            {user ? (
              <Button type="submit" disabled={isBooking || !hasCapacity}>
                {hasCapacity ? "Book buffet dinner" : "Buffet is full"}
              </Button>
            ) : (
              <Button type="button" asChild>
                <Link to="/login">Login to book</Link>
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

function formatDateRange(buffetDinner: BuffetDinner) {
  const startsAt = parseGraphQLDate(buffetDinner.startsAt);
  const endsAt = parseGraphQLDate(buffetDinner.endsAt);
  if (!startsAt || !endsAt) return "-";
  return `${startsAt.toLocaleString()} - ${endsAt.toLocaleTimeString()}`;
}

function parseGraphQLDate(value: string) {
  const date = new Date(/^\d+$/.test(String(value)) ? Number(value) : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default BuffetDetailPage;
