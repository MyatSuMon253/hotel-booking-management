import { Link } from "react-router";
import { Button } from "../ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  return (
    <nav className="flex items-center justify-between layout">
      <Link to="/" className="text-4xl font-extrabold">
        Bagan Hotel
      </Link>
      <div className="space-x-4">
        <h1>Header</h1>
      </div>
      <div>
        <Button asChild>
          <Link to={"/login"}>Login</Link>
        </Button>
        <Button variant={"outline"} asChild>
          <Link to={"/register"}>Register</Link>
        </Button>
      </div>
    </nav >
  );
};

export default Header;