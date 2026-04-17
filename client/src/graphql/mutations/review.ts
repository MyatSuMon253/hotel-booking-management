import { gql } from "@apollo/client";

export const CREATE_AND_UPDATE_REVIEW_MUTATION = gql`
  mutation Mutation($reviewInput: reviewInput!) {
    createAndUpdateReview(reviewInput: $reviewInput) {
      id
    }
  }
`;

export const DELETE_REVIEW_BY_ID_MUTATION = gql`
  mutation Mutation($reviewId: ID!) {
    deleteReviewById(reviewId: $reviewId)
  }
`;
