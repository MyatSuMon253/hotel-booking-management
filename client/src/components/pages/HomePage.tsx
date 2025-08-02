import { GET_ALL_ROOMS } from "@/graphql/queries/room"
import { useQuery } from "@apollo/client"

const HomePage = () => {
  const { data, loading, error } = useQuery(GET_ALL_ROOMS)
  
  console.log(data, loading, error)
  
  return (
    <main className="layout">
      <h1>HomePage</h1>
    </main>
  )
}

export default HomePage