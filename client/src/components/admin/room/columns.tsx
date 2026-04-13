import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Room } from "@/types/room";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";

export const columns: ColumnDef<Room>[] = [
  {
    accessorKey: "title",
    header: "Name",
    cell: ({ row }) => (
      <Link to={`/rooms/${row.original.id}`} className="font-medium">
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <Badge>{row.original.location}</Badge>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <Badge variant={"outline"}>{row.original.type}</Badge>,
  },
  {
    accessorKey: "pricePerNight",
    header: "Per Night",
    cell: ({ row }) => (
      <p className="text-sm font-medium">${row.original.pricePerNight}.00</p>
    ),
  },
  {
    id: "actions",
    header: "Manage",
    cell: ({ row }) => {
      return (
        <div className="space-x-3">
          <Button size={"sm"} variant={"outline"} asChild>
            <Link to={`/admin/rooms/edit/${row.original.id}`}>Edit</Link>
          </Button>
          <Button size={"sm"} variant={"destructive"}>
            Delete
          </Button>
        </div>
      );
    },
  },
];
