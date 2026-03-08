import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { LucideSearch, LucideX } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { updateSearchParams } from "@/lib/helpers";

const Filters = () => {
  const [searchKey, setSearchKey] = useState<string>("");
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchKey.trim() === "") {
      return;
    }

    searchParams = updateSearchParams(searchParams, "filter", searchKey);
    const url = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(url);
  };

  const handleClear = () => {
    setSearchKey("");
    searchParams.delete("filter");
    const url = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(url);
  };

  return (
    <Card className="col-span-1 h-fit">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Filter & find your place</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="relative" onSubmit={handleSubmit}>
          <Input
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="pl-8"
            placeholder="Type and enter to find"
          />
          <LucideSearch className="absolute top-2 left-2 h-5 w-5 cursor-pointer" />
          <LucideX
            className={`absolute top-2 right-2 h-5 w-5 cursor-pointer ${searchKey.trim().length > 0 ? "block" : "hidden"}`}
            onClick={handleClear}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default Filters;
