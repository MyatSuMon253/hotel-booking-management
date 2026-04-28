import { pubsub } from "../../apollo/pubsub";
import {
  cancelBooking,
  createNewBooking,
  getAllBookings,
  getBookedDatesById,
  getBookingById,
  getBookingByUser,
  getDashboardMetaData,
  updateBookingPayment,
} from "../../controllers/booking";
import {
  cancelBuffetBooking,
  createBuffetBooking,
  createBuffetDinner,
  getAllBuffetBookings,
  getAllBuffetDinners,
  getAllDishes,
  getAvailableBuffetDinners,
  getBuffetBookingById,
  getBuffetBookingsByUser,
  getBuffetDinnerById,
  getDishById,
  getRemainingBuffetCapacity,
  updateBuffetBookingPayment,
  updateBuffetDinner,
} from "../../controllers/buffet";
import {
  stripeBuffetCheckoutSession,
  stripeCheckoutSession,
} from "../../controllers/payment";
import {
  canReview,
  createAndUpdateReview,
  deleteReviewById,
  getAllReviews,
} from "../../controllers/review";
import {
  deleteRoom,
  deleteRoomImage,
  getAllRooms,
  getRoomById,
  updateRoom,
  createNewRoom,
} from "../../controllers/room";
import {
  deleteUserById,
  forgetPassword,
  getAllUsers,
  getUserById,
  login,
  register,
  resetPassword,
  updateUser,
  updateUserPassword,
  updateUserProfile,
  uploadAvatar,
  validateReferralCode,
} from "../../controllers/user";
import { getDishesByCatalogIds } from "../../data/dishCatalog";
import { BuffetDinner } from "../../models/buffetDinner";
import { membershipTierResolvers } from "../../graphql/resolvers/membershipTier";
import { paymentResolver } from "../../graphql/resolvers/payment";
import { promotionResolvers } from "../../graphql/resolvers/promotion";
import { reviewResolvers } from "../../graphql/resolvers/review";
import { roomResolvers } from "../../graphql/resolvers/room";
import { buffetResolvers } from "../../graphql/resolvers/buffet";
import { bookingResolvers } from "../../graphql/resolvers/booking";
import { userResolvers } from "../../graphql/resolvers/user";
import { Promotion } from "../../models/promotion";
import {
  MembershipTier,
  ensureDefaultMembershipTiers,
} from "../../models/membershipTier";
import {
  createMembershipTier,
  createPromotion,
  createUser,
} from "../../test/helpers/factories";
import { createMockQuery } from "../../test/helpers/mock-queries";

