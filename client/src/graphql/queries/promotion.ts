import { gql } from "@apollo/client";

export const GET_ALL_PROMOTIONS = gql`
  query GetAllPromotions {
    getAllPromotions {
      id
      code
      description
      discountType
      discountValue
      validFrom
      validTo
      active
      maxUses
      usedCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROMOTION_BY_ID = gql`
  query GetPromotionById($promotionId: ID!) {
    getPromotionById(promotionId: $promotionId) {
      id
      code
      description
      discountType
      discountValue
      validFrom
      validTo
      active
      maxUses
      usedCount
      createdAt
      updatedAt
    }
  }
`;
