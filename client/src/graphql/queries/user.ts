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
