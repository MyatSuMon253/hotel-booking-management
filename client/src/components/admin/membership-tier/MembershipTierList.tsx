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
import { GET_ALL_MEMBERSHIP_TIERS } from "@/graphql/queries/membership-tier";
import type { MembershipTier } from "@/types/membership-tier";
import { columns } from "./columns";
import { DataTable } from "./data-table";

function MembershipTierList() {
  const { data, loading, error } = useQuery(GET_ALL_MEMBERSHIP_TIERS);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NotFound />;
  }

  const membershipTiers: MembershipTier[] = data?.getAllMembershipTiers ?? [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Manage Membership Tiers</h2>
          <p className="text-sm text-muted-foreground">
            Maintain silver, gold, and diamond booking discounts.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/membership-tiers/create">Create tier</Link>
        </Button>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Membership tiers</CardTitle>
          <CardDescription>
            Configure tier names, discount percentages, and active status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={membershipTiers} columns={columns} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default MembershipTierList;
