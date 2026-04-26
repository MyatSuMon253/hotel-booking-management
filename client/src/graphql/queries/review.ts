import { gql } from "@apollo/client";

export const GET_ALL_REVIEWS = gql`
  query Query {
    getAllReviews {
      room {
        id
        title
      }
      user {
        id
        name
        email
      }
      id
      comment
      rating
      createdAt
      updatedAt
    }
  }
`;
