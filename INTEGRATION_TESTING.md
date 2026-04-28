# Integration Testing Details

## Objective
Document the current integration testing coverage for the hotel booking management project across the `server/` and `client/` applications.

The integration tests verify behavior across module boundaries while still avoiding live external systems such as MongoDB, Stripe, Cloudinary, SMTP, and a running browser.

## Current Integration Test Stack

| Application | Runner | Main Tools |
| --- | --- | --- |
| `server/` | Jest | `ts-jest`, Apollo Server, GraphQL executable schema, `graphql-shield` |
| `client/` | Vitest | `jsdom`, React Testing Library, Apollo `MockedProvider`, React Router |

## Server Integration Tests

### File
`server/__tests__/integration/graphql-schema.spec.ts`

### Purpose
Validate GraphQL behavior through the real executable schema, resolver wiring, field resolvers, and permission middleware.

### Integration Boundary
The test builds an Apollo Server instance from:

- GraphQL type definitions:
  `room`, `user`, `booking`, `payment`, `review`, `promotion`, `membershipTier`, `buffet`
- GraphQL resolvers:
  `room`, `user`, `booking`, `payment`, `review`, `promotion`, `membershipTier`, `buffet`
- Permission middleware:
  `middlewares/permissions.ts`

Controllers and external persistence/service dependencies are mocked so the test focuses on schema integration and authorization behavior.

### Covered Scenarios

| Scenario | Verified Behavior |
| --- | --- |
| Public room query | `getAllRooms` executes through Apollo, schema validation, resolver mapping, and `Room.ratings` field resolver |
| Query variables | `query`, `filters`, and `page` are passed from GraphQL into the room controller |
| Ratings fallback | Missing room rating values resolve to `{ value: 5, count: 0 }` |
| Permission denial | A non-admin authenticated user cannot execute the admin `updateUser` mutation |
| Controller protection | The blocked admin mutation does not call the `updateUser` controller |

### Example Command

```bash
cd server
npm test -- --runTestsByPath __tests__/integration/graphql-schema.spec.ts
```

## Client Integration Tests

### File
`client/src/components/pages/__tests__/home-page.integration.spec.tsx`

### Purpose
Validate a routed, data-driven page flow using React Router, Apollo query mocks, and user interaction.

### Integration Boundary
The test renders `HomePage` with:

- React Router memory routing from `src/test/helpers.tsx`
- Apollo `MockedProvider`
- The real `GET_ALL_ROOMS` GraphQL document
- Page-level composition:
  `HomePage`, `RoomCard`, `Filters`, and `Pagination`

The `react-star-ratings` package is mocked in the test because the dependency renders React elements incompatible with the current React 19 test runtime.

### Covered Scenarios

| Scenario | Verified Behavior |
| --- | --- |
| URL-to-query integration | URL search params are converted into Apollo query variables |
| Loading state | The page renders `Loading ...` while Apollo resolves |
| Data rendering | A mocked room result renders the room title, price, rating count area, and pagination |
| Pagination visibility | Pagination appears when `totalRoomCount` is greater than `perPage` |
| Search interaction | Typing a new search term and pressing Enter calls router navigation with the updated `filter` param |
| Filter preservation | Existing `type`, `available`, and `page` params remain present during search navigation |

### Example Command

```bash
cd client
npm test -- src/components/pages/__tests__/home-page.integration.spec.tsx
```

## Full Test Suite Verification

Current integration tests pass as part of the normal test suites.

```bash
cd server
npm test -- --runInBand
```

Current result:

| Metric | Result |
| --- | --- |
| Test suites | 9 passed |
| Tests | 58 passed |

```bash
cd client
npm test
```

Current result:

| Metric | Result |
| --- | --- |
| Test files | 15 passed |
| Tests | 27 passed |

## What These Tests Do Not Cover

The current integration tests do not start a real HTTP server, connect to MongoDB, open a browser, or call external providers.

Out of scope for the current integration suite:

- Real MongoDB persistence
- Real Express `/graphql` HTTP requests
- WebSocket subscriptions
- Stripe checkout and webhook calls
- Cloudinary uploads
- SMTP email delivery
- Browser-backed end-to-end flows
- Protected client route flows beyond the current `HomePage` route
- Admin dashboard page workflows

## Maintenance Notes

- Keep server integration tests focused on schema, middleware, and resolver wiring.
- Keep database and third-party services mocked unless a separate environment-backed integration suite is introduced.
- Prefer Apollo `MockedProvider` for page-level client integration tests that depend on GraphQL data.
- Add new client integration tests around user workflows that combine routing, form submission, Apollo operations, and visible UI changes.
- If `react-star-ratings` is replaced or upgraded to a React 19-compatible dependency, remove the local mock from the `HomePage` integration spec.

## Recommended Next Integration Targets

| Area | Suggested Test |
| --- | --- |
| Authentication | Login form submits `LOGIN_MUTATION`, updates Apollo reactive auth vars, and navigates by role |
| Protected routes | Unauthenticated users are redirected away from protected pages |
| Booking flow | Room detail page loads room data, selected dates, and booking form state |
| Admin room management | Room list loads data and create/update forms submit mocked mutations |
| Payment flow | Payment page requests checkout session and handles redirect URL behavior |
