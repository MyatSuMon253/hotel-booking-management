import { gql } from "@apollo/client";

export const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      name
      email
      avatar {
        url
        public_id
      }
      role
      membershipTier
      referralCode
      referralPoints
      createdAt
      updatedAt
    }
  }
`;

export const LOGOUT = gql`
  query Query {
    logout
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
      role
      membershipTier
      referralCode
      referralPoints
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: ID!) {
    getUserById(userId: $userId) {
      id
      name
      email
      avatar {
        url
        public_id
      }
      role
      membershipTier
      referralCode
      referralPoints
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const VALIDATE_REFERRAL_CODE = gql`
  query ValidateReferralCode($code: String!) {
    validateReferralCode(code: $code) {
      isValid
      ownerName
    }
  }
`;
