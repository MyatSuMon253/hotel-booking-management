import { gql } from "@apollo/client";

export const CREATE_PROMOTION = gql`
  mutation CreatePromotion($promotionInput: PromotionInput!) {
    createPromotion(promotionInput: $promotionInput)
  }
`;

export const UPDATE_PROMOTION = gql`
  mutation UpdatePromotion(
    $promotionId: ID!
    $promotionInput: PromotionInput!
  ) {
    updatePromotion(promotionId: $promotionId, promotionInput: $promotionInput)
  }
`;

export const DELETE_PROMOTION = gql`
  mutation DeletePromotion($promotionId: ID!) {
    deletePromotion(promotionId: $promotionId)
  }
`;
