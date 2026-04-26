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
    referralCode: String
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

  type RefundInfo {
    id: String
    amount: Float
    status: String
    refundedAt: String
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
    status: String
    cancelledAt: String
    cancelReason: String
    refundInfo: RefundInfo
    membershipTier: String
    referralCode: String
    referralOwner: User
    additionalNote: String
    createdAt: String
    updatedAt: String
  }

  input updateBookingPaymentInput {
    paymentInfo: PaymentInfoInput
  }

  type BookingMeta {
    totalBookings: Int!
    unpaidBookings: Int!
    needToPay: Float!
  }

  type BookingListResponse {
    bookings: [Booking!]!
    meta: BookingMeta!
  }

  type Sale {
    date: String
    sales: Float
    bookings: Int
  }

  type PaymentMethodMetric {
    method: String
    count: Int
    totalAmount: Float
  }

  type BookingStatusMetric {
    status: String
    count: Int
  }

  type DashboardMetaData {
    sales: [Sale]
    totalSales: Float
    totalBookings: Int
    totalPendingAmount: Float
    totalPaidCashAmount: Float
    totalCardSales: Float
    totalConfirmedBookings: Int
    totalCancelledBookings: Int
    averageBookingValue: Float
    totalRoomsBooked: Int
    paymentMethodDistribution: [PaymentMethodMetric]
    statusDistribution: [BookingStatusMetric]
  }

  type Query {
    getAllBookings: [Booking!]!
    getBookingById(bookingId: String!): Booking!
    getBookedDatesById(roomId: String!): [String]!
    getBookingByUser: BookingListResponse!
    getDashboardMetaData(
      startDate: String!
      endDate: String!
    ): DashboardMetaData!
  }

  type Mutation {
    createNewBooking(bookingInput: BookingInput!): Booking!
    updateBookingPayment(
      bookingId: String!
      bookingInput: updateBookingPaymentInput!
    ): Boolean
    cancelBooking(bookingId: ID!, reason: String): Booking!
  }

  type Subscription {
    newBookingNoti: String
    bookingCancelledNoti: String
  }
`;
