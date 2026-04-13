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
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useQuery } from "@apollo/client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import type { Room } from "@/types/room";
import { GET_ALL_ROOMS } from "@/graphql/queries/room";

function RoomList() {
  const { data, loading, error } = useQuery(GET_ALL_ROOMS);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NotFound />;
  }
  console.log(data);

  const rows: Room[] =
    data?.getAllRooms?.rooms?.map((room: any) => ({
      id: room.id,
      title: room.title,
      location: room.location,
      pricePerNight: room.pricePerNight,
      type: room.type,
    })) ?? [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Manage Room</h2>
        <Button asChild>
          <Link to={"/admin/rooms/create"}>Create new room</Link>
        </Button>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All room</CardTitle>
          <CardDescription>View rooms & manage.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={rows} columns={columns} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default RoomList;
