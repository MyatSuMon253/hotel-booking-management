import { Link, useNavigate } from "react-router";
import {
  isAuthenticatedVar,
  isLoadingVar,
  userInfoVar,
} from "@/apollo/apollo-vars";
import { CURRENT_USER, LOGOUT } from "@/graphql/queries/user";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const navigate = useNavigate();

  const { data, loading } = useQuery(CURRENT_USER, {
    onCompleted: (data) => {
      userInfoVar(data.currentUser);
      isAuthenticatedVar(true);
      isLoadingVar(false);
    },
    onError: () => {
      userInfoVar(null);
      isAuthenticatedVar(false);
      isLoadingVar(false);
    },
  });

  const [logout] = useLazyQuery(LOGOUT, {
    onCompleted: () => {
      navigate(0);
    },
  });

  const logoutHandler = () => {
    logout();
  };

  return (
    <nav className="flex items-center justify-between layout py-10">
      <Link to="/" className="text-4xl font-extrabold">
        Bagan Hotel
      </Link>
      <div className="space-x-4">
        {loading && <span>...</span>}
        {!loading && data?.currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-1">
              <Avatar className="w-10 h-10">
                <AvatarImage src={data.currentUser.avatar.url} />
                <AvatarFallback className="bg-black text-white font-bold">
                  {data.currentUser.name.substring(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <h2 className="text-sm font-bold">{data.currentUser.name}</h2>
                <p className="text-xs font-medium text-gray-600">
                  {data.currentUser.email}
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={"/profile"}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logoutHandler}>
                <span className="text-red-600">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button asChild>
              <Link to={"/login"}>Login</Link>
            </Button>
            <Button variant={"outline"} asChild>
              <Link to={"/register"}>Register</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
