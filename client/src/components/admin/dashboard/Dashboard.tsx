import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_DASHBOARD_META_DATA } from "@/graphql/queries/booking";
import { adjustTimeZone } from "@/lib/helpers";
import StatusCard from "./StatusCard";
import AdminLayout from "@/components/layout/AdminLayout";
import type { DateRange } from "react-day-picker";
import RangeCalendar from "@/components/booking/RangeCalendar";

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
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <RangeCalendar
          onDateChange={(date: any) => setDates(date)}
          dates={dates}
          isDisabled={false}
        />
      </div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatusCard
          label="Bookings"
          value={metadata?.totalBookings}
          isNumber={false}
        />
        <StatusCard label="Sales" value={metadata?.totalSales} />
        <StatusCard label="Paid Cash" value={metadata?.totalPaidCashAmount} />
        <StatusCard label="Pending Cash" value={metadata?.totalPendingAmount} />
      </div>
      {/* <SalesChart chartData={metadata?.sales} dates={dates} /> */}
    </AdminLayout>
  );
}

export default Dashboard;
