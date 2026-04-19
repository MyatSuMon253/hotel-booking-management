import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DateRange } from "react-day-picker";

export const description = "An area chart with gradient fill";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
  bookings: {
    label: "Bookings",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface Props {
  chartData: {
    date: string;
    sales: number;
    bookings: number;
  }[];
  dates?: DateRange | undefined;
}

export function SalesChart({ chartData, dates }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Chart</CardTitle>
        <CardDescription>
          {dates?.from?.toLocaleDateString()} -{" "}
          {dates?.to?.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[360px]">
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sales)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sales)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-bookings)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-bookings)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="bookings"
              yAxisId="left"
              type="monotone"
              fill="url(#fillBookings)"
              fillOpacity={0.4}
              stroke="var(--color-bookings)"
              stackId="a"
            />
            <Area
              dataKey="sales"
              yAxisId="right"
              type="monotone"
              fill="url(#fillSales)"
              fillOpacity={0.4}
              stroke="var(--color-sales)"
              stackId="a"
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
