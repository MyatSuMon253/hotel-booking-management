import { Card, CardHeader } from "@/components/ui/card";
import { formatAmount } from "@/lib/helpers";

interface Props {
  label: string;
  value: number;
  isNumber?: boolean;
}

function StatusCard({ label, value, isNumber = true }: Props) {
  const amount = value ?? 0;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-medium">{label}</h2>
        <p className="text-lg text-gray-500">
          {isNumber && "$ "}
          {formatAmount(amount)}
          {isNumber && ".00"}
        </p>
      </CardHeader>
    </Card>
  );
}

export default StatusCard;
