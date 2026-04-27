# Detailed Functionalities

This document explains the major functionalities of the Hotel Booking Management System, how they are implemented, why the implementation approach is useful, and what business value each feature brings.

## 1. User Authentication and Account Management

### What It Does

Users can register, log in, log out, update their profile, upload an avatar, change their password, and reset a forgotten password through email.

### How It Is Implemented

- The backend exposes authentication and profile operations through GraphQL user mutations and queries.
- Passwords are checked with `bcryptjs`.
- After login, the server creates a JWT and stores it in an HTTP-only cookie.
- The Apollo server reads the cookie on each request, validates the JWT, and attaches the authenticated user to the GraphQL context.
- Profile avatar uploads are sent to Cloudinary, and old avatar images are deleted when replaced.
- Password reset uses a generated reset token, stores the hashed token with an expiry time, sends a reset link by email, and validates the token before allowing a password update.

### Why This Is Implemented Well

- HTTP-only cookies reduce frontend exposure of authentication tokens.
- Central GraphQL context authentication keeps permission checks consistent across modules.
- Password reset tokens are hashed before storage, which is safer than storing raw reset tokens.
- Cloudinary cleanup prevents unused avatar files from accumulating.

### Business Value

- Customers can manage their own accounts, reducing staff workload.
- Secure login and password recovery improve customer trust.
- Profile management creates a more personalized customer experience.
- Admins can identify and manage customers more easily.

## 2. Role-Based Access Control

### What It Does

The system separates normal customer features from admin-only features. Admins can manage rooms, customers, bookings, promotions, buffets, membership tiers, reviews, and dashboard reports.

### How It Is Implemented

- Protected frontend routes use `ProtectPage`.
- Backend authorization is handled with `graphql-shield`.
- The permission layer checks whether the user is authenticated and whether the user's role includes `admin`.
- Sensitive GraphQL operations, such as room creation, promotion management, customer management, and dashboard data, require admin access.

### Why This Is Implemented Well

- Permissions are enforced on the backend, not only in the UI.
- Authorization rules are centralized in one middleware file, making them easier to audit and maintain.
- Frontend route protection improves user experience by hiding restricted screens from unauthorized users.

### Business Value

- Protects business data from unauthorized access.
- Reduces operational risk by limiting administrative actions to approved users.
- Supports real-world hotel workflows where staff and customers need different access levels.

## 3. Room Browsing and Room Management

### What It Does

Customers can browse rooms, search and filter available rooms, view room details, images, ratings, and reviews. Admins can create, update, delete, and manage room information.

### How It Is Implemented

- Room data is stored in MongoDB through a Mongoose room model.
- The GraphQL room API supports room listing, pagination, searching, filtering, and fetching details by ID.
- Admin room creation and updates support multiple image uploads to Cloudinary.
- When a room image is deleted, the system removes it from both Cloudinary and the room document.
- Room details populate related reviews and user information.

### Why This Is Implemented Well

- Pagination keeps room listing pages efficient as data grows.
- Search and filters improve discoverability.
- Cloudinary storage keeps image delivery separate from application storage.
- The backend cleans up uploaded images if room creation fails, preventing orphaned media.

### Business Value

- High-quality room listings help customers make booking decisions.
- Search and filtering reduce friction and increase conversion.
- Admins can keep inventory, pricing, and room information up to date without developer support.
- Better room presentation can directly increase booking revenue.

## 4. Room Booking

### What It Does

Authenticated customers can create room bookings by choosing dates, customer details, notes, and optional referral codes. Users can view their booking history and admins can manage all bookings.

### How It Is Implemented

- Booking creation is handled through GraphQL mutations.
- The backend checks for overlapping bookings before creating a new booking.
- Booked dates can be requested by room ID so the frontend can prevent users from selecting unavailable dates.
- Booking amounts are calculated on the backend using rent per day, number of days, tax, membership discount, and referral discount.
- User booking history includes metadata such as total bookings, unpaid bookings, and total unpaid amount.
- Admin booking lists populate room, user, and referral owner information.

### Why This Is Implemented Well

- Overlap detection protects room inventory from double booking.
- Server-side amount calculation is more reliable than trusting frontend totals.
- Returning booked dates improves the booking form experience.
- Metadata in the booking history helps users quickly understand pending actions.

