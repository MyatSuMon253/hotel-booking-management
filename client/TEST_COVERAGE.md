# Client Test Coverage Notes

## Current Coverage Status
The client test suite is currently verified through `npm test`, but formal coverage reporting is not yet configured in `client/package.json` or `client/vite.config.ts`.

## Current Test Commands
- `npm test`
- `npm run test:watch`

## Planned Coverage Command
When formal coverage support is added, the expected execution command is:

```bash
vitest run --coverage
```

Recommended follow-up script:

```bash
npm run test:coverage
```

## Expected Coverage Reporting Shape
Once coverage is enabled, reporting should summarize:
- Overall statements, branches, functions, and lines
- Coverage for `src/lib`
- Coverage for `src/schema`
- Coverage for `src/components/common`

## Current Covered Areas
- `src/lib`
  utility logic such as formatting, amount calculation, date handling, search-param behavior, and filter constants
- `src/schema`
  validation behavior for auth, user, booking, buffet, promotion, review, room, and membership-tier forms
- `src/components/common`
  simple presentation and navigation controls including `Loader`, `NotFound`, and `Pagination`

## Currently Uncovered Or Lightly Covered Areas
- Apollo hooks and client cache behavior
- Page-level forms and submit flows
- Admin screens
- Route protection flows
- Dashboard charts
- Invoice generation and download flows
- File upload interactions
- Payment and checkout UI flows

## Required Tooling Changes For Formal Coverage
- Add a `test:coverage` script in `client/package.json`
- Enable Vitest coverage reporting in `client/vite.config.ts`
- Optionally define coverage include/exclude groups so reporting aligns with:
  `src/lib`
  `src/schema`
  `src/components/common`

## Recommendations
- Keep the current unit suite as the fast baseline
- Add page-level form tests next for auth, booking, and selected admin flows
- Add Apollo mocking for data-driven page components before attempting wider UI coverage
- Only report numeric client coverage after a real coverage run has been configured and executed
