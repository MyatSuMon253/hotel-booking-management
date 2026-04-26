import { gql } from "@apollo/client";

export const CREATE_BUFFET_DINNER = gql`
  mutation CreateBuffetDinner($buffetDinnerInput: BuffetDinnerInput!) {
    createBuffetDinner(buffetDinnerInput: $buffetDinnerInput)
  }
`;

export const UPDATE_BUFFET_DINNER = gql`
  mutation UpdateBuffetDinner(
    $buffetDinnerId: ID!
    $buffetDinnerInput: UpdateBuffetDinnerInput!
  ) {
    updateBuffetDinner(
      buffetDinnerId: $buffetDinnerId
      buffetDinnerInput: $buffetDinnerInput
    )
  }
`;

export const DELETE_BUFFET_DINNER = gql`
  mutation DeleteBuffetDinner($buffetDinnerId: ID!) {
    deleteBuffetDinner(buffetDinnerId: $buffetDinnerId)
  }
`;

export const CREATE_BUFFET_BOOKING = gql`
  mutation CreateBuffetBooking($bookingInput: BuffetBookingInput!) {
    createBuffetBooking(bookingInput: $bookingInput) {
      id
    }
  }
`;

export const UPDATE_BUFFET_BOOKING_PAYMENT = gql`
  mutation UpdateBuffetBookingPayment(
    $buffetBookingId: ID!
    $bookingInput: UpdateBuffetBookingPaymentInput!
  ) {
    updateBuffetBookingPayment(
      buffetBookingId: $buffetBookingId
      bookingInput: $bookingInput
    )
  }
`;

export const CANCEL_BUFFET_BOOKING = gql`
  mutation CancelBuffetBooking($buffetBookingId: ID!, $reason: String) {
    cancelBuffetBooking(buffetBookingId: $buffetBookingId, reason: $reason) {
      id
      status
    }
  }
`;
