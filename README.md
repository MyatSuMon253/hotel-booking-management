# Hotel Booking Management System

A full-stack hotel booking management application for customers and hotel administrators. The project combines a React client with an Express/Apollo GraphQL server to support room browsing, reservations, buffet dinner bookings, online payments, customer account management, reviews, promotions, membership tiers, and admin reporting.

## Project Overview

The application is split into two main workspaces:

- `client/` - React, TypeScript, Vite, Apollo Client, React Router, Tailwind CSS, shadcn-style UI components, Recharts, and form validation.
- `server/` - Express, Apollo Server, GraphQL, MongoDB/Mongoose, GraphQL Shield permissions, Stripe payments, Cloudinary image upload, Nodemailer email support, and GraphQL subscriptions.

The frontend communicates with the backend through GraphQL over HTTP and WebSocket subscriptions. Authentication is cookie-based, and protected routes are separated between regular customer access and admin-only access.

## Core Functionalities

### Customer Features

- Register, log in, log out, and manage a user profile.
- Reset forgotten passwords through email-based reset flow.
- Browse available hotel rooms with filtering and pagination.
- View room details, images, ratings, and reviews.
- Create room bookings with customer information, date selection, referral codes, and notes.
- Pay for bookings through Stripe checkout.
- View booking history, booking status, payment status, and invoices.
- Cancel eligible bookings.
- Browse available buffet dinners.
- View buffet dinner details, included dishes, capacity, pricing, and facilities.
- Book buffet dinners and pay through Stripe checkout.
- Cancel buffet bookings.
- Create or update room reviews after eligible bookings.
- Browse local tourist attractions from the application data.

### Admin Features

- Admin dashboard with sales, booking, payment, and status metrics.
- Manage rooms, including create, update, delete, availability, pricing, capacity, location, and images.
- Manage customer accounts, roles, activity status, membership tiers, and referral points.
- View customer details.
- Manage all room bookings and booking statuses.
- Manage buffet dinners and buffet bookings.
- Manage promotions, discount types, active dates, usage limits, and usage counts.
- Manage membership tiers and discount percentages.
- Moderate reviews.
- Receive booking-related GraphQL subscription notifications.

### Backend Features

- GraphQL API for rooms, users, bookings, payments, reviews, promotions, membership tiers, and buffet modules.
- MongoDB persistence through Mongoose models.
- Role-based access control with `graphql-shield`.
- Cookie/JWT authentication.
- Stripe checkout session creation and webhook handling.
- Cloudinary image upload integration.
- SMTP email sending for password reset flows.
- WebSocket support for GraphQL subscriptions.
- Seeder script for initial data.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Apollo Client
- React Router
- Tailwind CSS
- Radix UI / shadcn-style components
- React Hook Form and Zod
- Recharts
- Sonner notifications
- jsPDF and html2canvas-pro for invoice generation

### Backend

- Node.js
- Express
- TypeScript
- Apollo Server
- GraphQL
- MongoDB and Mongoose
- GraphQL Shield
- JWT and cookies
- Stripe
- Cloudinary
- Nodemailer
- GraphQL WebSocket subscriptions

## Project Structure

```text
hotel-booking-management/
├── client/
│   ├── src/
│   │   ├── apollo/              # Apollo Client setup
│   │   ├── components/          # Pages, layouts, admin views, UI components
│   │   ├── data/                # Static tourist attraction data
│   │   ├── graphql/             # Client queries, mutations, subscriptions
│   │   ├── lib/                 # Helpers and utilities
│   │   ├── schema/              # Client validation schemas
│   │   └── types/               # Shared frontend types
│   └── package.json
├── server/
│   ├── apollo/                  # Apollo Server and subscription setup
│   ├── config/                  # Database connection
│   ├── controllers/             # Business logic for modules
│   ├── graphql/                 # TypeDefs and resolvers
│   ├── middlewares/             # Permissions and error handling
│   ├── models/                  # Mongoose models
│   ├── seeder/                  # Seed data and seed script
│   ├── types/                   # Backend TypeScript types
│   └── package.json
├── _uml/                        # UML diagrams
└── docs/                        # Additional documentation
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB database
- Stripe account and webhook secret
- Cloudinary account
- SMTP email account or email provider

### Install Dependencies

Install server dependencies:

```bash
cd server
npm install
```

Install client dependencies:

```bash
cd ../client
npm install
```

## Environment Variables

Create `server/config/.env.local` for the backend:

```env
PORT=4040
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
FROM_NAME=Hotel Booking Management
FROM_EMAIL=no-reply@example.com
```

Create `client/.env` for the frontend:

```env
VITE_SERVER_URL=http://localhost:4040/graphql
VITE_GRAPHQL_WS=ws://localhost:4040/graphql
```

## Running the Application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

By default:

- Frontend: `http://localhost:5173`
- Backend GraphQL endpoint: `http://localhost:4040/graphql`
- Backend GraphQL WebSocket endpoint: `ws://localhost:4040/graphql`

## Useful Scripts

### Client

```bash
npm run dev      # Start Vite development server
npm run build    # Type-check and build production assets
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Server

```bash
npm run dev      # Start backend with nodemon and ts-node
npm run db-seed  # Seed database data
```

## Main Routes

### Public and Customer Routes

- `/` - Home page and room browsing
- `/rooms/:id` - Room detail page
- `/attractions` - Tourist attractions page
- `/register` - User registration
- `/login` - User login
- `/reset` - Forgot password page
- `/reset-password/:token` - Password reset page
- `/profile` - Protected user profile
- `/bookings` - Protected user bookings
- `/bookings/:id/payment` - Room booking payment
- `/bookings/:id/confirmation` - Room booking confirmation
- `/invoice/:id` - Booking invoice
- `/buffets` - Protected buffet dinner list
- `/buffets/:id` - Protected buffet dinner detail
- `/buffet-bookings/:id/payment` - Buffet booking payment
- `/buffet-bookings/:id/confirmation` - Buffet booking confirmation

### Admin Routes

- `/admin/dashboard` - Dashboard metrics
- `/admin/rooms` - Room management
- `/admin/bookings` - Booking management
- `/admin/customers` - Customer management
- `/admin/promotions` - Promotion management
- `/admin/buffet-dinners` - Buffet dinner management
- `/admin/buffet-bookings` - Buffet booking management
- `/admin/membership-tiers` - Membership tier management
- `/admin/reviews` - Review management

## Notes

- The server loads environment variables from `server/config/.env.local`.
- The GraphQL API uses cookie credentials, so the client and server URLs must be configured consistently for local development.
- Stripe webhook processing expects the raw request body and a valid `STRIPE_WEBHOOK_SECRET`.
- Admin functionality requires a user account with the `admin` role.
