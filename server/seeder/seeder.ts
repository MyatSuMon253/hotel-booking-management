import dotenv from "dotenv";
import mongoose from "mongoose";
import { BuffetBooking } from "../models/buffetBooking";
import { BuffetDinner } from "../models/buffetDinner";
import { Booking } from "../models/booking";
import {
  DEFAULT_MEMBERSHIP_TIERS,
  MembershipTier,
} from "../models/membershipTier";
import { Promotion } from "../models/promotion";
import { Review } from "../models/review";
import Room from "../models/room";
import { User } from "../models/user";
import { rooms } from "./data";

dotenv.config({ path: "config/.env.local" });

const connectionString =
  process.env.MONGODB_URI ||
  "mongodb+srv://myatsumon2531999:lAFveQNC2VSCVnBg@cluster0.r822czp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const day = 24 * 60 * 60 * 1000;
const addDays = (days: number) => new Date(Date.now() + days * day);

const calculateRoomAmount = (
  rentPerDay: number,
  daysOfRent: number,
  discountRate = 0,
) => {
  const rent = rentPerDay * daysOfRent;
  const discount = Number((rent * discountRate).toFixed(2));
  const taxableAmount = rent - discount;
  const tax = Number((taxableAmount * 0.05).toFixed(2));

  return {
    rent,
    discount,
    tax,
    total: Number((taxableAmount + tax).toFixed(2)),
  };
};

const calculateBuffetAmount = (pricePerGuest: number, guestCount: number) => {
  const subtotal = pricePerGuest * guestCount;
  const tax = Number((subtotal * 0.05).toFixed(2));

  return {
    subtotal,
    tax,
    total: Number((subtotal + tax).toFixed(2)),
  };
};

const users = [
  {
    name: "Admin Manager",
    email: "admin@rangoonheritage.com",
    password: "password123",
    role: ["admin"],
    isActive: true,
    membershipTier: "diamond",
    referralPoints: 750,
    avatar: {
      url: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
      public_id: "seed-avatar-admin-manager",
    },
  },
  {
    name: "Thura Aung",
    email: "thura.aung@example.com",
    password: "password123",
    role: ["user"],
    isActive: true,
    membershipTier: "gold",
    referralPoints: 280,
    avatar: {
      url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      public_id: "seed-avatar-thura-aung",
    },
  },
  {
    name: "Mya Hnin",
    email: "mya.hnin@example.com",
    password: "password123",
    role: ["user"],
    isActive: true,
    membershipTier: "silver",
    referralPoints: 95,
    avatar: {
      url: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      public_id: "seed-avatar-mya-hnin",
    },
  },
  {
    name: "Daniel Carter",
    email: "daniel.carter@example.com",
    password: "password123",
    role: ["user"],
    isActive: true,
    membershipTier: "diamond",
    referralPoints: 520,
    avatar: {
      url: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      public_id: "seed-avatar-daniel-carter",
    },
  },
  {
    name: "Nandar Win",
    email: "nandar.win@example.com",
    password: "password123",
    role: ["user"],
    isActive: true,
    membershipTier: "gold",
    referralPoints: 165,
    avatar: {
      url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      public_id: "seed-avatar-nandar-win",
    },
  },
  {
    name: "Akari Sato",
    email: "akari.sato@example.com",
    password: "password123",
    role: ["user"],
    isActive: true,
    membershipTier: "silver",
    referralPoints: 40,
    avatar: {
      url: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      public_id: "seed-avatar-akari-sato",
    },
  },
];

