import gql from "graphql-tag";

export const bookingTypeDefs = gql`
  input CustomerInput {
    name: String!
    email: String!
  }

  input AmountInput {
    rent: Float!
    discount: Float!
    tax: Float!
    total: Float!
  }

  input PaymentInfoInput {
    id: String
    status: String
    method: String
  }

  input BookingInput {
    room: ID!
    startDate: String!
    endDate: String!
    customer: CustomerInput!
    amount: AmountInput!
    daysOfRent: Int!
    rentPerDay: Float!
    additionalNote: String
  }

  type Customer {
    name: String!
    email: String!
  }

  type Amount {
    rent: Float!
    discount: Float!
    tax: Float!
    total: Float!
  }

  type PaymentInfo {
    id: String
    status: String
    method: String
  }

  type Booking {
    id: ID
    user: User
    room: Room
    startDate: String!
    endDate: String!
    customer: Customer!
    amount: Amount!
    daysOfRent: Int!
    rentPerDay: Float!
    paymentInfo: PaymentInfo
    additionalNote: String
  }

  input PaymentInfoInput {
    id: String
    status: String
    method: String
  }

  input updateBookingPaymentInput {
    paymentInfo: PaymentInfoInput 
  }

  type Query {
    getBookingById(bookingId: String!): Booking!
    getBookedDatesById(roomId: String!): [String]!
  }

  type Mutation {
    createNewBooking(bookingInput: BookingInput!): Booking!
    updateBookingPayment(
      bookingId: String!
      bookingInput: updateBookingPaymentInput!
    ): Boolean
  }
`;