jest.mock("../../apollo/pubsub", () => ({
  pubsub: { asyncIterableIterator: jest.fn(), publish: jest.fn() },
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

jest.mock("../../controllers/room", () => ({
  getAllRooms: jest.fn(),
  getRoomById: jest.fn(),
  createNewRoom: jest.fn(),
  updateRoom: jest.fn(),
  deleteRoom: jest.fn(),
  deleteRoomImage: jest.fn(),
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

jest.mock("../../data/dishCatalog", () => ({
  getDishesByCatalogIds: jest.fn(),
}));

jest.mock("../../models/buffetDinner", () => ({
  BuffetDinner: { findById: jest.fn() },
}));

jest.mock("../../models/promotion", () => ({
  Promotion: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
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
    findByIdAndDelete: jest.fn(),
  },
}));

describe("controller-backed resolvers", () => {
  test("user resolvers map args and context", async () => {
    const user = createUser({ membershipTier: "gold", referralCode: undefined });
    const res = { cookie: jest.fn() };
    await userResolvers.Query.currentUser(null, null, { user } as any);
    await userResolvers.Query.logout(null, null, { res } as any);
    await userResolvers.Query.getAllUsers();
    await userResolvers.Query.getUserById(null, { userId: "u1" });
    await userResolvers.Query.validateReferralCode(null, { code: "ABC" });
    await userResolvers.Mutation.updateUser(null, {
      userId: "u1",
      roles: ["admin"],
      isActive: true,
      membershipTier: "silver",
      referralPointsAdjustment: 1,
    });
    await userResolvers.Mutation.deleteUser(null, { userId: "u1" });
    await userResolvers.Mutation.register(null, { userInput: { name: "A" } as any });
    await userResolvers.Mutation.login(
      null,
      { email: "a@example.com", password: "p" },
      { res } as any,
    );
    await userResolvers.Mutation.uploadAvatar(null, { image: "img" }, { user } as any);
    await userResolvers.Mutation.updateUserProfile(
      null,
      { userInfo: { name: "B" } },
      { user } as any,
    );
    await userResolvers.Mutation.updateUserPassword(
      null,
      { oldPassword: "old", newPassword: "new" },
      { user } as any,
    );
    await userResolvers.Mutation.forgetPassword(null, { email: "a@example.com" });
    await userResolvers.Mutation.resetPassword(null, {
      token: "t",
      newPassword: "n",
      confirmNewPassword: "n",
    });

    expect(user.save).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith("token", null, { maxAge: 0 });
    expect(getUserById).toHaveBeenCalledWith("u1");
    expect(validateReferralCode).toHaveBeenCalledWith("ABC");
    expect(updateUser).toHaveBeenCalledWith("u1", {
      role: ["admin"],
      isActive: true,
      membershipTier: "silver",
      referralPointsAdjustment: 1,
    });
    expect(deleteUserById).toHaveBeenCalledWith("u1");
    expect(register).toHaveBeenCalled();
    expect(login).toHaveBeenCalledWith("a@example.com", "p", res);
    expect(uploadAvatar).toHaveBeenCalledWith("img", "user-1");
    expect(updateUserProfile).toHaveBeenCalledWith({ name: "B" }, "user-1");
    expect(updateUserPassword).toHaveBeenCalledWith("old", "new", "user-1");
    expect(forgetPassword).toHaveBeenCalledWith("a@example.com");
    expect(resetPassword).toHaveBeenCalledWith("t", "n", "n");
  });

  test("room resolvers map to controller calls and ratings fallback", async () => {
    await roomResolvers.Query.getAllRooms(null, {
      query: "suite",
      filters: { pricePerNight: { gte: 10 } },
      page: 1,
    } as any);
    await roomResolvers.Query.getRoomById(null, { roomId: "r1" });
    await roomResolvers.Mutation.createNewRoom(null, { roomInput: { title: "Suite" } as any });
    await roomResolvers.Mutation.updateRoom(null, {
      roomId: "r1",
      roomInput: { title: "Suite" } as any,
    });
    await roomResolvers.Mutation.deleteRoom(null, { roomId: "r1" });
    await roomResolvers.Mutation.deleteRoomImage(null, { roomId: "r1", imageId: "i1" });

    expect(getAllRooms).toHaveBeenCalledWith("suite", { pricePerNight: { gte: 10 } }, 1);
    expect(getRoomById).toHaveBeenCalledWith("r1");
    expect(createNewRoom).toHaveBeenCalled();
    expect(updateRoom).toHaveBeenCalledWith("r1", { title: "Suite" });
    expect(deleteRoom).toHaveBeenCalledWith("r1");
    expect(deleteRoomImage).toHaveBeenCalledWith("r1", "i1");
    expect(roomResolvers.Room.ratings({ ratings: { value: "x", count: undefined } })).toEqual({
      value: 5,
      count: 0,
    });
  });

  test("booking resolvers map queries, mutations, and subscriptions", async () => {
    await bookingResolvers.Query.getBookingById(null, { bookingId: "b1" }, { user: { id: "u1" } } as any);
    await bookingResolvers.Query.getBookedDatesById(null, { roomId: "r1" });
    await bookingResolvers.Query.getBookingByUser(null, null, { user: { id: "u1" } } as any);
    await bookingResolvers.Query.getAllBookings();
    await bookingResolvers.Query.getDashboardMetaData(
      null,
      { startDate: new Date("2026-05-01"), endDate: new Date("2026-05-02") },
    );
    await bookingResolvers.Mutation.createNewBooking(
      null,
      { bookingInput: { room: "r1" } },
      { user: { _id: "u1" } } as any,
    );
    await bookingResolvers.Mutation.updateBookingPayment(
      null,
      {
        bookingId: "b1",
        bookingInput: {
          paymentInfo: { id: "pi_1", status: "pending", method: "cash" },
        },
      },
      { user: { id: "u1" } } as any,
    );
    await bookingResolvers.Mutation.cancelBooking(
      null,
      { bookingId: "b1", reason: "reason" },
      { user: { id: "u1" } } as any,
    );
    bookingResolvers.Subscription.newBookingNoti.subscribe();
    bookingResolvers.Subscription.bookingCancelledNoti.subscribe();

    expect(getBookingById).toHaveBeenCalledWith("b1", { id: "u1" });
    expect(getBookedDatesById).toHaveBeenCalledWith("r1");
    expect(getBookingByUser).toHaveBeenCalledWith("u1");
    expect(getAllBookings).toHaveBeenCalled();
    expect(getDashboardMetaData).toHaveBeenCalled();
    expect(createNewBooking).toHaveBeenCalledWith({ room: "r1" }, "u1");
    expect(updateBookingPayment).toHaveBeenCalled();
    expect(cancelBooking).toHaveBeenCalledWith("b1", "reason", { id: "u1" });
    expect(pubsub.asyncIterableIterator).toHaveBeenCalledWith(["NEW_BOOKING"]);
    expect(pubsub.asyncIterableIterator).toHaveBeenCalledWith(["BOOKING_CANCELLED"]);
  });

  test("buffet, review, and payment resolvers map args and field resolvers", async () => {
    await buffetResolvers.Query.getAllDishes();
    await buffetResolvers.Query.getDishById(null, { dishId: "d1" });
    await buffetResolvers.Query.getAllBuffetDinners();
    await buffetResolvers.Query.getAvailableBuffetDinners();
    await buffetResolvers.Query.getBuffetDinnerById(null, { buffetDinnerId: "bd1" });
    await buffetResolvers.Query.getAllBuffetBookings();
    await buffetResolvers.Query.getBuffetBookingById(null, { buffetBookingId: "bb1" }, { user: { id: "u1" } } as any);
    await buffetResolvers.Query.getBuffetBookingsByUser(null, null, { user: { id: "u1" } } as any);
    await buffetResolvers.Mutation.createBuffetDinner(null, { buffetDinnerInput: {} });
    await buffetResolvers.Mutation.updateBuffetDinner(null, { buffetDinnerId: "bd1", buffetDinnerInput: {} });
    await buffetResolvers.Mutation.createBuffetBooking(null, { bookingInput: {} }, { user: { _id: "u1" } } as any);
    await buffetResolvers.Mutation.updateBuffetBookingPayment(null, { buffetBookingId: "bb1", bookingInput: {} }, { user: { id: "u1" } } as any);
    await buffetResolvers.Mutation.cancelBuffetBooking(null, { buffetBookingId: "bb1", reason: "r" }, { user: { id: "u1" } } as any);

    expect(buffetResolvers.BuffetDinner.includedDishes({ includedDishes: null })).resolves.toEqual([]);
    await expect(
      buffetResolvers.BuffetDinner.includedDishes({ includedDishes: [{ name: "Dish" }] }),
    ).resolves.toEqual([{ name: "Dish" }]);
    (getDishesByCatalogIds as jest.Mock).mockResolvedValue([{ id: "d1" }]);
    await buffetResolvers.BuffetDinner.includedDishes({ includedDishes: ["d1"] });
    (BuffetDinner.findById as jest.Mock).mockResolvedValue({ id: "bd1" });
    await buffetResolvers.BuffetBooking.buffetDinner({ buffetDinner: "bd1" });
    await reviewResolvers.Query.getAllReviews();
    await reviewResolvers.Query.canReview(null, { reviewRoomId: "r1" }, { user: { id: "u1" } } as any);
    await reviewResolvers.Mutation.deleteReviewById(null, { reviewId: "rev1" });
    await reviewResolvers.Mutation.createAndUpdateReview(
      null,
      { reviewInput: { roomId: "r1", rating: 5, comment: "Great" } },
      { user: { id: "u1" } } as any,
    );
    await paymentResolver.Mutation.stripeCheckoutSession(null, { bookingId: "b1" });
    await paymentResolver.Mutation.stripeBuffetCheckoutSession(null, { buffetBookingId: "bb1" });

    expect(getAllDishes).toHaveBeenCalled();
    expect(getDishById).toHaveBeenCalledWith("d1");
    expect(getAllBuffetDinners).toHaveBeenCalled();
    expect(getAvailableBuffetDinners).toHaveBeenCalled();
    expect(getBuffetDinnerById).toHaveBeenCalledWith("bd1");
    expect(getAllBuffetBookings).toHaveBeenCalled();
    expect(getBuffetBookingById).toHaveBeenCalledWith("bb1", { id: "u1" });
    expect(getBuffetBookingsByUser).toHaveBeenCalledWith("u1");
    expect(createBuffetDinner).toHaveBeenCalled();
    expect(updateBuffetDinner).toHaveBeenCalledWith("bd1", {});
    expect(createBuffetBooking).toHaveBeenCalledWith({}, "u1");
    expect(updateBuffetBookingPayment).toHaveBeenCalled();
    expect(cancelBuffetBooking).toHaveBeenCalledWith("bb1", "r", { id: "u1" });
    expect(getRemainingBuffetCapacity).toHaveBeenCalledTimes(0);
    await buffetResolvers.BuffetDinner.remainingCapacity({ id: "bd1" });
    expect(getRemainingBuffetCapacity).toHaveBeenCalledWith({ id: "bd1" });
    expect(getDishesByCatalogIds).toHaveBeenCalledWith(["d1"]);
    expect(BuffetDinner.findById).toHaveBeenCalledWith("bd1");
    expect(getAllReviews).toHaveBeenCalled();
    expect(canReview).toHaveBeenCalledWith("r1", "u1");
    expect(deleteReviewById).toHaveBeenCalledWith("rev1");
    expect(createAndUpdateReview).toHaveBeenCalledWith(
      { roomId: "r1", rating: 5, comment: "Great" },
      "u1",
    );
    expect(stripeCheckoutSession).toHaveBeenCalledWith("b1");
    expect(stripeBuffetCheckoutSession).toHaveBeenCalledWith("bb1");
  });
});

describe("direct resolvers", () => {
  test("promotion resolvers cover CRUD behavior", async () => {
    const promotions = [createPromotion()];
    (Promotion.find as jest.Mock).mockReturnValue(createMockQuery(promotions));
    await expect(promotionResolvers.Query.getAllPromotions()).resolves.toEqual(promotions);

    (Promotion.findById as jest.Mock).mockResolvedValue(createPromotion());
    await expect(
      promotionResolvers.Query.getPromotionById(null, { promotionId: "p1" }),
    ).resolves.toEqual(expect.objectContaining({ _id: "promotion-1" }));

    (Promotion.findOne as jest.Mock).mockResolvedValue(null);
    await expect(
      promotionResolvers.Mutation.createPromotion(null, {
        promotionInput: {
          code: " save10 ",
          discountType: "percentage",
          discountValue: 10,
          validFrom: "2026-05-01",
          validTo: "2026-05-10",
        },
      }),
    ).resolves.toBe(true);
    expect(Promotion.create).toHaveBeenCalledWith(
      expect.objectContaining({ code: "SAVE10", usedCount: 0 }),
    );

    const promo = createPromotion();
    (Promotion.findById as jest.Mock).mockResolvedValue(promo);
    await expect(
      promotionResolvers.Mutation.updatePromotion(null, {
        promotionId: "p1",
        promotionInput: { code: " save20 ", validFrom: "2026-05-01" },
      }),
    ).resolves.toBe(true);
    expect(promo.set).toHaveBeenCalledWith(
      expect.objectContaining({ code: "SAVE20", validFrom: expect.any(Date) }),
    );

    (Promotion.findByIdAndDelete as jest.Mock).mockResolvedValue(createPromotion());
    await expect(
      promotionResolvers.Mutation.deletePromotion(null, { promotionId: "p1" }),
    ).resolves.toBe(true);
  });

  test("membership tier resolvers cover CRUD behavior", async () => {
    const tiers = [createMembershipTier()];
    (MembershipTier.find as jest.Mock).mockReturnValue(createMockQuery(tiers));
    await expect(membershipTierResolvers.Query.getAllMembershipTiers()).resolves.toEqual(
      tiers,
    );
    expect(ensureDefaultMembershipTiers).toHaveBeenCalled();

    (MembershipTier.findById as jest.Mock).mockResolvedValue(createMembershipTier());
    await expect(
      membershipTierResolvers.Query.getMembershipTierById(null, {
        membershipTierId: "t1",
      }),
    ).resolves.toEqual(expect.objectContaining({ _id: "tier-1" }));

    (MembershipTier.findOne as jest.Mock).mockResolvedValue(null);
    await expect(
      membershipTierResolvers.Mutation.createMembershipTier(null, {
        membershipTierInput: {
          name: " Gold " as any,
          discountPercentage: 20,
        },
      }),
    ).resolves.toBe(true);
    expect(MembershipTier.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "gold", active: true }),
    );

    const tier = createMembershipTier();
    (MembershipTier.findById as jest.Mock).mockResolvedValue(tier);
    await expect(
      membershipTierResolvers.Mutation.updateMembershipTier(null, {
        membershipTierId: "t1",
        membershipTierInput: { name: " Diamond " } as any,
      }),
    ).resolves.toBe(true);
    expect(tier.set).toHaveBeenCalledWith({ name: "diamond" });

    (MembershipTier.findByIdAndDelete as jest.Mock).mockResolvedValue(
      createMembershipTier(),
    );
    await expect(
      membershipTierResolvers.Mutation.deleteMembershipTier(null, {
        membershipTierId: "t1",
      }),
    ).resolves.toBe(true);
  });
});
