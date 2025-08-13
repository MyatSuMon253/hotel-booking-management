import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation Mutation($userInput: UserInput!) {
    register(userInput: $userInput) {
      id
    }
  }
`;
