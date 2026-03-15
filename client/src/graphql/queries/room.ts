import { gql } from "@apollo/client";

export const GET_ALL_ROOMS = gql`
  query GetAllRooms($page: Int, $query: String, $filters: RoomFilters) {
    getAllRooms(page: $page, query: $query, filters: $filters) {
      pagination {
        totalRoomCount
        perPage
      }
      rooms {
        id
        title
        description
        images {
          url
        }
        reviews
        pricePerNight
        capacity
        location
        isAvailable
      }
    }
  }
`;

export const GET_SINGLE_ROOM = gql`
  query Query(
    $roomId: String!
    $getBookedDatesByIdRoomId2: String!
  ) {
    getRoomById(roomId: $roomId) {
      capacity
      description
      id
      type
      images {
        public_id
        url
      }
      isAvailable
      location
      pricePerNight
      roomNumber
      title
      type
    }
    getBookedDatesById(roomId: $getBookedDatesByIdRoomId2)
  }
`;

export const GET_ROOM_BY_ID = gql`
  query Query($roomId: String!) {
    getRoomById(roomId: $roomId) {
      title
      type
      roomNumber
      pricePerNight
      location
      isAvailable
      images {
        url
        public_id
      }
      id
      description
      capacity
    }
  }
`;
