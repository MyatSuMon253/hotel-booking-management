import { gql } from "@apollo/client";

export const STRIPE_CHECKOUT_MUTATION = gql`
  mutation Mutation($bookingId: ID!) {
    stripeCheckoutSession(bookingId: $bookingId) {
      url
    }
  }
`;
