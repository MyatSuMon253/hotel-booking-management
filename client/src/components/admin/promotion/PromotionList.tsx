import { useQuery } from "@apollo/client";
import { Link } from "react-router";
import AdminLayout from "@/components/layout/AdminLayout";
import Loader from "@/components/common/Loader";
import NotFound from "@/components/common/NotFound";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GET_ALL_PROMOTIONS } from "@/graphql/queries/promotion";
import type { Promotion } from "@/types/promotion";
import { DataTable } from "./data-table";
import { columns } from "./columns";

function PromotionList() {
  const { data, loading, error } = useQuery(GET_ALL_PROMOTIONS);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NotFound />;
  }

  const promotions: Promotion[] = data?.getAllPromotions ?? [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Manage Promotions</h2>
          <p className="text-sm text-muted-foreground">
            Create and maintain discount codes for hotel bookings.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/promotions/create">Create new promotion</Link>
        </Button>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Promotions</CardTitle>
          <CardDescription>
            Manage codes, discounts, and active promotions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={promotions} columns={columns} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default PromotionList;
