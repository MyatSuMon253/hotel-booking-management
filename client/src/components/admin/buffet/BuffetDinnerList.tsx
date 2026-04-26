import { useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/AdminLayout";
import Loader from "@/components/common/Loader";
import NotFound from "@/components/common/NotFound";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DELETE_BUFFET_DINNER } from "@/graphql/mutations/buffet";
import { GET_ALL_BUFFET_DINNERS } from "@/graphql/queries/buffet";
import type { BuffetDinner } from "@/types/buffet";

function BuffetDinnerList() {
  const { data, loading, error } = useQuery(GET_ALL_BUFFET_DINNERS);
  const [deleteBuffetDinner, { loading: isDeleting }] = useMutation(
    DELETE_BUFFET_DINNER,
    {
      refetchQueries: [{ query: GET_ALL_BUFFET_DINNERS }],
      awaitRefetchQueries: true,
      onCompleted: () => toast.success("Buffet dinner deleted."),
      onError: (err) =>
        toast.error(err.message || "Unable to delete buffet dinner."),
    },
  );

  if (loading) return <Loader />;
  if (error) return <NotFound />;

  const buffetDinners: BuffetDinner[] = data?.getAllBuffetDinners ?? [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Manage Buffet Dinners</h2>
          <p className="text-sm text-muted-foreground">
            Create dated dinner events with menus, facilities, and capacity.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/buffet-dinners/create">Create buffet dinner</Link>
        </Button>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Buffet dinners</CardTitle>
          <CardDescription>
            Manage menus, price, and seat limits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Cuisine</th>
                  <th className="p-3 text-left">Event</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Available</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Manage</th>
                </tr>
              </thead>
              <tbody>
                {buffetDinners.map((buffetDinner) => (
                  <tr key={buffetDinner.id} className="border-t align-top">
                    <td className="p-3 font-medium">{buffetDinner.title}</td>
                    <td className="p-3">{buffetDinner.cuisineCategory}</td>
                    <td className="p-3">
                      {formatDateTime(buffetDinner.startsAt)}
                    </td>
                    <td className="p-3">
                      ${buffetDinner.pricePerGuest.toFixed(2)}
                    </td>
                    <td className="p-3">
                      {buffetDinner.remainingCapacity} /{" "}
                      {buffetDinner.maxCapacity}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={buffetDinner.active ? "default" : "secondary"}
                      >
                        {buffetDinner.active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            to={`/admin/buffet-dinners/edit/${buffetDinner.id}`}
                          >
                            Edit
                          </Link>
                        </Button>
                        <ConfirmDialog
                          title={`Delete "${buffetDinner.title}"?`}
                          description="This removes the buffet dinner. Buffets with bookings cannot be deleted."
                          confirmLabel="Delete buffet"
                          pendingLabel="Deleting..."
                          loading={isDeleting}
                          onConfirm={async () => {
                            await deleteBuffetDinner({
                              variables: { buffetDinnerId: buffetDinner.id },
                            });
                          }}
                          trigger={
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isDeleting}
                            >
                              Delete
                            </Button>
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {buffetDinners.length === 0 && (
                  <tr>
                    <td className="p-6 text-center" colSpan={7}>
                      No buffet dinners yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

function formatDateTime(value: string) {
  const date = parseGraphQLDate(value);
  if (!date) return "-";
  return date.toLocaleString();
}

function parseGraphQLDate(value: string) {
  const date = new Date(/^\d+$/.test(String(value)) ? Number(value) : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default BuffetDinnerList;