### Business Value

- Prevents lost revenue and customer disputes caused by double bookings.
- Automates reservation processing.
- Gives customers self-service booking access at any time.
- Gives staff a centralized view of booking demand and payment status.

## 5. Payments and Payment Confirmation

### What It Does

Customers can pay for room bookings and buffet bookings online through Stripe. The system confirms bookings when Stripe payment succeeds.

### How It Is Implemented

- The backend creates Stripe Checkout sessions for room bookings and buffet bookings.
- Checkout sessions include customer email, product details, total amount, and metadata identifying the booking type.
- Stripe redirects customers to success or cancellation pages.
- A Stripe webhook listens for `checkout.session.completed`.
- When payment succeeds, the webhook updates the related room booking or buffet booking with payment information and sets the status to confirmed.

### Why This Is Implemented Well

- Stripe Checkout avoids building and storing sensitive card entry logic inside the app.
- Webhook-based confirmation is more reliable than relying only on frontend redirect status.
- Metadata allows one webhook handler to support multiple booking types.
- Payment information is stored on the booking record for later reporting and support.

### Business Value

- Enables immediate online payments.
- Reduces manual payment handling.
- Improves cash flow by confirming paid bookings automatically.
- Creates a clear payment audit trail for operations and accounting.

## 6. Booking Cancellation and Refund Support

### What It Does

Users can cancel eligible room bookings and buffet bookings. Room bookings paid by card can trigger refunds through Stripe.

### How It Is Implemented

- Cancellation checks whether the requester is either the booking owner or an admin.
- Room bookings cannot be cancelled by normal users after the check-in date.
- If a room booking was paid by card, the backend creates a Stripe refund.
- Cancelled bookings store cancellation time, reason, status, and refund information.
- Cancelled room bookings are excluded from overlap checks, making the dates available again.

### Why This Is Implemented Well

- Ownership checks prevent users from cancelling bookings that do not belong to them.
- Date validation protects business rules around check-in.
- Refund information is stored directly on the booking, making support and auditing easier.
- Excluding cancelled bookings from availability calculations keeps inventory accurate.

### Business Value

- Gives customers controlled self-service cancellation.
- Reduces support workload for common cancellation cases.
- Keeps booking availability accurate after cancellations.
- Creates a transparent record of refunds and cancellation reasons.

## 7. Buffet Dinner Management and Booking

### What It Does

Admins can create and manage buffet dinner events. Customers can browse available buffet dinners, view details, reserve seats, pay, and cancel bookings.

### How It Is Implemented

- Buffet dinners include title, cuisine category, description, image URL, start/end time, dishes, capacity, price, facilities, and active status.
- The backend validates that buffet end time is after start time.
- Included dishes are validated against the dish catalog and cuisine category.
- Available buffet dinners only include active future events.
- Seat capacity is calculated from existing non-cancelled bookings.
- Customers cannot book more seats than the remaining capacity.
- Buffet booking amount is calculated from price per guest plus tax.

### Why This Is Implemented Well

- Capacity validation prevents overbooking seats.
- Time validation prevents invalid event schedules.
- Dish validation keeps buffet data consistent.
- Active/future filtering prevents customers from booking expired events.
- Server-side price calculation keeps totals consistent and trustworthy.

### Business Value

- Adds an additional revenue stream beyond room bookings.
- Helps hotels promote dining events and packages.
- Prevents operational problems caused by overcapacity.
- Gives management better control over event availability and guest counts.

## 8. Promotions and Discounts

### What It Does

Admins can create and manage promotions with discount type, discount value, validity dates, active status, maximum uses, and usage count.

### How It Is Implemented

- Promotions are managed through GraphQL queries and mutations.
- Admin-only permissions protect promotion creation, updates, and deletion.
- Promotion records store validity windows, activity status, usage limits, and usage count.
- Promotion management screens allow staff to configure discounts without code changes.

### Why This Is Implemented Well

- Promotion data is structured, not hard-coded.
- Admin control enables fast business updates.
- Usage limits and valid dates support realistic campaign rules.
- Centralized promotion records make reporting and auditing easier.

### Business Value

- Supports marketing campaigns and seasonal offers.
- Helps increase occupancy during low-demand periods.
- Allows controlled discounting without losing operational oversight.
- Gives the business flexibility to respond quickly to demand changes.

