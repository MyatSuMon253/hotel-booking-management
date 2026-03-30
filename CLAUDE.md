# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack hotel booking management app with:
- **Server**: Node.js + Express + Apollo Server (GraphQL) + Mongoose + Stripe
- **Client**: React 19 + Vite + Apollo Client + Tailwind CSS v4 + shadcn/ui

## Commands

### Server (`/server`)
```bash
npm run dev        # Start with nodemon + ts-node (no build step needed)
npm run db-seed    # Seed the database
```

### Client (`/client`)
```bash
npm run dev        # Vite dev server on http://localhost:5173
npm run build      # tsc + vite build
npm run lint       # ESLint
npm run preview    # Preview production build
```

Both apps are developed independently — run each from their respective directories.

## Architecture

### Server
- `app.ts` — Express entry point; loads env from `config/.env.local`, mounts Apollo and Stripe webhook
- `apollo/apolloServer.ts` — Combines all typeDefs/resolvers into a schema, applies `graphql-shield` permissions middleware, mounts at `/graphql`, registers the Stripe webhook at `POST /api/payment/webhook`
- `graphql/typeDefs/` and `graphql/resolvers/` — Split by domain: `room`, `user`, `booking`, `payment`
- `controllers/` — Business logic called by resolvers. Wrapped with `middlewares/errorHandler.ts` (a HOF that normalizes Mongoose errors into GraphQL-friendly Error objects)
- `middlewares/permissions.ts` — graphql-shield rules: `isAuthenticated` and `isAdmin` (role-based)
- `models/` — Mongoose models: `Room`, `Booking`, `User`
- `utils/cloudinary.ts` — Image upload helpers (used by room/user controllers)

**Auth flow**: JWT stored in an HTTP-only cookie. `apolloServer.ts` context function reads the cookie, verifies it, and attaches the full `User` doc to GraphQL context. graphql-shield checks `context.user` for protected operations.

**Stripe flow**: Checkout session created via a GraphQL mutation → client redirects to Stripe → Stripe posts to `/api/payment/webhook` → booking `paymentInfo` updated on `checkout.session.completed`.

### Client
- `main.tsx` — React Router v7 routes, all wrapped in `ApolloProvider`. Protected routes use `<ProtectPage roles={[...]}>`.
- `apollo/apolloClient.ts` — Apollo Client with `credentials: "include"` (sends cookies), server URL from `VITE_SERVER_URL`
- `graphql/queries/` and `graphql/mutations/` — Raw `gql` documents by domain
- `components/pages/` — Route-level page components
- `components/ui/` — shadcn/ui components (shadcn style: `new-york`, base color: `zinc`)
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- `types/` — Shared TypeScript interfaces for Room, Booking, User

### Environment variables
- Server: `config/.env.local` — `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, Cloudinary vars, email vars
- Client: `.env` — `VITE_SERVER_URL` (e.g., `http://localhost:4000/graphql`)

## Key Patterns

- All server controller functions are wrapped with `errorHandler` (the HOF in `middlewares/errorHandler.ts`) which handles Mongoose `CastError`, `ValidationError`, and `MongoServerError`.
- GraphQL schema is built with `@graphql-tools/schema` (`makeExecutableSchema`), then permissions applied via `applyMiddleware(schema, permissions)` from `graphql-middleware`.
- shadcn/ui components are added via `npx shadcn add <component>` (configured in `components.json`).
- Stripe webhook requires the raw request body — Express is configured in `app.ts` to preserve it as `req.rawBody`.
