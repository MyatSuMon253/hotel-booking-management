import { gql } from "@apollo/client";

export const NEW_BOOKING_SUBSCRIPTION = gql`
  subscription Subscription {
    newBookingNoti
  }
`;
