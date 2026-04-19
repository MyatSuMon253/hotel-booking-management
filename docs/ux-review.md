# UX Review — Hotel Booking Management

This review covers the entire application as it exists today: the guest browsing and booking flow, the authenticated user's booking management, and the admin's daily operations. It is written from the perspective of the three people who actually use the app — a prospective guest, a returning customer, and the hotel admin who lives inside the dashboard.

The goal is not polish. The goal is to challenge structure where structure is failing the people using the product.

---

## 1. What Works Well

**The booking form is the strongest screen in the app.** Dates open a clear two-month calendar, already-booked nights are visibly unavailable, and the moment a range is picked the summary rebuilds itself — days, nightly rate, tax, total — without the user doing arithmetic. If the dates conflict, the "Place Booking" button actually disables instead of letting the user march into an error. That's the single most important screen in the guest's day, and it has received appropriate attention.

**Date-overlap protection now runs on the server too.** A guest who finds a clever way around the calendar (browser back, refresh timing, two tabs) can no longer double-book a room. That's invisible to the user — but it's exactly the kind of invisible quality that prevents the worst possible customer-service moment.

**Cancellation has the right ceremony.** It opens a dedicated dialog, asks for an optional reason, states plainly that a paid-by-card booking will be refunded automatically, and confirms with a toast that tells the user which of the two things happened ("cancelled" vs. "cancelled and refund issued"). The difference between those two toasts is the difference between anxiety and relief.

**The admin sidebar is honest about scope.** Four items, four workflows, no nested menus pretending to be more than they are. An admin who opens the dashboard knows immediately what the job is.

**Real-time new-booking toasts on the admin dashboard.** A small thing, but it means the admin who is staring at metrics sees the moment a new reservation arrives rather than waiting for a refresh. It turns the dashboard from a report into a live feed.

---

## 2. The Core Tension

**The app knows what the user needs to do next, but on almost every successful action it drops them at a list instead of carrying them there.** The guest who just paid lands on a bookings table and has to hunt for the booking they literally just made. The admin who just updated a payment is sent back to the full bookings table. The user who just cancelled sees a toast flash and then a table. The app has the information to push people forward; it keeps asking them to find their own way back.

This isn't a surface issue. It's the structural shape of the product: every completion leads to a hub, not to the next moment.

---

## 3. The User's Day

### The Guest — "I want to book a room for next weekend"

**Today.** They land on the home page and see a grid of rooms. They filter by city, pick a room, and tap into the detail page. They read, they scroll through images, they're convinced. Because they're not signed in, the booking form tells them to "Login to rent." They tap it, sign in, and are thrown back to the home page — not the room they were about to book. They find the room again, reopen the detail page, reopen the calendar, re-pick the dates, re-confirm the total, and finally place the booking. They're taken to a payment screen that asks cash or card; they pick card. The page sends them to Stripe. They pay. They land on "My Bookings" — not on a confirmation, not on an invoice, not on a thank-you. A list. They scan it to find the row that matches what they just paid for, see PAID, tap "Get Invoice," and finally see something that looks like a receipt.

**Friction count for a new guest:** ~12 taps, 8 screens, two full-page detours (bounced to home after login, bounced to bookings list after payment), and one moment where they have to re-select the same dates they already chose two minutes earlier.

**What it should feel like.** The guest taps "Login to rent" and returns — after signing in — to the same room detail page with the same dates already in the form. They tap "Place Booking," then pay on Stripe. On return from Stripe they see a confirmation screen: their booking number, check-in date, total, and a single button, "View Invoice," with a secondary link to "My Bookings." No list to scan. No "did it work?" moment. The app confirms what just happened before it asks them to do anything else.

**The gap.** Two lost screens (the bounce after login, the bounce after payment), one piece of forgotten state (the dates the guest already picked), and one missing moment of resolution (a payment confirmation that actually confirms the payment).

---

### The Returning Customer — "I need to cancel my booking"

