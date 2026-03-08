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

export const GET_ROOM_BY_ID = gql`
  query GetRoomById($roomId: String!) {
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
  }
`;
