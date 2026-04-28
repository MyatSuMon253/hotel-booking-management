# Backend Unit Test Plan

## Objective
Add and maintain mocked unit tests for the backend API in `server/` so core business rules, resolver argument mapping, and utility behavior can be verified without a running MongoDB instance or external services.

## Scope
- Controllers:
  `user`, `room`, `booking`, `buffet`, `review`, `payment`
- GraphQL resolvers:
  `user`, `room`, `booking`, `buffet`, `review`, `payment`, `promotion`, `membershipTier`
- Middleware and utility coverage:
  `errorHandler`, `apiFilters`

## Test Type
Mocked unit testing with Jest and `ts-jest`.

## Out Of Scope
- Real MongoDB integration or `mongodb-memory-server`
- End-to-end GraphQL server tests
- Client-side React tests
- Real Stripe, Cloudinary, SMTP, or Apollo subscription transport calls

## Test Environment
- Runtime: Node.js
- Test runner: Jest
- TypeScript transformer: `ts-jest`
- Commands:
  `npm test`
  `npm run test:coverage`

## Module Scenarios
- `user`:
  register success and duplicate rejection, login success and invalid password, auth cookie write, avatar replacement, profile update, password update, referral validation, forgot password, reset password, delete user
- `room`:
  paginated list result shape, image upload mapping, upload rollback on create failure, room not found, update image append, delete image, delete room
- `booking`:
  overlap rejection, membership discount, referral discount, invalid referral code, cash payment confirmation, card refund on cancellation, booked date expansion, user booking meta, dashboard aggregation mapping
- `buffet`:
  dish lookup, dinner creation normalization, reserved-capacity validation, remaining capacity, booking amount calculation, insufficient seats, payment update, cancellation
- `review`:
  paid-booking eligibility, update existing review, create new review, remove review and room reference
- `payment`:
  room checkout session, buffet checkout session, room webhook update, buffet webhook update, webhook error handling, refund mutation
- `promotion`:
  list, get by id, create with code normalization, update, delete
- `membership tier`:
  seed-on-list, get by id, create normalization, update normalization, delete

## Entry Criteria
- Server dependencies installed
- Jest config present
- Tests compile under `ts-jest`

## Exit Criteria
- `npm test` passes
- `npm run test:coverage` completes
- Coverage artifacts are generated in `server/coverage/`

## Risks And Mitigations
- Mocked Mongoose chains may diverge from runtime query behavior:
  mitigate by keeping chain helpers small and explicit in tests
- Resolver-only tests can miss schema wiring issues:
  mitigate later with GraphQL integration tests if the project needs them
- External service modules remain unexecuted in coverage:
  mitigate by continuing to isolate wrappers and mock their call contracts
