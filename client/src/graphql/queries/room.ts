import { gql } from "@apollo/client";

export const GET_ALL_ROOMS = gql`query GetAllRooms {
  getAllRooms {
    id,
    title,
    description,
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

export const GET_ROOM_BY_ID = gql`query GetRoomById($roomId: String!) {
  getRoomById(roomId: $roomId) {
    id
    title
    description
    roomNumber
    type
    pricePerNight
    capacity
    location
    isAvailable
    images {
      url
      public_id
    }
    reviews
  }
}`