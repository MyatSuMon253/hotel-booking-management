import { gql } from "@apollo/client";

export const CREATE_MEMBERSHIP_TIER = gql`
  mutation CreateMembershipTier($membershipTierInput: MembershipTierInput!) {
    createMembershipTier(membershipTierInput: $membershipTierInput)
  }
`;

export const UPDATE_MEMBERSHIP_TIER = gql`
  mutation UpdateMembershipTier(
    $membershipTierId: ID!
    $membershipTierInput: UpdateMembershipTierInput!
  ) {
    updateMembershipTier(
      membershipTierId: $membershipTierId
      membershipTierInput: $membershipTierInput
    )
  }
`;

export const DELETE_MEMBERSHIP_TIER = gql`
  mutation DeleteMembershipTier($membershipTierId: ID!) {
    deleteMembershipTier(membershipTierId: $membershipTierId)
  }
`;
