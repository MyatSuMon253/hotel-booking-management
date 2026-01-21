import { gql } from "@apollo/client";

export const AVATAR_UPLOAD_MUTATION = gql`
    mutation Mutation($image: String!) {
        uploadAvatar(image: $image) 
    }
`