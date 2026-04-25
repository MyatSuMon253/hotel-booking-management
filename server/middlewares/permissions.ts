import { and, rule, shield } from "graphql-shield";

const isAuthenticated = rule({ cache: "contextual" })(async (
  parent,
  args,
  context,
) => {
  return context?.user !== null;
});

const isAdmin = rule({ cache: "contextual" })(async (parent, args, context) => {
  return context?.user?.role.includes("admin");
});

export const permissions = shield(
  {
    Query: {
      currentUser: isAuthenticated,
      logout: isAuthenticated,

      getAllUsers: and(isAuthenticated, isAdmin),
      getUserById: and(isAuthenticated, isAdmin),
      getDashboardMetaData: and(isAuthenticated, isAdmin),
      getAllBookings: and(isAuthenticated, isAdmin),
      getAllReviews: and(isAuthenticated, isAdmin),
      getAllPromotions: and(isAuthenticated, isAdmin),
      getPromotionById: and(isAuthenticated, isAdmin),
    },
    Mutation: {
      createNewRoom: and(isAuthenticated, isAdmin),
      updateRoom: and(isAuthenticated, isAdmin),
      deleteRoom: and(isAuthenticated, isAdmin),
      deleteRoomImage: and(isAuthenticated, isAdmin),
      deleteReviewById: and(isAuthenticated, isAdmin),
      createPromotion: and(isAuthenticated, isAdmin),
      updatePromotion: and(isAuthenticated, isAdmin),
      deletePromotion: and(isAuthenticated, isAdmin),
      updateUser: and(isAuthenticated, isAdmin),
      deleteUser: and(isAuthenticated, isAdmin),

      uploadAvatar: isAuthenticated,
      updateUserProfile: isAuthenticated,
      updateUserPassword: isAuthenticated,
      forgetPassword: isAuthenticated,
      resetPassword: isAuthenticated,
      createAndUpdateReview: isAuthenticated,
      createNewBooking: isAuthenticated,
      updateBookingPayment: isAuthenticated,
      cancelBooking: isAuthenticated,
      stripeCheckoutSession: isAuthenticated,
    },
  },
  { debug: true },
);
