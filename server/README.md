# Server Architecture - Hotel Booking Management System

Express + Apollo GraphQL backend with MongoDB, Stripe payments, and real-time subscriptions.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express 4.x
- **API**: Apollo Server 4.x (GraphQL)
- **Database**: MongoDB Atlas with Mongoose 8.x
- **Auth**: JWT (HTTP-only cookies) + GraphQL Shield
- **Real-time**: GraphQL subscriptions (WebSocket)
- **Payments**: Stripe
- **Media**: Cloudinary
- **Email**: Nodemailer (SMTP)

## Architecture Overview

```
Client Request (HTTP/WebSocket)
    ↓
Express Middleware (JSON, CORS, Cookies)
    ↓
Apollo Server (/graphql endpoint)
    ↓
GraphQL Shield (Role-based Permissions)
    ↓
Resolvers (graphql/resolvers/)
    ↓
Controllers (Business Logic)
    ↓
Mongoose Models → MongoDB Atlas
```

## Directory Structure

```
server/
├── app.ts                      # Express app entry point
├── apollo/
│   └── server.ts               # Apollo Server setup
├── graphql/
│   ├── typeDefs/              # GraphQL schema definitions
│   │   ├── user.ts
│   │   ├── room.ts
│   │   ├── booking.ts
│   │   ├── review.ts
│   │   ├── promotion.ts
│   │   ├── membership.ts
│   │   └── buffet.ts
│   └── resolvers/             # Resolver functions
│       ├── user.ts
│       ├── room.ts
│       ├── booking.ts
│       ├── review.ts
│       ├── promotion.ts
│       ├── membership.ts
│       └── buffet.ts
├── controllers/                # Business logic layer
│   ├── auth.controller.ts
│   ├── room.controller.ts
│   ├── booking.controller.ts
│   ├── review.controller.ts
│   ├── promotion.controller.ts
│   ├── membership.controller.ts
│   └── buffet.controller.ts
├── models/                    # Mongoose schemas
│   ├── User.ts
│   ├── Room.ts
│   ├── Booking.ts
│   ├── Review.ts
│   ├── Promotion.ts
│   ├── MembershipTier.ts
│   ├── BuffetDinner.ts
│   └── BuffetBooking.ts
├── middlewares/
│   ├── permissions/           # GraphQL Shield rules
│   │   └── index.ts
│   └── error-handler.ts
├── config/
│   └── database.ts            # MongoDB connection
├── utils/                     # Utilities & helpers
├── types/                     # TypeScript definitions
├── seeder/                    # Database seeder
└── .env.local                 # Environment variables
```

## API Design

### GraphQL Endpoint
- **HTTP**: `http://localhost:4000/graphql`
- **WebSocket**: `ws://localhost:4000/graphql`

### Query Pattern
```graphql
# Public queries
query GetRooms { rooms { id name price } }
query GetRoom($id: ID!) { room(id: $id) { name images reviews { rating } } }

# Authenticated queries
query MyBookings { myBookings { checkIn checkOut status } }

# Admin queries
query GetUsers { users { email role membershipTier } }
query DashboardStats { dashboardStats { totalRevenue bookingsByStatus } }
```

### Mutation Pattern
```graphql
# Auth
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) { user { email } }
}

# Booking
mutation CreateBooking($input: BookingInput!) {
  createBooking(input: $input) { id status totalPrice }
}

# Admin actions
mutation CreateRoom($input: RoomInput!) {
  createRoom(input: $input) { id name price }
}
```

### Subscriptions (Real-time)
```graphql
subscription OnNewBooking {
  newBooking { id room { name } user { email } }
}

subscription OnBookingCancelled {
  bookingCancelled { id status }
}
```

## Authentication & Security

### JWT Authentication
- Tokens stored in **HTTP-only cookies** (prevents XSS)
- Verified on each GraphQL request via `context`
- `apollo-server-express` extracts token from cookies

```typescript
// Context function
context: async ({ req }) => {
  const token = req.cookies.token;
  const user = token ? verifyJWT(token) : null;
  return { user };
}
```

### GraphQL Shield (Permissions)
Role-based access control with rules:

