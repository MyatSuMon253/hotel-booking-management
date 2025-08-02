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

  type Query{
    getAllRooms: [Room]
    getRoomById(roomId: String!): Room
  }

  type Mutation {
    createNewRoom(roomInput: RoomInput!): Room!
    updateRoom(roomId: ID!, roomInput: RoomInput!): String!
    deleteRoom(roomId: ID!): String!
  }
`;