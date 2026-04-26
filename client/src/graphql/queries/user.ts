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
      isActive
      createdAt
      updatedAt
    }
  }
`;
