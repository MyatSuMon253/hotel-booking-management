import Loader from "@/components/common/Loader";
import NotFound from "@/components/common/NotFound";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IReview } from "@/types/review";
import { useQuery } from "@apollo/client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { GET_ALL_REVIEWS } from "@/graphql/queries/review";

function ReviewList() {
  const { data, loading, error } = useQuery(GET_ALL_REVIEWS);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NotFound />;
  }

  const rows: IReview[] =
    data?.getAllReviews?.map((review: any) => ({
      id: review?.id,
      roomTitle: review?.room.title,
      comment: review?.comment,
      rating: review?.rating,
    })) ?? [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Manage reviews</h2>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All reviews</CardTitle>
          <CardDescription>View all reviews & manage.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={rows} columns={columns} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default ReviewList;
