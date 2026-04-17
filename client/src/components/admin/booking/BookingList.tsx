import { GET_ALL_BOOKING } from "@/graphql/queries/booking";
import { useQuery } from "@apollo/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/common/Loader";
import NotFound from "@/components/common/NotFound";
import AdminLayout from "@/components/layout/AdminLayout";
import type { BookingRow } from "@/types/booking";
import { DataTable } from "./data-table";
import { columns } from "./columns";

function BookingList() {
  const { data, loading, error } = useQuery(GET_ALL_BOOKING);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NotFound />;
  }

  const rows: BookingRow[] =
    data?.getAllBookings?.map((booking: any) => ({
      id: booking.id,
      roomTitle: booking.room.title,
      roomId: booking.room.id,
      startDate: booking.startDate,
      endDate: booking.endDate,
      total: booking.amount.total,
      daysOfRent: booking.daysOfRent,
      paymentStatus: booking.paymentInfo?.status ?? "UNKNOWN",
      paymentMethod: booking.paymentInfo?.method ?? "UNKNOWN",
      customerEmail: booking.customer.email,
      customerName: booking.customer.name,
    })) ?? [];

  return (
    <AdminLayout>
      <h2 className="mb-4 text-2xl font-bold">Manage Bookings</h2>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All bookings</CardTitle>
          <CardDescription>View all bookings & manage.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={rows} columns={columns} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default BookingList;
