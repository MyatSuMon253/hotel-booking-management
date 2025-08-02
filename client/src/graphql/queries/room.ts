import { gql } from "@apollo/client";

export const GET_ALL_ROOMS = gql`query GetAllRooms {
  getAllRooms {
    id
    images {
      url
    }
    reviews
    pricePerNight
    capacity
    location
  }
}
`