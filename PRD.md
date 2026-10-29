# HomeFeast product requirements
## Purpose
Connect students, working professionals and elderly customers with approved local home cooks for fresh homemade food. Make kitchen discovery, price comparison, requests, subscriptions and service coordination accessible on the web.

## Phase 1 scope
Responsive browser application with customer, home cook and administrator roles. Daily, weekly and monthly meal plans; COD fulfillment; local discovery by city/neighbourhood; account and service dashboards. No native app, cloud kitchen integration, AI recommendations, wallet or online payment gateway.

## Roles and journeys
### Customer
Register without email verification, or sign in. A success tick appears before automatic navigation to the customer dashboard. Search kitchens, apply meal/cuisine/price/plan filters, review a cook's story, service area, delivery timings, menu and ratings. Submit a request with delivery address, phone, start date and meal type. Track confirmation and service-day fulfillment. Pause/resume eligible subscriptions or cancel eligible requests. Review delivered orders and open complaints against owned orders.

### Cook
Register with the cook role and land in the kitchen dashboard. Submit kitchen details, delivery service area, menu and daily/weekly/monthly prices. Listings remain pending until admin approval. Manage dishes and availability. Accept or reject requests and update deliveries. Track current requests, ratings, manual cash receipts/refunds, outstanding amounts and completed plan value. Profile/pricing edits resubmit the kitchen for approval.

### Administrator
Sign in with the seeded admin account. Review cook profiles and approve/reject/suspend kitchens. Enable/disable customer or cook accounts. Monitor orders and subscriptions; resolve complaints with a written note; maintain cuisine and category metadata. View users, active subscriptions, request conversion, cook onboarding, monthly activity and customer retention.

## Acceptance criteria
- Public registration cannot obtain admin privileges.
- A role cannot access another role's API or another customer's records.
- Only approved kitchens can be discovered and ordered from.
- A matching available dish must exist for the requested meal type.
- The server calculates the plan price from current kitchen prices.
- Every request is COD and begins pending cook confirmation.
- Only the owning cook can accept/reject and fulfill an order.
- Only a customer with a completed order can submit one review for that order.
- Every complaint belongs to an order owned by the customer; resolution is visible to that customer.
- Authentication uses a visible success animation and automatic dashboard routing.
- Layout adapts to 320px through wide desktop; reduced-motion preferences disable decorative animation.

## Plan policy
One tiffin per service day. Daily: 1 day; weekly: 6 service days; monthly: 26 service days. These periods follow the source project's plan labels. Cook and customer agree on service days within the displayed delivery window; no automatic recurring billing or date-by-date menu rotation is included. Start date cannot precede today in Asia/Kolkata. Delivery cannot begin before the start date. Pause preserves the remaining meal count. Cancellation stops remaining fulfillment; offline financial resolution is handled through support.

## Non-functional targets
- Under 3 seconds for initial load is a deployment target, verified locally under the conditions in verification/performance.json; hosted testing remains required.
- Mobile-first forms, semantic labels, visible focus, responsive grids, keyboard navigation, reduced motion and accessible status messages.
- Password hashes, signed HTTP-only sessions, server role/ownership checks, schema validation, authenticated contact encryption, origin checks and basic request limiting.
- Multi-city kitchen records and indexed owner/customer/status lookup.
- Deployment on Vercel with MongoDB access and private server secrets.

## KPI definitions
- Registered users: all customer and cook accounts.
- Active subscriptions: non-daily plans in accepted/preparing/out-for-delivery state.
- Order conversion: requests advanced beyond pending/rejected/cancelled divided by all requests.
- Cook onboarding (30d): kitchens submitted during the last rolling 30 days.
- Cook onboarding rate: currently approved kitchens divided by all submitted kitchens.
- Monthly active users: non-admin accounts active during the last rolling 30 days; activity timestamp updated on login and at most hourly during authenticated use.
- Customer retention: customers who placed an order 30–60 days ago and also ordered in the last 30 days, divided by that prior cohort. No prior cohort is shown explicitly.
- Delivered value: sum of completed plan prices; an operational value, distinct from manually recorded cash receipts.
- Cash earnings: recorded receipts less full refunds; outstanding amounts exclude pending/rejected/cancelled requests. These are offline provider-entered records.

## Future enhancements
Online payments/wallet, native app, meal customization, nutritional tracking, recommendations, automated service calendars, customer-selected dishes, multilingual UX, email recovery/verification and external messaging integrations.

