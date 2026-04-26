import gql from "graphql-tag";

export const buffetTypeDefs = gql`
  input BuffetDinnerInput {
    title: String!
    cuisineCategory: String!
    description: String
    imageUrl: String
    startsAt: String!
    endsAt: String!
    includedDishes: [ID!]!
    maxCapacity: Int!
    pricePerGuest: Float!
    facilities: [String!]
    active: Boolean
  }

  input UpdateBuffetDinnerInput {
    title: String
    cuisineCategory: String
    description: String
    imageUrl: String
    startsAt: String
    endsAt: String
    includedDishes: [ID!]
    maxCapacity: Int
    pricePerGuest: Float
    facilities: [String!]
    active: Boolean
  }

  input BuffetCustomerInput {
    name: String!
    email: String!
  }

  input BuffetBookingInput {
    buffetDinner: ID!
    customer: BuffetCustomerInput!
    guestCount: Int!
    additionalNote: String
  }

  input UpdateBuffetBookingPaymentInput {
    paymentInfo: PaymentInfoInput
  }

  type Dish {
    id: ID!
    name: String!
    cuisineCategory: String!
    description: String
    imageUrl: String
  }

  type BuffetDinner {
    id: ID!
    title: String!
    cuisineCategory: String!
    description: String
    imageUrl: String
    startsAt: String!
    endsAt: String!
    includedDishes: [Dish!]!
    maxCapacity: Int!
    remainingCapacity: Int!
    pricePerGuest: Float!
    facilities: [String!]!
    active: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type BuffetAmount {
    subtotal: Float!
    tax: Float!
    total: Float!
  }

  type BuffetBooking {
    id: ID!
    user: User
    buffetDinner: BuffetDinner!
    customer: Customer!
    guestCount: Int!
    pricePerGuest: Float!
    amount: BuffetAmount!
    paymentInfo: PaymentInfo
    status: String!
    cancelledAt: String
    cancelReason: String
    additionalNote: String
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getAllDishes: [Dish!]!
    getDishById(dishId: ID!): Dish
    getAllBuffetDinners: [BuffetDinner!]!
    getAvailableBuffetDinners: [BuffetDinner!]!
    getBuffetDinnerById(buffetDinnerId: ID!): BuffetDinner
    getAllBuffetBookings: [BuffetBooking!]!
    getBuffetBookingById(buffetBookingId: ID!): BuffetBooking!
    getBuffetBookingsByUser: [BuffetBooking!]!
  }

  type Mutation {
    createBuffetDinner(buffetDinnerInput: BuffetDinnerInput!): Boolean
    updateBuffetDinner(
      buffetDinnerId: ID!
      buffetDinnerInput: UpdateBuffetDinnerInput!
    ): Boolean
    deleteBuffetDinner(buffetDinnerId: ID!): Boolean
    createBuffetBooking(bookingInput: BuffetBookingInput!): BuffetBooking!
    updateBuffetBookingPayment(
      buffetBookingId: ID!
      bookingInput: UpdateBuffetBookingPaymentInput!
    ): Boolean
    cancelBuffetBooking(buffetBookingId: ID!, reason: String): BuffetBooking!
  }
`;
