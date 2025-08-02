// import { GET_SINGLE_ROOM } from "@/graphql/queries/room";
import { useQuery } from "@apollo/client";
import { BadgeCheck, CircleX, Hash, House, MapPin, Users } from "lucide-react";
import { useParams } from "react-router";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import Loader from "../common/Loader";
// import NotFound from "../common/NotFound";
import { GET_ROOM_BY_ID } from "@/graphql/queries/room";
import type { Room } from "@/types/room";
import Loader from "../common/Loader";
import NotFound from "../common/NotFound";

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
    <main className="layout">
      {loading && <Loader />}
      {!loading && data?.getRoomById && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            {/* <Carousel>
              <CarouselContent>
                {room?.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={img.url}
                      alt={img.public_id}
                      className="aspect-square object-cover rounded-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel> */}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{room?.title}</h2>
            <div className=" flex items-center text-sm font-medium text-gray-400">
              <Hash className="w-5 h-5" /> {room?.roomNumber}
              {room?.isAvailable ? (
                <BadgeCheck className="w-5 h-5 text-green-500 ms-2" />
              ) : (
                <CircleX className="w-5 h-5 text-red-500 ms-2" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-400 mt-4">
              {room?.description}
            </p>
            <p className="text-3xl font-bold my-4">${room?.pricePerNight}</p>
            <div className="flex items-center justify-center gap-10 border-2 border-gray-400 rounded-md p-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center flex-col"
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-yellow-900 font-medium text-sm">
              Reviews ({room?.reviews.length})
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default DetailPage;