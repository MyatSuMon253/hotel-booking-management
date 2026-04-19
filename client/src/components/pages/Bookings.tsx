import { GET_BOOKING_BY_USER } from "@/graphql/queries/booking";
import { useQuery } from "@apollo/client";
import Loader from "../common/Loader";
import NotFound from "../common/NotFound";
import { CircleAlert, HandCoins, Tickets } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import BookingCard from "../booking/BookingCard";
import type { BookingRow } from "@/types/booking";
import { DataTable } from "../booking/data-table";
import { columns } from "../booking/columns";

function Bookings() {
  const { data, loading, error } = useQuery(GET_BOOKING_BY_USER);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NotFound />;
  }

  console.log(data);

  const rows: BookingRow[] =
    data?.getBookingByUser?.bookings.map((booking: any) => ({
      id: booking.id,
      roomTitle: booking.room.title,
      roomId: booking.room.id,
      startDate: booking.startDate,
      endDate: booking.endDate,
      total: booking.amount.total,
      daysOfRent: booking.daysOfRent,
      paymentStatus: booking.paymentInfo?.status ?? "pending",
      paymentMethod: booking.paymentInfo?.method,
      status: booking.status ?? "pending",
      customerEmail: "",
      customerName: "",
    })) ?? [];

  return (
    <section className="layout">
      <h2 className="mb-4 text-2xl font-bold">My Bookings</h2>
      <div className="grid grid-cols-3 gap-4">
        <BookingCard
          label={"Total Bookings"}
          value={data.getBookingByUser.meta.totalBookings}
          icon={<Tickets />}
        />
        <BookingCard
          label={"Unpaid Bookings"}
          value={data.getBookingByUser.meta.unpaidBookings}
          icon={<CircleAlert />}
        />
        <BookingCard
          label={"Need to Pay"}
          value={`$${data.getBookingByUser.meta.needToPay}`}
          icon={<HandCoins />}
        />
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All bookings</CardTitle>
          <CardDescription>View your bookings & manage.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={rows} columns={columns} />
        </CardContent>
      </Card>
    </section>
  );
}

export default Bookings;
