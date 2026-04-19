import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_DASHBOARD_META_DATA } from "@/graphql/queries/booking";
import { adjustTimeZone } from "@/lib/helpers";
import StatusCard from "./StatusCard";
import AdminLayout from "@/components/layout/AdminLayout";
import type { DateRange } from "react-day-picker";
import { SalesChart } from "./SalesChart";
import { BookingTrendLineChart } from "./BookingTrendLineChart";
import { PaymentMethodPieChart } from "./PaymentMethodPieChart";
import { StatusRadarChart } from "./StatusRadarChart";
import { RangeCalendar } from "@/components/booking/RangeCalendar";

function Dashboard() {
  const [dates, setDates] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(1)),
    to: new Date(Date.now()),
  });

  const [getDashboardMetaData, { data }] = useLazyQuery(
    GET_DASHBOARD_META_DATA,
    {
      variables: {
        startDate: adjustTimeZone(dates?.from),
        endDate: adjustTimeZone(dates?.to),
      },
    },
  );

  useEffect(() => {
    const fetchData = async () => {
      await getDashboardMetaData({
        variables: {
          startDate: adjustTimeZone(dates?.from),
          endDate: adjustTimeZone(dates?.to),
        },
      });
    };

    fetchData();
  }, [dates, getDashboardMetaData]);

  const metadata = data?.getDashboardMetaData;
  console.log(data?.getDashboardMetaData);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>{" "}
          <p className="mt-2 text-sm text-muted-foreground max-w-lg">
            A quick overview of booking performance, payment mix, and room
            activity for the selected date range.
          </p>{" "}
        </div>
        <RangeCalendar
          onDateChange={(date: any) => setDates(date)}
          dates={dates}
          isDisabled={false}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <StatusCard label="Total Sales" value={metadata?.totalSales} />
        <StatusCard
          label="Total Bookings"
          value={metadata?.totalBookings}
          isNumber={false}
        />
        <StatusCard
          label="Confirmed"
          value={metadata?.totalConfirmedBookings}
          isNumber={false}
        />
        <StatusCard
          label="Cancelled"
          value={metadata?.totalCancelledBookings}
          isNumber={false}
        />
      </div>

      {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4 mb-4">
        <StatusCard label="Paid Cash" value={metadata?.totalPaidCashAmount} />
        <StatusCard label="Pending Cash" value={metadata?.totalPendingAmount} />
        <StatusCard label="Card Sales" value={metadata?.totalCardSales} />
        <StatusCard
          label="Rooms Booked"
          value={metadata?.totalRoomsBooked}
          isNumber={false}
        />
      </div> */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-2 mb-4">
        <SalesChart chartData={metadata?.sales} dates={dates} />
        <BookingTrendLineChart chartData={metadata?.sales} dates={dates} />
        <PaymentMethodPieChart data={metadata?.paymentMethodDistribution} />
        <StatusRadarChart
          statusDistribution={metadata?.statusDistribution}
          totalRoomsBooked={metadata?.totalRoomsBooked}
        />
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