## 9. Membership Tiers and Referral Rewards

### What It Does

The system supports membership tiers, tier-based discounts, referral codes, and referral points.

### How It Is Implemented

- Admins can create, update, activate, deactivate, and delete membership tiers.
- Membership tiers define discount percentages.
- Users assigned to a membership tier can receive automatic booking discounts.
- Members can have referral codes.
- Referral codes are normalized to uppercase before validation.
- Referral discounts apply to non-member users when a valid active member referral code is used.
- Referral owners receive referral points after successful referred booking creation.

### Why This Is Implemented Well

- Discounts are calculated on the backend from stored tier settings.
- Referral validation checks that the referral owner is active and has a membership tier.
- Referral logic encourages loyalty without allowing invalid codes.
- Admins can adjust tier benefits without changing code.

### Business Value

- Encourages repeat bookings through loyalty discounts.
- Turns existing customers into acquisition channels through referrals.
- Helps segment customers by value.
- Gives the hotel a practical loyalty program that can increase retention.

## 10. Reviews and Ratings

### What It Does

Customers can create or update reviews for rooms they have paid for. Admins can view and delete reviews.

### How It Is Implemented

- The backend checks whether the user has a paid booking for the room before allowing a review.
- A user can create a review or update an existing review for the same room.
- Reviews are linked to both the room and user.
- Room details populate reviews and reviewer information.
- Admins can delete reviews, and deleted review IDs are removed from the related room.

### Why This Is Implemented Well

- Paid-booking validation reduces fake reviews.
- Updating an existing review avoids duplicate reviews from the same user for the same room.
- Linking reviews to rooms supports rating display on room detail pages.
- Admin moderation protects content quality.

### Business Value

- Builds trust with future customers.
- Helps customers choose rooms confidently.
- Gives management feedback about room quality and service.
- Improves conversion by showing authentic guest experiences.

## 11. Admin Dashboard and Reporting

### What It Does

Admins can view business metrics such as sales, total bookings, pending amounts, paid cash, card sales, confirmed bookings, cancelled bookings, average booking value, booked room count, payment distribution, and booking status distribution.

### How It Is Implemented

- The backend uses MongoDB aggregation to calculate reporting data for a selected date range.
- Sales and booking counts are grouped by date.
- The system fills missing dates with zero values so charts remain continuous.
- Additional aggregate facets calculate payment totals, payment method distribution, status distribution, cancellations, confirmations, and unique booked rooms.
- The frontend displays metrics using dashboard cards and charts.

### Why This Is Implemented Well

- Aggregation happens in the database, which is efficient for reporting.
- Date normalization makes charts easier to read.
- Using one reporting query for multiple metrics reduces repeated database calls.
- Separating dashboard data behind admin permissions protects sensitive business information.

### Business Value

- Helps managers monitor revenue and booking trends.
- Supports better pricing, staffing, and marketing decisions.
- Makes unpaid or pending revenue visible.
- Helps identify cancellation patterns and payment preferences.

## 12. Customer Management

### What It Does

Admins can view customers, inspect customer details, update roles, activate or deactivate accounts, assign membership tiers, and adjust referral points.

### How It Is Implemented

- Customer management is exposed through admin-only GraphQL user queries and mutations.
- User updates support role changes, active status changes, membership tier assignment, and referral point adjustment.
- Referral point adjustment rejects negative changes in the current implementation.
- Member users without referral codes are automatically assigned codes when needed.

### Why This Is Implemented Well

- Admin operations are permission-protected.
- User status and roles are stored centrally on the user record.
- Membership and referral data are managed from the same customer module, keeping customer value data in one place.

### Business Value

- Lets staff manage customer lifecycle and access.
- Supports loyalty and VIP customer workflows.
- Allows the business to disable problematic or inactive accounts.
- Improves customer service by giving admins a full customer profile.

## 13. Invoice Generation

### What It Does

Customers can view invoices for bookings and generate invoice-style documents.

### How It Is Implemented

- The frontend includes an invoice component.
- The client uses `html2canvas-pro` and `jsPDF` to capture invoice content and produce a PDF-style output.
- Invoice routes are protected so users must be authenticated.

### Why This Is Implemented Well

