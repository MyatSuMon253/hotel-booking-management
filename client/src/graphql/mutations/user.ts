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
