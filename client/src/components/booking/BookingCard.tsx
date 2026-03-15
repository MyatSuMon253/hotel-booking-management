import React from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";

interface Props {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

function BookingCard({ label, value, icon }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{label || "Default title"}</CardTitle>
          {icon}
        </div>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </CardHeader>
    </Card>
  );
}

export default BookingCard;
