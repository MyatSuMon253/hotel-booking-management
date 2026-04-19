import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { DateRange } from "react-day-picker";

interface SalePoint {
  date: string;
  sales: number;
  bookings: number;
}

interface Props {
  chartData?: SalePoint[];
  dates?: DateRange | undefined;
}

export function BookingTrendLineChart({ chartData = [], dates }: Props) {
  const data = chartData.map((item) => ({
    ...item,
    averageBookingValue: item.bookings > 0 ? item.sales / item.bookings : 0,
  }));

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Booking Trend</CardTitle>
          <p className="text-sm text-muted-foreground">
            {dates?.from?.toLocaleDateString()} -{" "}
            {dates?.to?.toLocaleDateString()}
          </p>
        </div>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ChartContainer
          config={{
            bookings: { label: "Bookings", color: "var(--color-bookings)" },
            averageBookingValue: {
              label: "Average Value",
              color: "var(--color-sales)",
            },
          }}
        >
          <LineChart data={data} margin={{ left: 10, right: 10 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${Math.round(Number(value))}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="bookings"
              stroke="var(--color-bookings)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="averageBookingValue"
              stroke="var(--color-sales)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
