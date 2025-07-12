import gql from "graphql-tag";

export const roomTypeDefs = gql`
  type RoomImages {
    url: String!
    public_id: String!
  }

  type Room {
    id: ID!
    roomNumber: String!
    type: String!
    pricePerNight: Float!
    capacity: Int!
    isAvailable: Boolean!
    images: [RoomImages]
    reviews: [String]
    createdAt: String
    updatedAt: String
  }

  type Query{
    getAllRooms:String
  }
`;