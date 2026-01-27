import { gql } from "@apollo/client";

export const AVATAR_UPLOAD_MUTATION = gql`
  mutation Mutation($image: String!) {
    uploadAvatar(image: $image)
  }
`;

export const UPDATE_USER_INFO_MUTATION = gql`
  mutation Mutation($userInfo: UpdateUserInput!) {
    updateUserProfile(userInfo: $userInfo)
  }
`;

export const UPDATE_USER_PASSWORD_MUTATION = gql`
  mutation Mutation($oldPassword: String!, $newPassword: String!) {
    updateUserPassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;
