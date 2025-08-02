import { GET_ALL_ROOMS } from "@/graphql/queries/room"
import type { Room } from "@/types/room"
import { useQuery } from "@apollo/client"
import RoomCard from "../home/RoomCard"

const HomePage = () => {
  const { data, loading, error } = useQuery(GET_ALL_ROOMS)

  return (
    <main className="layout">
      <div>
        <h1 className="text-2xl font-bold">Top trending hotel in Myanmar</h1>
        <p className="text-sm font-medium text-muted-foreground">
          Discover the most trending hotels for unforgettable experience.{" "}
        </p>
      </div>
      <div className="mt-10">
        {loading && <p>Loading ...</p>}
        {!loading && data?.getAllRooms && (
          <section className="grid grid-cols-4 gap-4">
            {data?.getAllRooms?.map((room: Room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </section>
        )}
      </div>
    </main>
  )
}

export default HomePage