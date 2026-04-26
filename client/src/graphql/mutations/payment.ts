import { gql } from "@apollo/client";

export const STRIPE_CHECKOUT_MUTATION = gql`
  mutation Mutation($bookingId: ID!) {
    stripeCheckoutSession(bookingId: $bookingId) {
      url
    }
  }
`;

export const STRIPE_BUFFET_CHECKOUT_MUTATION = gql`
  mutation StripeBuffetCheckoutSession($buffetBookingId: ID!) {
    stripeBuffetCheckoutSession(buffetBookingId: $buffetBookingId) {
      url
    }
  }
`;
