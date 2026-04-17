import { gql } from "@apollo/client";

export const GET_ALL_REVIEWS = gql`
  query Query {
    getAllReviews {
      room {
        title
      }
      id
      comment
      rating
    }
  }
`;
 