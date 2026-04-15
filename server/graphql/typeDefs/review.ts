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

  type Query {
    getAllReviews: [Review!]!
    canReview(reviewRoomId: ID!): Boolean
  }

  type Mutation {
    deleteReviewById(reviewId: ID!): Boolean
    createAndUpdateReview(reviewInput: reviewInput!): Review
  }
`;
