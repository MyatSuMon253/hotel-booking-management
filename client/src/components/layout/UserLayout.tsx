import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../ui/button";

interface UserLayoutProps {
  children: React.ReactNode;
}

const CONTROLS = [
  {
    label: "Rooms",
    path: "/",
    activePaths: ["/", "/rooms"],
  },
  {
    label: "Buffet Dinners",
    path: "/buffets",
    activePaths: ["/buffets", "/buffet-bookings"],
  },
  {
    label: "Attractions",
    path: "/attractions",
    activePaths: ["/attractions"],
  },
  {
    label: "My Bookings",
    path: "/bookings",
    activePaths: ["/bookings", "/invoice"],
  },
];

function UserLayout({ children }: UserLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <main className="layout grid grid-cols-5 gap-4">
      <div className="col-span-1 flex flex-col gap-2">
        {CONTROLS.map((control) => {
          const isActive = control.activePaths.some((path) => {
            if (path === "/") return location.pathname === "/";
            return location.pathname.startsWith(path);
          });

          return (
            <Link
              to={control.path}
              key={control.path}
              className={cn(
                "border-b-2 border-b-gray-300 p-2",
                isActive && "bg-primary text-white",
              )}
            >
              {control.label}
            </Link>
          );
        })}
      </div>
      <div className="col-span-4">
        <Button
          type="button"
          variant="ghost"
          className="mb-4 px-0"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {children}
      </div>
    </main>
  );
}

export default UserLayout;
