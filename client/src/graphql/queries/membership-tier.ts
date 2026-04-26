import { gql } from "@apollo/client";

export const GET_ALL_MEMBERSHIP_TIERS = gql`
  query GetAllMembershipTiers {
    getAllMembershipTiers {
      id
      name
      discountPercentage
      active
      createdAt
      updatedAt
    }
  }
`;

export const GET_MEMBERSHIP_TIER_BY_ID = gql`
  query GetMembershipTierById($membershipTierId: ID!) {
    getMembershipTierById(membershipTierId: $membershipTierId) {
      id
      name
      discountPercentage
      active
      createdAt
      updatedAt
    }
  }
`;
