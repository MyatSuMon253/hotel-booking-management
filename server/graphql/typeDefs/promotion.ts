import gql from "graphql-tag";

export const promotionTypeDefs = gql`
  input PromotionInput {
    code: String!
    description: String
    discountType: String!
    discountValue: Float!
    validFrom: String!
    validTo: String!
    active: Boolean
    maxUses: Int
  }

  input UpdatePromotionInput {
    code: String
    description: String
    discountType: String
    discountValue: Float
    validFrom: String
    validTo: String
    active: Boolean
    maxUses: Int
  }

  type Promotion {
    id: ID!
    code: String!
    description: String
    discountType: String!
    discountValue: Float!
    validFrom: String!
    validTo: String!
    active: Boolean!
    maxUses: Int
    usedCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getAllPromotions: [Promotion!]!
    getPromotionById(promotionId: ID!): Promotion
  }

  type Mutation {
    createPromotion(promotionInput: PromotionInput!): Boolean
    updatePromotion(
      promotionId: ID!
      promotionInput: UpdatePromotionInput!
    ): Boolean
    deletePromotion(promotionId: ID!): Boolean
  }
`;
