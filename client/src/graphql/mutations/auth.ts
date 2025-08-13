import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation Mutation($userInput: UserInput!) {
    register(userInput: $userInput) {
      id
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
    }
  }
`;
