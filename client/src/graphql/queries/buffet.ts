import { gql } from "@apollo/client";

const DISH_FIELDS = `
  id
  name
  cuisineCategory
  description
  imageUrl
`;

const BUFFET_DINNER_FIELDS = `
  id
  title
  cuisineCategory
  description
  imageUrl
  startsAt
  endsAt
  maxCapacity
  remainingCapacity
  pricePerGuest
  facilities
  active
  createdAt
  updatedAt
  includedDishes {
    ${DISH_FIELDS}
  }
`;

const BUFFET_BOOKING_FIELDS = `
  id
  customer {
    name
    email
  }
  guestCount
  pricePerGuest
  amount {
    subtotal
    tax
    total
  }
  paymentInfo {
    id
    status
    method
  }
  status
  additionalNote
  createdAt
  updatedAt
  buffetDinner {
    ${BUFFET_DINNER_FIELDS}
  }
`;

export const GET_ALL_DISHES = gql`
  query GetAllDishes {
    getAllDishes {
      ${DISH_FIELDS}
    }
  }
`;

export const GET_DISH_BY_ID = gql`
  query GetDishById($dishId: ID!) {
    getDishById(dishId: $dishId) {
      ${DISH_FIELDS}
    }
  }
`;

export const GET_ALL_BUFFET_DINNERS = gql`
  query GetAllBuffetDinners {
    getAllBuffetDinners {
      ${BUFFET_DINNER_FIELDS}
    }
  }
`;

export const GET_AVAILABLE_BUFFET_DINNERS = gql`
  query GetAvailableBuffetDinners {
    getAvailableBuffetDinners {
      ${BUFFET_DINNER_FIELDS}
    }
  }
`;

export const GET_BUFFET_DINNER_BY_ID = gql`
  query GetBuffetDinnerById($buffetDinnerId: ID!) {
    getBuffetDinnerById(buffetDinnerId: $buffetDinnerId) {
      ${BUFFET_DINNER_FIELDS}
    }
  }
`;

export const GET_ALL_BUFFET_BOOKINGS = gql`
  query GetAllBuffetBookings {
    getAllBuffetBookings {
      ${BUFFET_BOOKING_FIELDS}
    }
  }
`;

export const GET_BUFFET_BOOKING_BY_ID = gql`
  query GetBuffetBookingById($buffetBookingId: ID!) {
    getBuffetBookingById(buffetBookingId: $buffetBookingId) {
      ${BUFFET_BOOKING_FIELDS}
    }
  }
`;

export const GET_BUFFET_BOOKINGS_BY_USER = gql`
  query GetBuffetBookingsByUser {
    getBuffetBookingsByUser {
      ${BUFFET_BOOKING_FIELDS}
    }
  }
`;
