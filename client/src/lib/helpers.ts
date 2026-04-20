import { differenceInDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";

const VALID_REFERRAL_CODES = ["HOTEL5", "WELCOME5", "REFERRAL5"];
export const REFERRAL_DISCOUNT_PERCENT = 0.05;

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

export const getMembershipDiscountPercent = (tier?: string) => {
  if (!tier) return 0;

  switch (tier) {
    case "silver":
      return 0.1;
    case "gold":
      return 0.2;
    case "diamond":
      return 0.3;
    default:
      return 0;
  }
};

export const isReferralCodeValid = (code?: string) => {
  if (!code) return false;
  return VALID_REFERRAL_CODES.includes(code.trim().toUpperCase());
};

export const calculateAmount = (
  rentPerDay: number,
  daysOfRent: number,
  discountPercent = 0,
) => {
  const rent = rentPerDay * daysOfRent;
  const tax = rent * 0.05;
  const discount = rent * discountPercent;
  const total = rent + tax - discount;

  return {
    tax,
    rent,
    discount,
    total,
  };
};

export const getDaysOfRent = (range?: DateRange | undefined) => {
  if (!range?.from || !range?.to) return 0;

  const from = new Date(range.from);
  const to = new Date(range.to);

  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  return differenceInDays(to, from);
};

export const adjustTimeZone = (date: Date | undefined) => {
  if (!date) return null;

  const localDate = new Date(date);

  localDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  return localDate;
};

export const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("en-US").format(amount);
};
