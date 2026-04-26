import { cn } from "@/lib/utils";
import React from "react";
import { NavLink } from "react-router";

interface UserLayoutProps {
  children: React.ReactNode;
}

const CONTROLS = [
  {
    label: "Rooms",
    path: "/",
  },
  {
    label: "Buffet Dinners",
    path: "/buffets",
  },
  {
    label: "My Bookings",
    path: "/bookings",
  },
];

function UserLayout({ children }: UserLayoutProps) {
  return (
    <main className="layout grid grid-cols-5 gap-4">
      <div className="col-span-1 flex flex-col gap-2">
        {CONTROLS.map((control) => (
          <NavLink
            to={control.path}
            key={control.path}
            end={control.path === "/"}
            className={({ isActive }: { isActive: boolean }) =>
              cn(
                "border-b-2 border-b-gray-300 p-2",
                isActive && "bg-primary text-white",
              )
            }
          >
            {control.label}
          </NavLink>
        ))}
      </div>
      <div className="col-span-4">{children}</div>
    </main>
  );
}

export default UserLayout;
