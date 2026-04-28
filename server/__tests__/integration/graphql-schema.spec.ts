import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "../../middlewares/permissions";
import { bookingResolvers } from "../../graphql/resolvers/booking";
import { buffetResolvers } from "../../graphql/resolvers/buffet";
import { membershipTierResolvers } from "../../graphql/resolvers/membershipTier";
import { paymentResolver } from "../../graphql/resolvers/payment";
import { promotionResolvers } from "../../graphql/resolvers/promotion";
import { reviewResolvers } from "../../graphql/resolvers/review";
import { roomResolvers } from "../../graphql/resolvers/room";
import { userResolvers } from "../../graphql/resolvers/user";
import { bookingTypeDefs } from "../../graphql/typeDefs/booking";
import { buffetTypeDefs } from "../../graphql/typeDefs/buffet";
import { membershipTierTypeDefs } from "../../graphql/typeDefs/membershipTier";
import { paymentTypeDefs } from "../../graphql/typeDefs/payment";
import { promotionTypeDefs } from "../../graphql/typeDefs/promotion";
import { reviewTypeDefs } from "../../graphql/typeDefs/review";
import { roomTypeDefs } from "../../graphql/typeDefs/room";
import { userTypeDefs } from "../../graphql/typeDefs/user";
import { getAllRooms } from "../../controllers/room";
import { updateUser } from "../../controllers/user";
import { createRoom, createUser } from "../../test/helpers/factories";

jest.mock("../../controllers/room", () => ({
  getAllRooms: jest.fn(),
  getRoomById: jest.fn(),
  createNewRoom: jest.fn(),
  updateRoom: jest.fn(),
  deleteRoom: jest.fn(),
  deleteRoomImage: jest.fn(),
}));

jest.mock("../../controllers/user", () => ({
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  validateReferralCode: jest.fn(),
  updateUser: jest.fn(),
  deleteUserById: jest.fn(),
  register: jest.fn(),
  login: jest.fn(),
  uploadAvatar: jest.fn(),
  updateUserProfile: jest.fn(),
  updateUserPassword: jest.fn(),
  forgetPassword: jest.fn(),
  resetPassword: jest.fn(),
}));

jest.mock("../../controllers/booking", () => ({
  getBookingById: jest.fn(),
  getBookedDatesById: jest.fn(),
  getBookingByUser: jest.fn(),
  getAllBookings: jest.fn(),
  getDashboardMetaData: jest.fn(),
  createNewBooking: jest.fn(),
  updateBookingPayment: jest.fn(),
  cancelBooking: jest.fn(),
}));

jest.mock("../../controllers/buffet", () => ({
  getAllDishes: jest.fn(),
  getDishById: jest.fn(),
  getAllBuffetDinners: jest.fn(),
  getAvailableBuffetDinners: jest.fn(),
  getBuffetDinnerById: jest.fn(),
  getAllBuffetBookings: jest.fn(),
  getBuffetBookingById: jest.fn(),
  getBuffetBookingsByUser: jest.fn(),
  createBuffetDinner: jest.fn(),
  updateBuffetDinner: jest.fn(),
  deleteBuffetDinner: jest.fn(),
  createBuffetBooking: jest.fn(),
  updateBuffetBookingPayment: jest.fn(),
  cancelBuffetBooking: jest.fn(),
  getRemainingBuffetCapacity: jest.fn(),
}));

jest.mock("../../controllers/review", () => ({
  getAllReviews: jest.fn(),
  canReview: jest.fn(),
  deleteReviewById: jest.fn(),
  createAndUpdateReview: jest.fn(),
}));

jest.mock("../../controllers/payment", () => ({
  stripeCheckoutSession: jest.fn(),
  stripeBuffetCheckoutSession: jest.fn(),
}));

jest.mock("../../models/promotion", () => ({
  Promotion: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock("../../models/membershipTier", () => ({
  MEMBERSHIP_TIER_NAMES: ["silver", "gold", "diamond"],
  ensureDefaultMembershipTiers: jest.fn(),
  MembershipTier: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const createTestServer = (): ApolloServer => {
  const schema = makeExecutableSchema({
    typeDefs: [
      roomTypeDefs,
      userTypeDefs,
      bookingTypeDefs,
      paymentTypeDefs,
      reviewTypeDefs,
      promotionTypeDefs,
      membershipTierTypeDefs,
      buffetTypeDefs,
    ],
    resolvers: [
      roomResolvers,
      userResolvers,
      bookingResolvers,
      paymentResolver,
      reviewResolvers,
      promotionResolvers,
      membershipTierResolvers,
      buffetResolvers,
    ],
  });

  return new ApolloServer({
    schema: applyMiddleware(schema, permissions),
  });
};

describe("GraphQL schema integration", () => {
  let server: ApolloServer;

  beforeEach(async () => {
    server = createTestServer();
    await server.start();
  });

  afterEach(async () => {
    await server.stop();
  });

  test("executes a public room query through schema, resolvers, and field resolvers", async () => {
    const room = createRoom({
      id: "room-1",
      title: "River View Suite",
      roomNumber: "101",
      type: "suite",
      pricePerNight: 120,
      capacity: 2,
      location: "Bagan",
      isAvailable: true,
      ratings: undefined,
    });

    (getAllRooms as jest.Mock).mockResolvedValue({
      rooms: [room],
      pagination: { totalRoomCount: 1, perPage: 6 },
    });

    const response = await server.executeOperation({
      query: `
        query Rooms($query: String, $filters: RoomFilters, $page: Int) {
          getAllRooms(query: $query, filters: $filters, page: $page) {
            pagination {
              totalRoomCount
              perPage
            }
            rooms {
              id
              title
              ratings {
                value
                count
              }
            }
          }
        }
      `,
      variables: {
        query: "river",
        filters: { type: "suite", isAvailable: true },
        page: 2,
      },
    });

    expect(response.body.kind).toBe("single");
    if (response.body.kind !== "single") {
      return;
    }

    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data).toEqual({
      getAllRooms: {
        pagination: { totalRoomCount: 1, perPage: 6 },
        rooms: [
          {
            id: "room-1",
            title: "River View Suite",
            ratings: { value: 5, count: 0 },
          },
        ],
      },
    });
    expect(getAllRooms).toHaveBeenCalledWith(
      "river",
      { type: "suite", isAvailable: true },
      2,
    );
  });

  test("blocks admin mutations for non-admin users before the controller runs", async () => {
    const user = createUser({ role: ["user"] });

    const response = await server.executeOperation(
      {
        query: `
          mutation UpdateUser($userId: ID!) {
            updateUser(userId: $userId, roles: ["admin"])
          }
        `,
        variables: { userId: "user-2" },
      },
      {
        contextValue: { user },
      },
    );

    expect(response.body.kind).toBe("single");
    if (response.body.kind !== "single") {
      return;
    }

    expect(response.body.singleResult.errors?.[0]?.message).toBe("Not Authorised!");
    expect(updateUser).not.toHaveBeenCalled();
  });
});
