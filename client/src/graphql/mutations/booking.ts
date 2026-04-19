import { gql } from "@apollo/client";

export const CREATE_BOOKING_MUTATION = gql`
  mutation CreateNewBooking($bookingInput: BookingInput!) {
    createNewBooking(bookingInput: $bookingInput) {
      id
    }
  }
`;

export const UPDATE_BOOKING_PAYMENT = gql`
  mutation UpdateBookingPayment(
    $bookingId: String!
    $bookingInput: updateBookingPaymentInput!
  ) {
    updateBookingPayment(bookingId: $bookingId, bookingInput: $bookingInput)
  }
`;

export const CANCEL_BOOKING_MUTATION = gql`
  mutation CancelBooking($bookingId: ID!, $reason: String) {
    cancelBooking(bookingId: $bookingId, reason: $reason) {
      id
      status
      cancelledAt
      cancelReason
      paymentInfo {
        status
        method
      }
      refundInfo {
        id
        amount
        status
      }
    }
  }
`;
