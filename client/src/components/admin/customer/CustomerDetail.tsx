import { useMemo, type ReactNode } from "react";
import { useQuery } from "@apollo/client";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  ReceiptText,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router";
import Loader from "@/components/common/Loader";
import NotFound from "@/components/common/NotFound";
import AdminLayout from "@/components/layout/AdminLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GET_ALL_BOOKING } from "@/graphql/queries/booking";
import { GET_ALL_REVIEWS } from "@/graphql/queries/review";
import { GET_USER_BY_ID } from "@/graphql/queries/user";
import type { User } from "@/types/user";

interface BookingActivity {
  id: string;
  room?: {
    id: string;
    title: string;
  };
  user?: Pick<User, "id" | "name" | "email">;
  customer: {
    name: string;
    email: string;
  };
  amount: {
    total: number;
    discount?: number;
  };
  paymentInfo?: {
    status?: string;
    method?: string;
  };
  startDate: string;
  endDate: string;
  daysOfRent: number;
  status?: string;
  membershipTier?: string;
  referralCode?: string;
  additionalNote?: string;
  createdAt?: string;
}

interface ReviewActivity {
  id: string;
  user?: Pick<User, "id" | "name" | "email">;
  room?: {
    id: string;
    title: string;
  };
  rating: number;
  comment: string;
  createdAt?: string;
}

interface TimelineItem {
  id: string;
  type: "booking" | "review" | "account";
  title: string;
  description: string;
  date?: string;
}

const membershipLabels: Record<string, string> = {
  silver: "Silver",
  gold: "Gold",
  diamond: "Diamond",
};

