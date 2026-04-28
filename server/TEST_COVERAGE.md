# Backend Test Coverage Summary

## Coverage Run
Generated with:

```bash
npm run test:coverage -- --runInBand
```

Artifacts are available in `server/coverage/`.

## Overall Coverage
| Metric | Coverage |
| --- | --- |
| Statements | 80.76% |
| Branches | 62.14% |
| Functions | 85.25% |
| Lines | 81.26% |

## Coverage By Area
| Area | Statements | Branches | Functions | Lines |
| --- | --- | --- | --- | --- |
| Controllers | 80.17% | 63.47% | 79.2% | 80.59% |
| GraphQL resolvers | 93.62% | 65.78% | 98.42% | 92.89% |
| Middlewares | 54.16% | 27.77% | 50% | 56.52% |
| Utils | 50.9% | 30% | 50% | 58.69% |

## Low-Coverage Areas
- `middlewares/permissions.ts`:
  currently untested because the rules are defined through `graphql-shield` wrappers rather than simple exported functions
- `utils/cloudinary.ts`:
  not directly executed because the suite intentionally mocks upload and delete side effects
- `utils/sendEmail.ts`:
  not directly executed because email sending is mocked
- `controllers/buffet.ts`:
  several admin list/get and permission-negative paths remain uncovered
- `controllers/user.ts`:
  admin update branches and some error paths remain uncovered

## Follow-Up Recommendations
- Add targeted tests for `permissions.ts` by exercising the generated shield rules against mock contexts.
- Add negative-path tests for user admin updates, buffet admin operations, and room/payment not-found branches.
- Keep external wrappers (`cloudinary.ts`, `sendEmail.ts`) mocked in unit tests and cover them later with isolated integration tests if required.
