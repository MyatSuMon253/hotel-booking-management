import gql from "graphql-tag";

export const membershipTierTypeDefs = gql`
  input MembershipTierInput {
    name: String!
    discountPercentage: Float!
    active: Boolean
  }

  input UpdateMembershipTierInput {
    name: String
    discountPercentage: Float
    active: Boolean
  }

  type MembershipTier {
    id: ID!
    name: String!
    discountPercentage: Float!
    active: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getAllMembershipTiers: [MembershipTier!]!
    getMembershipTierById(membershipTierId: ID!): MembershipTier
  }

  type Mutation {
    createMembershipTier(membershipTierInput: MembershipTierInput!): Boolean
    updateMembershipTier(
      membershipTierId: ID!
      membershipTierInput: UpdateMembershipTierInput!
    ): Boolean
    deleteMembershipTier(membershipTierId: ID!): Boolean
  }
`;
