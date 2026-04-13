import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { LucideSearch, LucideX } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { updateSearchParams } from "@/lib/helpers";
import { Locations, Types } from "@/lib/filterData";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

const Filters = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const location = useLocation();
  const [searchKey, setSearchKey] = useState<string>("");

  const [filters, setFilters] = useState({
    location: searchParams.get("location"),
    type: searchParams.get("type"),
    capacity: searchParams.get("capacity"),
    available: searchParams.get("available"),
  });

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
  };

  const updateURL = (filters: any) => {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams = updateSearchParams(searchParams, key, value as string);
      } else {
        searchParams.delete(key);
      }

      const url = `${window.location.pathname}?${searchParams.toString()}`;
      navigate(url);
    });
  };

  const handleCheckboxClick = (filterType: string, value: any) => {
    setFilters((prev: any) => {
      const updatedFilters = {
        ...prev,
        [filterType]: prev[filterType] === value ? null : value,
      };

      updateURL(updatedFilters);
      return updatedFilters;
    });
  };

  useEffect(() => {
    if (searchKey.trim().length === 0) {
      searchParams.delete("filter");
      const url = `${window.location.pathname}?${searchParams.toString()}`;
      navigate(url);
    }
  }, [searchKey]);

  useEffect(() => {
    if (location.pathname === "/" && !location.search) {
      setFilters({
        location: null,
        type: null,
        capacity: null,
        available: null,
      });
    }
  }, [location]);

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
        <h2 className="font-semibold mt4 mb-2">Location</h2>
        <div className="space-y-2">
          {Locations?.map((loc, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                checked={loc === filters.location}
                onCheckedChange={() => handleCheckboxClick("location", loc)}
              />
              <span className="text-sm font-medium text-gray-500">{loc}</span>
            </div>
          ))}
        </div>
        <h2 className="font-semibold mt4 mb-2">Type</h2>
        <div className="space-y-2">
          {Types?.map((type, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                checked={type === filters.type}
                onCheckedChange={() => handleCheckboxClick("type", type)}
              />
              <span className="text-sm font-medium text-gray-500">{type}</span>
            </div>
          ))}
        </div>
        <h2 className="font-semibold mt4 mb-2">Available</h2>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={filters.available === "true"}
            onCheckedChange={() => handleCheckboxClick("available", "true")}
          />
          <span className="text-sm font-medium text-gray-500">
            Only show available rooms
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Filters;
