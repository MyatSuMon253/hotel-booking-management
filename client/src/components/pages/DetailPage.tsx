import { GET_SINGLE_ROOM } from "@/graphql/queries/room";
import { useQuery } from "@apollo/client";
import { AirVent, Soup, WavesLadder, Wifi } from "lucide-react";
import { useParams } from "react-router";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Loader from "../common/Loader";
import NotFound from "../common/NotFound";
import BookingForm from "../booking/BookingForm";
import { Badge } from "../ui/badge";
import Reviews from "../review/reviews";
import type { Room } from "@/types/room";

const DetailPage = () => {
  const params = useParams<{ id: string }>();

  const { data, loading, error, refetch } = useQuery(GET_SINGLE_ROOM, {
    variables: {
      roomId: params.id,
      getBookedDatesByIdRoomId2: params.id,
      reviewRoomId: params.id,
    },
  });
  console.log(data);

  const room: Room | undefined = data?.getRoomById;

  const disabledDates = data?.getBookedDatesById;

  const items = room
    ? [
        {
          value: "Wifi",
          icon: <Wifi />,
        },
        {
          value: "A/C",
          icon: <AirVent />,
        },
        {
          value: "Breakfast",
          icon: <Soup />,
        },
        {
          value: "Pool",
          icon: <WavesLadder />,
        },
      ]
    : [];

  if (error?.graphQLErrors[0]?.extensions?.code === "NOT_FOUND") {
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
                {/* <Badge variant={"outline"} className="text-xs">
                  <MapPin /> <span>{room?.location}</span>
                </Badge> */}
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
                {items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center flex-col text-muted-foreground"
                  >
                    {item?.icon}
                    <span className="text-sm font-medium">{item?.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-yellow-900 font-medium text-sm">
                Reviews ({room?.reviews?.length || 0})
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
