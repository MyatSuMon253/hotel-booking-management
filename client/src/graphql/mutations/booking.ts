import { gql } from "@apollo/client";

export const CREATE_BOOKING_MUTATION = gql`
  mutation CreateNewBooking($bookingInput: BookingInput!) {
    createNewBooking(bookingInput: $bookingInput) {
      id
    }
  }
`;
