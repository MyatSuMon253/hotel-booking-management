import {
  touristAttractions,
  TOURIST_ATTRACTIONS_SOURCE_URL,
} from "@/data/touristAttractions";
import type { TouristAttraction } from "@/types/attraction";
import { Clock, ExternalLink, MapPin, Star, Ticket } from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

function TouristAttractionsPage() {
  return (
    <section>
      <div className="mb-8 flex flex-col gap-3 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold">Tourist Attractions in Yangon</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Popular places near the hotel for guests planning sightseeing,
            shopping, parks, and cultural visits.
          </p>
        </div>
        <Button asChild variant="outline" className="w-fit">
          <a
            href={TOURIST_ATTRACTIONS_SOURCE_URL}
            target="_blank"
            rel="noreferrer"
          >
            View Trip.com guide
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {touristAttractions.map((attraction) => (
          <AttractionCard attraction={attraction} key={attraction.id} />
        ))}
      </div>
    </section>
  );
}

function AttractionCard({ attraction }: AttractionCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={attraction.imageUrl}
          alt={attraction.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              #{attraction.rank}
            </p>
            <CardTitle className="mt-1 text-xl">{attraction.name}</CardTitle>
          </div>
          <Badge variant="outline">{attraction.category}</Badge>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {attraction.location}
          </span>
          <span>{attraction.distanceFromDowntown}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {attraction.rating && (
            <Badge className="gap-1">
              <Star className="h-3.5 w-3.5 fill-current" />
              {attraction.rating.toFixed(1)}
              {attraction.reviewCount && (
                <span className="font-normal">
                  ({attraction.reviewCount} reviews)
                </span>
              )}
            </Badge>
          )}
          {!attraction.rating && attraction.reviewCount && (
            <Badge variant="secondary">{attraction.reviewCount} reviews</Badge>
          )}
          {attraction.isFreeEntry && (
            <Badge variant="secondary" className="gap-1">
              <Ticket className="h-3.5 w-3.5" />
              Free entry
            </Badge>
          )}
          {attraction.openingNote && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3.5 w-3.5" />
              {attraction.openingNote}
            </Badge>
          )}
        </div>

        <ul className="space-y-2 text-sm text-muted-foreground">
          {attraction.highlights.map((highlight) => (
            <li key={highlight} className="leading-6">
              {highlight}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button asChild variant="ghost" className="px-0">
          <a href={attraction.tripUrl} target="_blank" rel="noreferrer">
            Read source
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

interface AttractionCardProps {
  readonly attraction: TouristAttraction;
}

export default TouristAttractionsPage;
