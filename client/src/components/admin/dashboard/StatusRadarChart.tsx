import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BookingStatusMetric {
  status: string;
  count: number;
}

interface Props {
  statusDistribution?: BookingStatusMetric[];
  totalRoomsBooked?: number;
}

export function StatusRadarChart({
  statusDistribution = [],
  totalRoomsBooked = 0,
}: Props) {
  const confirmed =
    statusDistribution.find((item) => item.status === "confirmed")?.count || 0;
  const pending =
    statusDistribution.find((item) => item.status === "pending")?.count || 0;
  const cancelled =
    statusDistribution.find((item) => item.status === "cancelled")?.count || 0;

  const chartData = [
    { metric: "Confirmed", value: confirmed },
    { metric: "Pending", value: pending },
    { metric: "Cancelled", value: cancelled },
    { metric: "Rooms Booked", value: totalRoomsBooked },
  ];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Booking Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ChartContainer
          config={{
            value: { label: "Count", color: "var(--color-sales)" },
          }}
        >
          <RadarChart data={chartData} outerRadius={100}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis />
            <Radar
              name="Count"
              dataKey="value"
              stroke="var(--color-sales)"
              fill="var(--color-sales)"
              fillOpacity={0.3}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
