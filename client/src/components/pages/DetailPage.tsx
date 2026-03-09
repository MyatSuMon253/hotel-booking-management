// import { GET_SINGLE_ROOM } from "@/graphql/queries/room";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GET_ROOM_BY_ID } from "@/graphql/queries/room";
import type { Room } from "@/types/room";
import { useQuery } from "@apollo/client";
import { BadgeCheck, CircleX, Hash, House, MapPin, Users } from "lucide-react";
import { useParams } from "react-router";
import Loader from "../common/Loader";
import NotFound from "../common/NotFound";
import BookingForm from "../booking/BookingForm";

const DetailPage = () => {
  const params = useParams<{ id: string }>();

  const { data, loading, error } = useQuery(GET_ROOM_BY_ID, {
    variables: { roomId: params.id },
  });

  const room: Room | undefined = data?.getRoomById;

  const items = room
    ? [
      {
        value: room.capacity,
        icon: <Users className="w-5 h-5" />,
      },
      {
        value: room.type,
        icon: <House className="w-5 h-5" />,
      },
      {
        value: room.location,
        icon: <MapPin className="w-5 h-5" />,
      },
    ]
    : [];

  if (error?.graphQLErrors[0].extensions?.code === "NOT_FOUND") {
    return <NotFound />;
  }

  return (
    <main className="layout mb-20">
      {loading && <Loader />}
      {!loading && data?.getRoomById && (
        <div className="grid grid-cols-8 w-full gap-4">
          <div className="col-span-5">
            <div>
              <Carousel>
                <CarouselContent>
                  {room?.images.map((img, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={img.url}
                        alt={img.public_id}
                        className=" aspect-video object-cover rounded-lg"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold mb-2">{room?.title}</h2>
                <Badge variant={"outline"} className="text-xs">
                  {room?.type}
                </Badge>
                <Badge variant={"outline"} className="text-xs">
                  <MapPin /> <span>{room?.location}</span>
                </Badge>
              </div>

              <p className="text-sm font-medium text-gray-400 mt-4">
                {room?.description}
              </p>
              <p className="text-3xl font-bold my-4">
                ${room?.pricePerNight}{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  /night
                </span>
              </p>
              <div className="grid grid-cols-4 border border-gray-200 rounded-md p-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center flex-col text-muted-foreground"
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-yellow-900 font-medium text-sm">
                Reviews ({room?.reviews.length})
              </p>
              <Reviews
                roomId={room?.id!}
                reviews={room?.reviews!}
                canReview={data?.canReview}
                refetch={refetch}
              />
            </div>
          </div>
          <div className=" col-span-3">
            {room?.isAvailable && (
              <BookingForm
                rentPerDay={room?.pricePerNight!}
                roomId={room?.id!}
                disabledDates={disabledDates}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default DetailPage;