const buffetDinners = [
  {
    title: "Royal Myanmar Night Buffet",
    cuisineCategory: "Myanmar",
    description:
      "A regional dinner spread with mohinga, Shan noodles, curries, salads, tea leaf rice, and traditional sweets.",
    imageUrl: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
    startsAt: addDays(2),
    endsAt: addDays(2.125),
    includedDishes: [
      "Mohinga",
      "Shan Noodles",
      "Laphet Thoke",
      "Chicken Curry",
      "Coconut Rice",
      "Mont Lone Yay Paw",
    ],
    maxCapacity: 80,
    pricePerGuest: 32,
    facilities: ["Live traditional music", "Welcome drink", "Vegetarian station"],
    active: true,
  },
  {
    title: "Pan-Asian Seafood Dinner",
    cuisineCategory: "Seafood",
    description:
      "A seafood-focused buffet with grilled prawns, steamed fish, sushi rolls, crab soup, and fresh salads.",
    imageUrl: "https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg",
    startsAt: addDays(4),
    endsAt: addDays(4.125),
    includedDishes: [
      "Grilled Prawns",
      "Steamed Sea Bass",
      "Sushi",
      "Crab Soup",
      "Tempura",
      "Mango Sticky Rice",
    ],
    maxCapacity: 60,
    pricePerGuest: 45,
    facilities: ["Seafood grill", "Sushi counter", "Outdoor terrace seating"],
    active: true,
  },
  {
    title: "Mediterranean Garden Buffet",
    cuisineCategory: "Mediterranean",
    description:
      "A lighter dinner service with mezze, grilled meats, roasted vegetables, fresh breads, and citrus desserts.",
    imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    startsAt: addDays(7),
    endsAt: addDays(7.125),
    includedDishes: [
      "Hummus",
      "Tabbouleh",
      "Grilled Chicken Skewers",
      "Lamb Kofta",
      "Roasted Vegetables",
      "Baklava",
    ],
    maxCapacity: 70,
    pricePerGuest: 38,
    facilities: ["Garden seating", "Mocktail bar", "Halal-friendly menu"],
    active: true,
  },
  {
    title: "Japanese Sakura Dinner",
    cuisineCategory: "Japanese",
    description:
      "A curated Japanese buffet featuring sushi, ramen, katsu, tempura, miso soup, and seasonal desserts.",
    imageUrl: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",
    startsAt: addDays(10),
    endsAt: addDays(10.125),
    includedDishes: [
      "Sushi",
      "Ramen",
      "Chicken Katsu",
      "Tempura",
      "Miso Soup",
      "Matcha Cake",
    ],
    maxCapacity: 55,
    pricePerGuest: 42,
    facilities: ["Chef station", "Tea service", "Private dining corner"],
    active: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("Connected to MongoDB");

    await Promise.all([
      BuffetBooking.deleteMany(),
      Booking.deleteMany(),
      Review.deleteMany(),
      Promotion.deleteMany(),
      BuffetDinner.deleteMany(),
      MembershipTier.deleteMany(),
      User.deleteMany(),
      Room.deleteMany(),
    ]);
    console.log("Existing seedable collections are deleted");

    const createdUsers = await User.create(users);
    const createdRooms = await Room.insertMany(rooms);
    const createdMembershipTiers = await MembershipTier.insertMany(
      DEFAULT_MEMBERSHIP_TIERS.map((tier) => ({ ...tier, active: true })),
    );
    const createdBuffetDinners = await BuffetDinner.insertMany(buffetDinners);

    const reviews = [
      {
        user: createdUsers[1]._id,
        room: createdRooms[0]._id,
        rating: 5,
        comment:
          "Clean room, fast Wi-Fi, and a quiet desk setup for remote work.",
      },
      {
        user: createdUsers[2]._id,
        room: createdRooms[1]._id,
        rating: 4,
        comment:
          "The bed was comfortable and the breakfast service was very organized.",
      },
      {
        user: createdUsers[3]._id,
        room: createdRooms[2]._id,
        rating: 5,
        comment:
          "The suite had excellent views and enough space for a family stay.",
      },
      {
        user: createdUsers[4]._id,
        room: createdRooms[4]._id,
        rating: 4,
        comment:
          "Great location in Yangon with helpful staff and smooth check-in.",
      },
      {
        user: createdUsers[5]._id,
        room: createdRooms[7]._id,
        rating: 5,
        comment:
          "Peaceful atmosphere and a very polished room for a weekend trip.",
      },
      {
        user: createdUsers[1]._id,
        room: createdRooms[8]._id,
        rating: 4,
        comment:
          "The executive suite felt premium, especially the living area.",
      },
    ];

    const createdReviews = await Review.insertMany(reviews);

    await Promise.all(
      createdReviews.map((review) =>
        Room.findByIdAndUpdate(review.room, { $push: { reviews: review._id } }),
      ),
    );

    const bookings = [
      {
        user: createdUsers[1]._id,
        room: createdRooms[0]._id,
        startDate: addDays(3),
        endDate: addDays(5),
        customer: {
          name: createdUsers[1].name,
          email: createdUsers[1].email,
        },
        amount: calculateRoomAmount(createdRooms[0].pricePerNight, 2, 0.2),
        membershipTier: "gold",
        referralCode: createdUsers[0].referralCode,
        referralOwner: createdUsers[0]._id,
        daysOfRent: 2,
        rentPerDay: createdRooms[0].pricePerNight,
        paymentInfo: {
          id: "pi_seed_room_001",
          status: "paid",
          method: "card",
        },
        status: "confirmed",
        additionalNote: "Late arrival after 8 PM.",
      },
      {
        user: createdUsers[2]._id,
        room: createdRooms[1]._id,
        startDate: addDays(8),
        endDate: addDays(11),
        customer: {
          name: createdUsers[2].name,
          email: createdUsers[2].email,
        },
        amount: calculateRoomAmount(createdRooms[1].pricePerNight, 3, 0.1),
        membershipTier: "silver",
        daysOfRent: 3,
        rentPerDay: createdRooms[1].pricePerNight,
        paymentInfo: {
          id: "cash_seed_room_002",
          status: "pending",
          method: "cash",
        },
        status: "pending",
        additionalNote: "Prefers a high-floor room.",
      },
      {
        user: createdUsers[3]._id,
        room: createdRooms[2]._id,
        startDate: addDays(-12),
        endDate: addDays(-9),
        customer: {
          name: createdUsers[3].name,
          email: createdUsers[3].email,
        },
        amount: calculateRoomAmount(createdRooms[2].pricePerNight, 3, 0.3),
        membershipTier: "diamond",
        daysOfRent: 3,
        rentPerDay: createdRooms[2].pricePerNight,
        paymentInfo: {
          id: "pi_seed_room_003",
          status: "paid",
          method: "card",
        },
        status: "completed",
        additionalNote: "Anniversary stay.",
      },
      {
        user: createdUsers[4]._id,
        room: createdRooms[4]._id,
        startDate: addDays(15),
        endDate: addDays(17),
        customer: {
          name: createdUsers[4].name,
          email: createdUsers[4].email,
        },
        amount: calculateRoomAmount(createdRooms[4].pricePerNight, 2, 0.2),
        membershipTier: "gold",
        daysOfRent: 2,
        rentPerDay: createdRooms[4].pricePerNight,
        paymentInfo: {
          id: "pi_seed_room_004",
          status: "paid",
          method: "card",
        },
        status: "confirmed",
      },
      {
        user: createdUsers[5]._id,
        room: createdRooms[7]._id,
        startDate: addDays(-4),
        endDate: addDays(-2),
        customer: {
          name: createdUsers[5].name,
          email: createdUsers[5].email,
        },
        amount: calculateRoomAmount(createdRooms[7].pricePerNight, 2, 0.1),
        membershipTier: "silver",
        daysOfRent: 2,
        rentPerDay: createdRooms[7].pricePerNight,
        paymentInfo: {
          id: "pi_seed_room_005",
          status: "refunded",
          method: "card",
        },
        status: "cancelled",
        cancelledAt: addDays(-5),
        cancelReason: "Guest travel schedule changed.",
        refundInfo: {
          id: "re_seed_room_005",
          amount: calculateRoomAmount(createdRooms[7].pricePerNight, 2, 0.1)
            .total,
          status: "succeeded",
          refundedAt: addDays(-4),
        },
      },
    ];

    await Booking.insertMany(bookings);

    await Promotion.insertMany([
      {
        code: "SUMMER15",
        description: "15% off selected single and double rooms.",
        discountType: "percentage",
        discountValue: 15,
        validFrom: addDays(-7),
        validTo: addDays(45),
        active: true,
        maxUses: 120,
        usedCount: 18,
        applicableRooms: [
          createdRooms[0]._id,
          createdRooms[1]._id,
          createdRooms[4]._id,
        ],
      },
      {
        code: "SUITE50",
        description: "Flat $50 discount for premium suite bookings.",
        discountType: "fixed",
        discountValue: 50,
        validFrom: addDays(-3),
        validTo: addDays(60),
        active: true,
        maxUses: 40,
        usedCount: 7,
        applicableRooms: [
          createdRooms[2]._id,
          createdRooms[5]._id,
          createdRooms[8]._id,
        ],
      },
      {
        code: "WEEKEND25",
        description: "Weekend city escape promotion for active members.",
        discountType: "percentage",
        discountValue: 25,
        validFrom: addDays(1),
        validTo: addDays(90),
        active: true,
        maxUses: 75,
        usedCount: 0,
        applicableRooms: [createdRooms[3]._id, createdRooms[6]._id],
      },
    ]);

    await BuffetBooking.insertMany([
      {
        user: createdUsers[1]._id,
        buffetDinner: createdBuffetDinners[0]._id,
        customer: {
          name: createdUsers[1].name,
          email: createdUsers[1].email,
        },
        guestCount: 2,
        pricePerGuest: createdBuffetDinners[0].pricePerGuest,
        amount: calculateBuffetAmount(createdBuffetDinners[0].pricePerGuest, 2),
        paymentInfo: {
          id: "pi_seed_buffet_001",
          status: "paid",
          method: "card",
        },
        status: "confirmed",
        additionalNote: "Window-side table if available.",
      },
      {
        user: createdUsers[2]._id,
        buffetDinner: createdBuffetDinners[1]._id,
        customer: {
          name: createdUsers[2].name,
          email: createdUsers[2].email,
        },
        guestCount: 4,
        pricePerGuest: createdBuffetDinners[1].pricePerGuest,
        amount: calculateBuffetAmount(createdBuffetDinners[1].pricePerGuest, 4),
        paymentInfo: {
          id: "cash_seed_buffet_002",
          status: "pending",
          method: "cash",
        },
        status: "pending",
        additionalNote: "One guest prefers non-spicy dishes.",
      },
      {
        user: createdUsers[3]._id,
        buffetDinner: createdBuffetDinners[2]._id,
        customer: {
          name: createdUsers[3].name,
          email: createdUsers[3].email,
        },
        guestCount: 3,
        pricePerGuest: createdBuffetDinners[2].pricePerGuest,
        amount: calculateBuffetAmount(createdBuffetDinners[2].pricePerGuest, 3),
        paymentInfo: {
          id: "pi_seed_buffet_003",
          status: "paid",
          method: "card",
        },
        status: "confirmed",
      },
      {
        user: createdUsers[5]._id,
        buffetDinner: createdBuffetDinners[3]._id,
        customer: {
          name: createdUsers[5].name,
          email: createdUsers[5].email,
        },
        guestCount: 1,
        pricePerGuest: createdBuffetDinners[3].pricePerGuest,
        amount: calculateBuffetAmount(createdBuffetDinners[3].pricePerGuest, 1),
        paymentInfo: {
          id: "pi_seed_buffet_004",
          status: "paid",
          method: "card",
        },
        status: "confirmed",
        additionalNote: "Tea service requested.",
      },
    ]);

    console.log("Seed data added");
    console.log({
      users: createdUsers.length,
      rooms: createdRooms.length,
      membershipTiers: createdMembershipTiers.length,
      reviews: createdReviews.length,
      bookings: bookings.length,
      promotions: 3,
      buffetDinners: createdBuffetDinners.length,
      buffetBookings: 4,
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log(error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
