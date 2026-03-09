import { format } from "date-fns";

export const updateSearchParams = (
  searchParams: URLSearchParams,
  key: string,
  value: string,
) => {
  if (searchParams.has(key)) {
    searchParams.set(key, value);
  } else {
    searchParams.append(key, value);
  }

  return searchParams;
};

export const formatDate = (date: Date | string) => {
  if (typeof date === "string") {
    date = new Date(parseInt(date));
  }

  return format(date, "yyyy, MM-dd");
};