**Today.** They land on the home page signed out. They tap "Login," sign in, get dropped at the home page. They open the user dropdown in the header, tap "Bookings," and finally see their list. They find the booking — hopefully not too far down — tap "Cancel," type a reason, confirm. A toast flashes: "Booking cancelled and refund issued." The dialog closes. They're back on the same list. The row now shows CANCELLED. There is no page that explains what's happening with their money: how much was refunded, when it will reach them, what to do if it doesn't.

**Friction count for a returning customer wanting to cancel:** ~7 taps and 3 screens, which is fine on its own — but the refund itself, which is the thing they actually care about, is represented by a single line in a transient toast.

**What it should feel like.** They land on "My Bookings" directly after login (not the home page — why would they need to re-browse?). They cancel. The confirmation screen tells them: "You've cancelled your booking at Luxury Suite. $420 will be refunded to the card ending in 4242 within 5–10 business days. We've emailed you a confirmation." That screen has a single "Back to my bookings" link. The anxiety is gone before it starts.

**The gap.** A bounce to the home page when they're clearly here to manage a booking, and a missing confirmation screen that explains the refund — its amount, its destination, its timing — instead of compressing all of that into a toast that disappears in three seconds.

---

### The Hotel Admin — "I need to process this morning's cash payments"

**Today.** They sign in and are dropped at the home page — the same page a guest sees. They open the user dropdown to find a "Dashboard" link. They tap it. They see metrics. They tap "Manage Bookings" in the sidebar. They scan the table for today's rows with payment status = PENDING and method = CASH. The table has no sort, no filter, no search — they eyeball it. For each one, they tap "manage booking," which opens a dense dialog showing booking summary + two dropdowns (method and status) + a destructive "Cancel this booking" section stacked below. They set status to "paid," tap "Save changes," the dialog closes, the table refreshes, and they scan again for the next pending cash row.

**Friction count for processing 5 cash payments in the morning:** ~4 taps per booking × 5 = 20 taps and 5 dialog open/close cycles. Every one of those is spent re-finding their place in a table they've already scrolled through.

**What it should feel like.** After signing in, an admin lands on the admin dashboard directly — not on a guest-facing home page with a hidden dashboard link. The bookings screen has a filter chip for "Pending cash" and a search box. They click the chip and see only the 5 rows they care about. Marking one as paid either (a) updates inline without opening a dialog, or (b) auto-advances to the next pending row when the dialog closes. Five rows become a conveyor belt, not a repeated lookup.

**The gap.** The admin's starting point (home page instead of dashboard), the absence of any sort/filter/search on tables that have clear operational patterns ("paid vs. unpaid," "today's arrivals," "this week"), and a dialog that opens and closes five times in a row when the work is inherently sequential.

---

### The Hotel Admin — "I need to moderate this review"

**Today.** They open Manage Reviews. They read a row with a problematic comment. They tap "Delete." The review is gone. No confirmation. No undo.

**The gap.** Destructive, irreversible actions with zero friction. Compare this with cancelling a booking — which triggers a dialog, a reason field, and a typed confirmation. Reviews get less ceremony than bookings, even though both are permanent. The two screens have internally inconsistent standards for "are you sure?"

---

## 4. What to Cut

**The bounce from login to the home page.** A user signing in was already on the way somewhere. The app knows where they came from. Sending them to `/` erases that intent and makes them restart. If a guest signed in while looking at a room, they should return to that room. If an admin signed in, they should land on the admin dashboard. The home page is the right destination for exactly one case — a user who typed `/login` directly with no prior context — and that's the case where it does the least harm.

**The "Pay now / Get Invoice" button column on "My Bookings" as the post-payment destination.** After paying, the user doesn't want to see their bookings. They want to see *the* booking. A confirmation screen focused on the just-completed action makes the list page something the user visits intentionally, not something they're dumped into.

**The silent instant-delete on reviews and rooms.** These should either gain a confirmation dialog (matching the cancel-booking standard) or an undo toast. The current asymmetry — cancel-a-booking is a ceremony, delete-a-review is a reflex — is a trap waiting to be sprung.

