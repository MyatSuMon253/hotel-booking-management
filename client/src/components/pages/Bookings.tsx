import { GET_BOOKING_BY_USER } from "@/graphql/queries/booking";
import { GET_BUFFET_BOOKINGS_BY_USER } from "@/graphql/queries/buffet";
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
import type { BuffetBooking } from "@/types/buffet";
import { Link } from "react-router";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import CancelBuffetBookingDialog from "../buffet/CancelBuffetBookingDialog";

interface RoomBookingResponse {
  id: string;
  room: {
    title: string;
    id: string;
  };
  startDate: string;
  endDate: string;
  amount: {
    total: number;
  };
  daysOfRent: number;
  paymentInfo?: {
    status?: "paid" | "pending" | "refunded";
    method?: "card" | "cash";
  };
  status?: BookingRow["status"];
}

function Bookings() {
  const { data, loading, error } = useQuery(GET_BOOKING_BY_USER);
  const {
    data: buffetData,
    loading: buffetLoading,
    error: buffetError,
  } = useQuery(GET_BUFFET_BOOKINGS_BY_USER);

  if (loading || buffetLoading) {
    return <Loader />;
  }

  if (error || buffetError) {
    return <NotFound />;
  }

  console.log(data);

  const rows: BookingRow[] =
    data?.getBookingByUser?.bookings.map((booking: RoomBookingResponse) => ({
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
    <section>
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
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Buffet bookings</CardTitle>
          <CardDescription>View your buffet dinner reservations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">Dinner</th>
                  <th className="p-3 text-left">Guests</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Manage</th>
                </tr>
              </thead>
              <tbody>
                {(buffetData?.getBuffetBookingsByUser ?? []).map(
                  (booking: BuffetBooking) => (
                    <tr key={booking.id} className="border-t">
                      <td className="p-3 font-medium">
                        {booking.buffetDinner.title}
                      </td>
                      <td className="p-3">{booking.guestCount}</td>
                      <td className="p-3">${booking.amount.total.toFixed(2)}</td>
                      <td className="p-3">
                        <Badge variant="outline">{booking.status}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link
                              to={
                                booking.paymentInfo?.status === "paid"
                                  ? `/buffet-bookings/${booking.id}/confirmation`
                                  : `/buffet-bookings/${booking.id}/payment`
                              }
                            >
                              {booking.paymentInfo?.status === "paid"
                                ? "View"
                                : "Pay"}
                            </Link>
                          </Button>
                          {booking.status !== "cancelled" && (
                            <CancelBuffetBookingDialog
                              buffetBookingId={booking.id}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ),
                )}
                {(buffetData?.getBuffetBookingsByUser ?? []).length === 0 && (
                  <tr>
                    <td className="p-6 text-center" colSpan={5}>
                      No buffet bookings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default Bookings;