- Invoice generation is handled client-side, reducing backend document processing complexity.
- PDF export gives users a portable record of their booking.
- Protected routes prevent unauthenticated access to invoice pages.

### Business Value

- Gives customers payment and booking records.
- Reduces requests for manual receipts.
- Supports business travelers who need documentation for reimbursement.

## 14. Tourist Attractions

### What It Does

The application includes a tourist attractions page that shows local destination information for guests.

### How It Is Implemented

- Attraction data is stored in frontend data files.
- The tourist attractions page is routed at `/attractions`.
- The feature is available from the user-facing layout and does not require backend calls.

### Why This Is Implemented Well

- Static local attraction data is simple, fast, and reliable.
- It avoids unnecessary backend complexity for content that does not need frequent updates.
- It enriches the guest experience without affecting booking workflows.

### Business Value

- Improves the value of the hotel website beyond room booking.
- Helps tourists plan their trip, increasing engagement.
- Can encourage longer stays by highlighting nearby activities.
- Supports the hotel brand as a travel helper, not only an accommodation provider.

## 15. Real-Time Booking Notifications

### What It Does

The system supports GraphQL subscription notifications for new bookings and cancelled bookings.

### How It Is Implemented

- The server creates a WebSocket server on the same `/graphql` path.
- GraphQL subscriptions are enabled with `graphql-ws`.
- Booking creation publishes a `NEW_BOOKING` event.
- Room booking cancellation publishes a `BOOKING_CANCELLED` event.
- The Apollo Client is configured to split GraphQL operations between HTTP and WebSocket links.

### Why This Is Implemented Well

- Subscriptions are only used for real-time events, while normal queries and mutations remain on HTTP.
- The client uses Apollo split links, which is a standard pattern for GraphQL apps.
- Real-time updates can be added to admin workflows without polling.

### Business Value

- Staff can respond faster to new bookings and cancellations.
- Reduces the need for manual refreshes.
- Improves operational awareness during busy periods.

## 16. Data Validation and Error Handling

### What It Does

The application validates important business rules and handles errors consistently across backend modules.

### How It Is Implemented

- Controllers are wrapped with a shared `errorHandler`.
- Backend logic checks important rules such as room booking overlap, buffet capacity, buffet time validity, review eligibility, booking ownership, and password reset validity.
- Frontend forms use validation schemas in the `client/src/schema` directory.
- GraphQL returns structured errors for invalid operations.

### Why This Is Implemented Well

- Business rules are enforced on the backend, where users cannot bypass them.
- Shared error handling reduces repeated try/catch logic.
- Frontend validation improves usability before requests reach the server.
- Backend validation protects data integrity even if frontend validation is skipped.

### Business Value

- Reduces invalid bookings and operational mistakes.
- Improves user experience with clear validation feedback.
- Protects the quality and reliability of business data.

## 17. Seed Data and Development Support

### What It Does

The backend includes a seed script to populate initial data for development or demonstration.

### How It Is Implemented

- The server package includes `npm run db-seed`.
- Seeder files are stored in `server/seeder`.
- The script compiles and runs the seeder with TypeScript output in a temporary folder.

### Why This Is Implemented Well

- Developers and evaluators can quickly prepare a usable dataset.
- Seed data helps test the full workflow without manually creating every record.
- Keeping seed logic separate from runtime code avoids polluting production behavior.

### Business Value

- Speeds up development and testing.
- Makes demos more reliable.
- Helps new team members understand the system faster.

## Overall Business Impact

The system brings value by combining customer self-service, operational administration, online payment processing, loyalty management, dining event sales, and business reporting in one platform.

Key business benefits include:

- Increased booking conversion through searchable room listings and online reservations.
- Reduced manual workload through self-service booking, payment, cancellation, invoices, and profile management.
- Better revenue visibility through dashboards and payment tracking.
- More revenue channels through buffet dinner booking and promotional campaigns.
- Higher customer retention through membership tiers, referral rewards, and reviews.
- Lower operational risk through role-based access, backend validation, payment webhooks, and inventory checks.

## Summary

This project is more than a basic booking form. It models realistic hotel operations by connecting rooms, customers, bookings, payments, reviews, promotions, memberships, buffets, and reporting into a single full-stack system. The implementation uses strong separation between frontend and backend responsibilities, protects important business actions with permissions, and keeps critical calculations and validations on the server where they are reliable.
