import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { DELETE_ROOM_MUTATION } from "@/graphql/mutations/room";
import { GET_ALL_ROOMS_WITHOUT_FILTERS } from "@/graphql/queries/room";
import type { Room } from "@/types/room";
import { useMutation } from "@apollo/client";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import { toast } from "sonner";

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
      const [deleteRoom, { loading }] = useMutation(DELETE_ROOM_MUTATION, {
        onCompleted: () => {
          toast.success("Room deleted.");
        },
        onError: (err) => toast.error(err.message),
        refetchQueries: [GET_ALL_ROOMS_WITHOUT_FILTERS],
      });

      return (
        <div className="space-x-3">
          <Button size={"sm"} variant={"outline"} asChild>
            <Link to={`/admin/rooms/edit/${row.original.id}`}>Edit</Link>
          </Button>
          <ConfirmDialog
            title={`Delete "${row.original.title}"?`}
            description="This removes the room and its images. Bookings already tied to it are kept for history. This cannot be undone."
            confirmLabel="Delete room"
            pendingLabel="Deleting..."
            loading={loading}
            onConfirm={async () => {
              await deleteRoom({ variables: { roomId: row.original.id } });
            }}
            trigger={
              <Button size={"sm"} variant={"destructive"} disabled={loading}>
                Delete
              </Button>
            }
          />
        </div>
      );
    },
  },
];
