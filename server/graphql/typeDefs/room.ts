import gql from "graphql-tag";

export const roomTypeDefs = gql`
  type RoomImage {
    url: String!
    public_id: String!
  }

  type Room {
    id: ID!
    title: String!
    description: String!
    roomNumber: String!
    type: String!
    pricePerNight: Float!
    capacity: Int!
    location: String!
    isAvailable: Boolean!
    images: [RoomImage]
    reviews: [String]
    createdAt: String
    updatedAt: String
  }

  input RoomInput {
    title: String!
    description: String!
    roomNumber: String!
    type: String!
    pricePerNight: Float!
    capacity: Int!
    location: String!
    isAvailable: Boolean!
    images: [String]
    reviews: [String]
  }

  input PriceFilter {
    gt: Int
    gte: Int
    lt: Int
    lte: Int
  }

  input RoomFilters {
    type: String
    pricePerNight: PriceFilter
    capacity: Int
    isAvailable: Boolean
    location: String
  }

  type Query {
    getAllRooms(query: String, filters: RoomFilters): [Room]
    getRoomById(roomId: String!): Room
  }

  type Mutation {
    createNewRoom(roomInput: RoomInput!): Room!
    updateRoom(roomId: ID!, roomInput: RoomInput!): String!
    deleteRoom(roomId: ID!): String!
  }
`;