**The admin dashboard's "Dashboard" link hidden inside the avatar dropdown.** An admin shouldn't have to open a user menu to reach the screen they spend their workday on. Either land them there directly after login, or promote it to a visible header item when role is admin.

**The "Additional note" field on the booking form.** The guest types something, it goes nowhere the admin can see, it doesn't appear on the invoice, it doesn't appear in the booking detail. Either surface it (admin booking dialog, invoice, confirmation email) or remove it. Fields that collect input and show it to no one train users to distrust the form.

---

## 5. What's Missing

**A post-payment confirmation screen.** Today the paying guest ends up on a list. They should end up on a page that says what happened: booking confirmed, what they paid, when they're checking in, where the invoice is, and what happens next (confirmation email). This is the single highest-impact addition in the review — it's the moment the guest is most anxious about, and the app has the least to say.

**A post-cancellation / refund confirmation screen.** Same principle. The toast is not enough for a money-leaving-your-account moment. Tell the user the amount, the destination, the timeline, and give them a printable / email-able reference.

**Admin-friendly filters on the bookings and rooms tables.** "Today's check-ins," "Pending payment," "Cash only," "This week." These aren't fancy views; they're the mental filters the admin is already running in their head while they scan. The app should run those filters for them.

**Search on admin tables.** The admin remembers the customer's last name, or the room number, or the booking's approximate date. Right now they use browser find (Cmd+F) or scroll. A search box above each admin table is a one-line addition to their day that pays back every single shift.

**Loading states with visual weight.** The home page shows "Loading ..." as plain text. The dashboard shows undefined values in stat cards for half a second before the numbers appear. Every screen should either show a spinner, a skeleton, or zero state — not a visible "nothing yet" that looks like a bug.

**Meaningful empty states.** "Room Not Found" doesn't tell the guest what to try. "No results." in the admin tables doesn't tell the admin whether the system is empty, their filter is too narrow, or there's an error. Each empty state should answer "what should I do about it?"

**Token-invalid feedback on the password reset page.** Right now an expired or malformed reset link fails silently. The user doesn't know if they typed their new password wrong or if their link is dead. The page should validate the token on load and tell the user what's wrong.

**A return path from Stripe that survives failure.** If Stripe declines or the user abandons, they come back to `/bookings` without any explanation. The app should recognize the failure case and say so — ideally with a retry link pointing back to the payment page for that specific booking.

---

## 6. Priorities

Ordered by how much pain each one removes from the most frequent journeys.

**1. A post-payment confirmation screen.** Every successful paying guest hits this. It is the moment the app is currently silent. Fix this first.

**2. Preserve intent across login.** The guest who signed in to book a room comes back to the room. The admin who signed in to work comes back to the dashboard. This one change improves every role's entry into the app.

**3. A refund confirmation screen on cancel.** Lower frequency than payment, higher emotional weight. The toast is too small for this moment.

**4. Filters and search on admin bookings and rooms tables.** This is where the admin spends real time. A filter chip for "pending cash" and a search box converts a scan-and-hunt interaction into a point-and-click one. The admin's hours compound.

**5. Consistency on destructive actions.** Either all deletes get a dialog, or all of them get an undo toast. Today cancel-a-booking is heavy-handed and delete-a-review is an accident waiting to happen.

**6. Real loading and empty states.** Replace plain "Loading ..." text with a spinner, replace "No results." with guidance, and stop rendering stat cards before they have data. None of these change behavior — they change whether the app feels reliable.

**7. Decide the fate of the "Additional note" field.** Either make it visible somewhere, or remove it. Don't leave it as a black hole on the one form guests actually care about.

**8. Token validation feedback on password reset.** Lower volume but higher confusion. A user who can't tell whether their reset link is broken or their password is wrong will call support — or give up.

The first two priorities are structural and would change how every journey feels. The rest are targeted, local, and can be shipped independently. If you only do one thing, do the first.
