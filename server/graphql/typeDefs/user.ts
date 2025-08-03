import gql from "graphql-tag";

export const userTypeDefs = gql`
  type Avatar {
    url: String
    public_id: String
  }

  input UserInput {
    name: String!
    password: String!
    email: String!
  }

  input UpdateUserInput {
    name: String!
    email: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: Avatar
    role: [String]
    createdAt: String!
    updatedAt: String!
  }

  # type Query {
  #   currentUser: User
  #   logout: Boolean
  # }

  # type Mutation {
  #   register(userInput: UserInput!): User
  #   login(email: String!, password: String!): User
  #   uploadAvatar(image: String!): Boolean
  #   updateUserProfile(userInfo: UpdateUserInput!): Boolean
  #   updateUserPassword(oldPassword: String!, newPassword: String!): Boolean
  #   forgetPassword(email: String!): Boolean
  #   resetPassword(
  #     token: String!
  #     newPassword: String!
  #     confirmNewPassword: String!
  #   ): Boolean
  # }
`;