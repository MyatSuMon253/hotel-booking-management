import { cn } from "@/lib/utils";
import React from "react";
import { NavLink } from "react-router";

interface Props {
  children: React.ReactNode;
}

const CONTROLS = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    label: "Manage Rooms",
    path: "/admin/rooms",
  },
  {
    label: "Manage Bookings",
    path: "/admin/bookings",
  },
  {
    label: "Manage Reviews",
    path: "/admin/reviews",
  },
];

function AdminLayout({ children }: Props) {
  return (
    <main className="layout grid grid-cols-5 gap-4">
      <div className=" flex flex-col col-span-1 gap-2">
        {CONTROLS.map((ctr) => (
          <NavLink
            to={ctr.path}
            key={ctr.path}
            className={({ isActive }: { isActive: boolean }) =>
              cn(
                "p-2 border-b-2 border-b-gray-300",
                isActive && "bg-primary text-white",
              )
            }
          >
            {ctr.label}
          </NavLink>
        ))}
      </div>
      <div className="col-span-4">{children}</div>
    </main>
  );
}

export default AdminLayout;
