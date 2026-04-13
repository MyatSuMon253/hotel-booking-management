import { GET_ALL_ROOMS } from "@/graphql/queries/room";
import type { Room } from "@/types/room";
import { useQuery } from "@apollo/client";
import { useSearchParams } from "react-router";

import RoomCard from "../home/RoomCard";
import Pagination from "../common/Pagination";
import Filters from "../common/Filters";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams?.get("filter");
  const location = searchParams.get("location");
  const type = searchParams.get("type");
  const capacity = searchParams.get("capacity");
  const isAvailable = searchParams.get("available");
  const page = parseInt(searchParams.get("page") || "1", 10);

  const filters = {
    ...(location && { location }),
    ...(type && { type }),
    ...(capacity && { capacity: parseInt(capacity) }),
    ...(isAvailable !== null && { isAvailable: isAvailable === "true" }),
  };

  const variables = { query, filters, page };
  const { data, loading } = useQuery(GET_ALL_ROOMS, { variables });

  return (
    <main className="layout grid grid-cols-4 gap-6">
      <Filters />

      <div className="col-span-3">
        <h1 className="text-2xl font-bold">Top trending hotel in Myanmar</h1>
        <p className="text-sm font-medium text-muted-foreground">
          Discover the most trending hotels for unforgettable experience.{" "}
        </p>

        <div className="mt-10">
          {loading && <p>Loading ...</p>}
          {!loading && data?.getAllRooms && (
            <section className="grid grid-cols-3 gap-4">
              {data?.getAllRooms?.rooms?.map((room: Room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </section>
          )}
          {data?.getAllRooms?.rooms?.length === 0 && (
            <h3 className="text-4xl">Room Not Found</h3>
          )}
        </div>
        {data?.getAllRooms?.pagination?.totalRoomCount >
          data?.getAllRooms?.pagination?.perPage && (
          <Pagination
            totalRoomCount={data?.getAllRooms?.pagination?.totalRoomCount}
            perPage={data?.getAllRooms?.pagination?.perPage}
          />
        )}
      </div>
    </main>
  );
};

export default HomePage;