```typescript
import { shield, rule, and, or, not } from 'graphql-shield';

const isAuthenticated = rule()(async (parent, args, { user }) => {
  return user !== null;
});

const isAdmin = rule()(async (parent, args, { user }) => {
  return user?.role === 'admin';
});

const permissions = shield({
  Query: {
    rooms: isAuthenticated,
    users: isAdmin,
    dashboardStats: isAdmin
  },
  Mutation: {
    createBooking: isAuthenticated,
    createRoom: isAdmin,
    deleteRoom: isAdmin
  }
});
```

### Stripe Webhook Security
```typescript
// Verify webhook signature
const signature = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

## Database Models

### Collections
1. **User** - Authentication, profile, role, membership tier, referral points
2. **Room** - Hotel rooms with details, pricing, availability, images, reviews
3. **Booking** - Reservations with payment info, dates, customer details
4. **Review** - Room ratings and comments
5. **Promotion** - Discount codes with validity and usage limits
6. **MembershipTier** - Tier definitions (Silver, Gold, Diamond)
7. **BuffetDinner** - Buffet events with menus and capacity
8. **BuffetBooking** - Buffet dinner reservations

### Relationships
```typescript
// Booking references Room and User
bookingSchema.findById('room', { type: Schema.Types.ObjectId, ref: 'Room' });
bookingSchema.findById('user', { type: Schema.Types.ObjectId, ref: 'User' });

// Review belongs to Room and User
reviewSchema.findById('room', { type: Schema.Types.ObjectId, ref: 'Room' });
reviewSchema.findById('user', { type: Schema.Types.ObjectId, ref: 'User' });
```

## External Integrations

### Stripe (Payments)
- **Checkout Sessions**: Redirect users to Stripe for payment
- **Webhooks**: Listen for payment confirmations
- **Refunds**: Process refunds for cancellations

```typescript
// Create checkout session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{ price_data: {...}, quantity: 1 }],
  mode: 'payment',
  success_url: `${BASE_URL}/booking-success`,
  cancel_url: `${BASE_URL}/booking-cancel`,
});
```

### Cloudinary (Image Storage)
- Room images uploaded to Cloudinary
- User avatars stored in Cloudinary
- Automatic image optimization

### SMTP (Email)
- Password reset emails via Mailtrap/Nodemailer
- Booking confirmation emails

## Scripts

```bash
# Development
npm run dev          # Start with ts-node + nodemon

# Build
npm run build         # Compile TypeScript

# Production
npm start             # Run compiled JavaScript

# Database
npm run seed          # Seed database with sample data

# Testing
npm test              # Run Jest tests
```

## Environment Variables

```bash
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://...@cluster.mongodb.net/hotel-booking

# JWT
JWT_SECRET=your-jwt-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# SMTP
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USERNAME=...
SMTP_PASSWORD=...
```

## Request Flow Example

### Room Booking Flow
```
1. Client sends GraphQL mutation: createBooking(...)
2. Apollo Server receives request
3. GraphQL Shield checks: isAuthenticated?
4. Resolver calls: bookingController.createBooking(...)
5. Controller:
   - Validates input
   - Checks room availability
   - Calculates total price (with promo/referral)
   - Creates Stripe Checkout Session
   - Saves booking to MongoDB (status: pending)
6. Returns checkout URL to client
7. Client redirected to Stripe
8. User completes payment
9. Stripe sends webhook to: POST /api/payment/webhook
10. Webhook handler:
    - Verifies signature
    - Updates booking status to "confirmed"
    - Triggers GraphQL subscription: NEW_BOOKING
11. Admin receives real-time notification via WebSocket
```

## Error Handling

Centralized error handling middleware:

```typescript
// Custom error classes
class AuthenticationError extends Error {...}
class AuthorizationError extends Error {...}
class ValidationError extends Error {...}

// Error middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message
  });
});
```

## Development

1. Install dependencies: `npm install`
2. Copy `.env.local.example` to `.env.local`
3. Fill in environment variables
4. Run seeder: `npm run seed`
5. Start development server: `npm run dev`
6. Open GraphQL Playground: `http://localhost:4000/graphql`

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- booking.test.ts
```

## Deployment

1. Build: `npm run build`
2. Set production environment variables
3. Start: `npm start`
4. Ensure MongoDB Atlas IP whitelist includes server IP
5. Configure Stripe webhook endpoint in Stripe dashboard
