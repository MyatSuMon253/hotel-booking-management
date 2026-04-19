import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#8b5cf6", "#ec4899"];

interface PaymentMethodMetric {
  method: string;
  count: number;
  totalAmount: number;
}

interface Props {
  data?: PaymentMethodMetric[];
}

export function PaymentMethodPieChart({ data = [] }: Props) {
  const chartData = data.map((entry) => ({
    ...entry,
    method: entry.method || "unknown",
  }));

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Distribution of payment type counts.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ChartContainer
          config={{
            count: { label: "Bookings" },
          }}
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="method"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={4}
              stroke="transparent"
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.method} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
