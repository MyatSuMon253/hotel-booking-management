import { useQuery } from "@apollo/client";
import { Link } from "react-router";
import Loader from "../common/Loader";
import NotFound from "../common/NotFound";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { GET_AVAILABLE_BUFFET_DINNERS } from "@/graphql/queries/buffet";
import type { BuffetDinner } from "@/types/buffet";

function BuffetListPage() {
  const { data, loading, error } = useQuery(GET_AVAILABLE_BUFFET_DINNERS);

  if (loading) return <Loader />;
  if (error) return <NotFound />;

  const buffetDinners: BuffetDinner[] = data?.getAvailableBuffetDinners ?? [];

  return (
    <section className="layout">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold">Buffet Dinners</h2>
          <p className="text-sm text-muted-foreground">
            Reserve seats for upcoming hotel dinner events.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {buffetDinners.map((buffetDinner) => (
          <Card key={buffetDinner.id}>
            {buffetDinner.imageUrl && (
              <img
                src={buffetDinner.imageUrl}
                alt={buffetDinner.title}
                className="h-40 w-full rounded-t-lg object-cover"
              />
            )}
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{buffetDinner.title}</CardTitle>
                <Badge variant="outline">{buffetDinner.cuisineCategory}</Badge>
              </div>
              <CardDescription>
                {formatDateTime(buffetDinner.startsAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {buffetDinner.description}
              </p>
              <div className="text-sm">
                <p>
                  <span className="font-medium">Price:</span> $
                  {buffetDinner.pricePerGuest.toFixed(2)} per guest
                </p>
                <p>
                  <span className="font-medium">Seats left:</span>{" "}
                  {buffetDinner.remainingCapacity}
                </p>
              </div>
              <Button asChild disabled={buffetDinner.remainingCapacity <= 0}>
                <Link to={`/buffets/${buffetDinner.id}`}>
                  {buffetDinner.remainingCapacity > 0 ? "View and book" : "Full"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        {buffetDinners.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-8 text-center text-muted-foreground">
              No upcoming buffet dinners are available.
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

function formatDateTime(value: string) {
  const date = parseGraphQLDate(value);
  return date ? date.toLocaleString() : "-";
}

function parseGraphQLDate(value: string) {
  const date = new Date(/^\d+$/.test(String(value)) ? Number(value) : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default BuffetListPage;
