import { GET_ALL_ROOMS } from "@/graphql/queries/room";
import type { Room } from "@/types/room";
import { useQuery } from "@apollo/client";
import RoomCard from "../home/RoomCard";
import Filters from "../common/filters";
import { useSearchParams } from "react-router";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams?.get('filter')

  const variables = {query};
  const { data, loading, error } = useQuery(GET_ALL_ROOMS, { variables });

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
        </div>
      </div>
    </main>
  );
};

export default HomePage;
