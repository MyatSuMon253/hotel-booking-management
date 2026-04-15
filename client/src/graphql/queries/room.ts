import { gql } from "@apollo/client";

export const GET_ALL_ROOMS = gql`
  query GetAllRooms($query: String, $page: Int, $filters: RoomFilters) {
    getAllRooms(query: $query, page: $page, filters: $filters) {
      pagination {
        perPage
        totalRoomCount
      }
      rooms {
        id
        title
        type
        images {
          public_id
          url
        }
        location
        pricePerNight

        ratings {
          value
          count
        }
      }
    }
  }
`;

export const GET_ALL_ROOMS_WITHOUT_FILTERS = gql`
  query Query {
    getAllRoomsWithoutFilters {
      title
      pricePerNight
      location
      type
      id
    }
  }
`;

export const GET_SINGLE_ROOM = gql`
  query Query(
    $roomId: String!
    $getBookedDatesByIdRoomId2: String!
    $reviewRoomId: ID!
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
      reviews {
        id
        user {
          id
          name
        }
        rating
        comment
        createdAt
        updatedAt
      }
      roomNumber
      title
      type
    }
    getBookedDatesById(roomId: $getBookedDatesByIdRoomId2)
    canReview(reviewRoomId: $reviewRoomId)
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
