import gql from "graphql-tag";

export const reviewTypeDefs = gql`
  type Review {
    id: ID
    user: User
    room: Room
    rating: Int
    comment: String
    createdAt: String
    updatedAt: String
  }

  input reviewInput {
    rating: Int!
    comment: String!
    roomId: ID!
  }

  type Mutation {
    createAndUpdateReview(reviewInput: reviewInput!): Review
  }
`;