function CustomerDetail() {
  const { id } = useParams();

  const {
    data: userData,
    loading: isUserLoading,
    error: userError,
  } = useQuery(GET_USER_BY_ID, {
    variables: { userId: id },
    skip: !id,
  });

  const {
    data: bookingData,
    loading: isBookingLoading,
    error: bookingError,
  } = useQuery(GET_ALL_BOOKING);

  const {
    data: reviewData,
    loading: isReviewLoading,
    error: reviewError,
  } = useQuery(GET_ALL_REVIEWS);

  const customer: User | undefined = userData?.getUserById;
  const bookings: BookingActivity[] = bookingData?.getAllBookings ?? [];
  const reviews: ReviewActivity[] = reviewData?.getAllReviews ?? [];

  const customerBookings = useMemo(() => {
    if (!customer) return [];

    return bookings.filter((booking) => {
      return (
        booking.user?.id === customer.id ||
        booking.customer?.email === customer.email
      );
    });
  }, [bookings, customer]);

  const customerReviews = useMemo(() => {
    if (!customer) return [];

    return reviews.filter((review) => review.user?.id === customer.id);
  }, [customer, reviews]);

  const timeline = useMemo(() => {
    if (!customer) return [];

    const items: TimelineItem[] = [
      {
        id: `account-${customer.id}`,
        type: "account",
        title: "Account created",
        description: `${customer.name} joined Rangoon Heritage.`,
        date: customer.createdAt,
      },
      ...customerBookings.map((booking) => ({
        id: `booking-${booking.id}`,
        type: "booking" as const,
        title: `Booked ${booking.room?.title ?? "a room"}`,
        description: `${capitalize(booking.status ?? "pending")} booking for ${formatMoney(
          booking.amount.total,
        )}.`,
        date: booking.createdAt ?? booking.startDate,
      })),
      ...customerReviews.map((review) => ({
        id: `review-${review.id}`,
        type: "review" as const,
        title: `Reviewed ${review.room?.title ?? "a room"}`,
        description: `${review.rating}/5 rating - ${review.comment}`,
        date: review.createdAt,
      })),
    ];

    return items.sort((a, b) => getTime(b.date) - getTime(a.date));
  }, [customer, customerBookings, customerReviews]);

  if (isUserLoading || isBookingLoading || isReviewLoading) {
    return <Loader />;
  }

  if (!id || userError || bookingError || reviewError || !customer) {
    return <NotFound />;
  }

  const paidBookings = customerBookings.filter(
    (booking) => booking.paymentInfo?.status === "paid",
  );
  const cancelledBookings = customerBookings.filter(
    (booking) => booking.status === "cancelled",
  );
  const totalSpent = paidBookings.reduce(
    (total, booking) => total + booking.amount.total,
    0,
  );
  const totalDiscount = customerBookings.reduce(
    (total, booking) => total + (booking.amount.discount ?? 0),
    0,
  );
  const averageRating =
    customerReviews.length > 0
      ? customerReviews.reduce((total, review) => total + review.rating, 0) /
        customerReviews.length
      : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={customer.avatar?.url} />
              <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h2 className="text-3xl font-bold">{customer.name}</h2>
                <Badge variant={customer.isActive ? "default" : "secondary"}>
                  {customer.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" />
                {customer.email}
              </p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link to="/admin/customers">
              <ArrowLeft className="size-4" />
              Back to customers
            </Link>
          </Button>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<ReceiptText className="size-5" />}
            label="Total spent"
            value={formatMoney(totalSpent)}
            detail={`${paidBookings.length} paid bookings`}
          />
          <MetricCard
            icon={<CalendarDays className="size-5" />}
            label="Bookings"
            value={customerBookings.length.toString()}
            detail={`${cancelledBookings.length} cancelled`}
          />
          <MetricCard
            icon={<Star className="size-5" />}
            label="Reviews"
            value={customerReviews.length.toString()}
            detail={
              averageRating > 0
                ? `${averageRating.toFixed(1)} average rating`
                : "No ratings yet"
            }
          />
          <MetricCard
            icon={<ShieldCheck className="size-5" />}
            label="Discounts"
            value={formatMoney(totalDiscount)}
            detail="Membership and referrals"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer info</CardTitle>
                <CardDescription>
                  Account, role, and membership details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow label="Customer ID" value={customer.id} />
                <InfoRow
                  label="Role"
                  value={customer.role?.join(", ") || "user"}
                />
                <InfoRow
                  label="Joined"
                  value={formatDate(customer.createdAt)}
                />
                <InfoRow
                  label="Last updated"
                  value={formatDate(customer.updatedAt)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership</CardTitle>
                <CardDescription>
                  Current customer tier and related activity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tier</p>
                    <p className="text-2xl font-semibold">
                      {formatMembership(customer.membershipTier)}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {customer.membershipTier ? "Member" : "No tier"}
                  </Badge>
                </div>
                <InfoRow
                  label="Membership bookings"
                  value={customerBookings
                    .filter((booking) => booking.membershipTier)
                    .length.toString()}
                />
                <InfoRow
                  label="Referral bookings"
                  value={customerBookings
                    .filter((booking) => booking.referralCode)
                    .length.toString()}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>
                Account events, bookings, payments, and reviews.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timeline.length > 0 ? (
                <div className="space-y-4">
                  {timeline.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[32px_1fr] gap-3 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        {getTimelineIcon(item.type)}
                      </div>
                      <div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(item.date)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No activity recorded for this customer." />
              )}
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Booking history</CardTitle>
            <CardDescription>
              Rooms, dates, payment state, and booking notes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customerBookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Stay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">
                          {booking.room?.title ?? "Room unavailable"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {booking.additionalNote || "No note"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{formatDateRange(booking.startDate, booking.endDate)}</div>
                        <div className="text-xs text-muted-foreground">
                          {booking.daysOfRent} nights
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBookingVariant(booking.status)}>
                          {capitalize(booking.status ?? "pending")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant={
                              booking.paymentInfo?.status === "paid"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {capitalize(booking.paymentInfo?.status ?? "pending")}
                          </Badge>
                          <Badge variant="outline">
                            {booking.paymentInfo?.method ?? "cash"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatMoney(booking.amount.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState message="This customer has no bookings yet." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>
              Feedback submitted by this customer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customerReviews.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {customerReviews.map((review) => (
                  <div key={review.id} className="rounded-md border p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-medium">
                        {review.room?.title ?? "Room unavailable"}
                      </p>
                      <Badge variant="outline">{review.rating}/5</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="This customer has not posted reviews." />
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}

function MetricCard({ icon, label, value, detail }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <div className="rounded-md bg-muted p-2 text-muted-foreground">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="max-w-[70%] break-words text-right text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function getTimelineIcon(type: TimelineItem["type"]) {
  if (type === "booking") return <ReceiptText className="size-4" />;
  if (type === "review") return <Star className="size-4" />;
  return <UserRound className="size-4" />;
}

function getBookingVariant(
  status?: string,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "confirmed" || status === "completed") return "default";
  if (status === "cancelled") return "destructive";
  return "secondary";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatMembership(tier?: string) {
  if (!tier) return "None";
  return membershipLabels[tier] ?? capitalize(tier);
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
}

function formatDateRange(startDate?: string, endDate?: string) {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function formatDate(value?: string) {
  const date = parseDate(value);
  if (!date) return "Not recorded";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getTime(value?: string) {
  return parseDate(value)?.getTime() ?? 0;
}

function parseDate(value?: string) {
  if (!value) return null;

  const date = /^\d+$/.test(value)
    ? new Date(Number(value))
    : new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default CustomerDetail;
