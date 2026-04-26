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
import { GET_ALL_USERS } from "@/graphql/queries/user";
import type { User } from "@/types/user";
import { DataTable } from "./data-table";
import { columns } from "./columns";

function CustomerList() {
  const { data, loading, error } = useQuery(GET_ALL_USERS);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NotFound />;
  }

  const users: User[] =
    data?.getAllUsers?.filter((user: User) => user.role?.includes("user")) ??
    [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Manage Customers</h2>
          <p className="text-sm text-muted-foreground">
            Review all registered customers and modify role or account status.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/dashboard">Back to dashboard</Link>
        </Button>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            View customer accounts and perform admin actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={users} columns={columns} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default CustomerList;
