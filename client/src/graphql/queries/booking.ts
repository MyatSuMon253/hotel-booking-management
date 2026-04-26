import { gql } from "@apollo/client";

export const GET_BOOKING_BY_ID = gql`
  query Query($bookingId: String!) {
    getBookingById(bookingId: $bookingId) {
      room {
        title
        id
        pricePerNight
      }
      id
      amount {
        total
        tax
        rent
        discount
      }
      daysOfRent
      rentPerDay
      paymentInfo {
        status
        method
        id
      }
      customer {
        email
        name
      }
      endDate
      startDate
    }
  }
`;

export const GET_BOOKING_BY_USER = gql`
  query ExampleQuery {
    getBookingByUser {
      meta {
        unpaidBookings
        totalBookings
        needToPay
      }
      bookings {
        room {
          title
          id
        }
        paymentInfo {
          id
          method
          status
        }
        status
        startDate
        endDate
        amount {
          total
        }
        id
      }
    }
  }
`;

export const GET_DASHBOARD_META_DATA = gql`
  query ExampleQuery($startDate: String!, $endDate: String!) {
    getDashboardMetaData(startDate: $startDate, endDate: $endDate) {
      sales {
        date
        sales
        bookings
      }
      totalSales
      totalBookings
      totalPendingAmount
      totalPaidCashAmount
      totalCardSales
      totalConfirmedBookings
      totalCancelledBookings
      averageBookingValue
      totalRoomsBooked
      paymentMethodDistribution {
        method
        count
        totalAmount
      }
      statusDistribution {
        status
        count
      }
    }
  }
`;

export const GET_ALL_BOOKING = gql`
  query Query {
    getAllBookings {
      id
      room {
        title
        id
      }
      endDate
      startDate
      amount {
        total
      }
      paymentInfo {
        status
        method
      }
      status
      user {
        id
        name
        email
      }
      customer {
        name
        email
      }
      daysOfRent
      membershipTier
      referralCode
      additionalNote
      createdAt
      updatedAt
    }
  }
`;
