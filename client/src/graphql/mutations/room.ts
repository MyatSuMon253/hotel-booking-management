import { gql } from "@apollo/client";

export const CREATE_NEW_ROOM_MUTATION = gql`
  mutation Mutation($roomInput: RoomInput!) {
    createNewRoom(roomInput: $roomInput) {
      id
    }
  }
`;

export const UPDATE_ROOM_MUTATION = gql`
  mutation Mutation($roomId: ID!, $roomInput: RoomInput!) {
    updateRoom(roomId: $roomId, roomInput: $roomInput)
  }
`;

export const DELETE_ROOM_IMAGE_MUTATION = gql`
  mutation Mutation($roomId: ID!, $imageId: String!) {
    deleteRoomImage(roomId: $roomId, imageId: $imageId)
  }
`;

export const DELETE_ROOM_MUTATION = gql`
  mutation Mutation($roomId: ID!) {
    deleteRoom(roomId: $roomId)
  }
`;
