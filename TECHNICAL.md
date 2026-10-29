# Technical guide
## Structure
- index.html: HTML shell and metadata.
- src/prerender.jsx and scripts/prerender.js: build-time landing-page HTML with hydration after first paint.
- public/boot.js: small post-paint loader for the production bundle.
- src/main.jsx: React entry, navigation, discovery, auth and kitchen detail.
- src/OriginalHome.jsx and original.css: original visual structure and scoped style/readability corrections.
- src/Photos.jsx: client photo preparation, upload controls and photo URLs.
- src/PasswordField.jsx: accessible password-visibility input.
- server/media.js: image normalization, MongoDB storage, ownership/public-access rules and orphan TTL handling.
- src/Motion.jsx: original spring-based tilt component using Framer Motion's lightweight animation feature set.
- src/Content.jsx: featured kitchens, plan comparison, audience/FAQ sections and notification menu.
- src/preview.js and CookCard.jsx: explicit read-only sample data and shared kitchen cards.
- src/Dashboard.jsx: lazy-loaded role dashboards and management forms.
- src/shared.jsx: API client, shared fields and status components.
- src/styles.css: Tailwind CSS import, design tokens, layouts, breakpoints and animation.
- src/assets/: optimized WebP assets derived from source project assets.
- server/app.js: Express REST routes and authorization.
- server/security.js: validation schemas, AES-256-GCM contact encryption.
- server/db.js: cached MongoClient promise, fixed HomeFeast database, connection retries.
- server/seed.js: idempotent seed for admin, indexes and taxonomy.
- api/index.js and vercel.json: Vercel function entry and static routing.
- server/local.js: local API and production-static server.

## Collections
users: name, email, bcrypt password hash, role, disabled state, activity timestamps.
cooks: owner ID, kitchen story, city, area, cuisine, meal type, prices, delivery timings, service area, approval status, computed rating.
menus: cook ID, dish name, meal type, price, availability and delivery timing.
orders: optional manual cash collection/refund timestamps, customer/cook/owner IDs, snapshot kitchen name and plan price, meal preference, start date, encrypted phone/address, status, service-day count and last delivery date.
subscriptions: weekly/monthly order reference and fulfillment status.
reviews: unique order reference, cook/customer IDs, author, rating and comment.
complaints: owned order reference, customer, subject, details, status and admin resolution.
notifications: recipient user, message and timestamp.
taxonomy: cuisine/category metadata.

Unique indexes protect user email, one kitchen per owner, one subscription per order and one review per delivered order. Additional indexes support menu, kitchen status/city, customer orders, cook orders and notifications.

images: owner ID, normalized WebP binary data, content type, creation time and optional expiry for unattached images. Kitchen profiles reference up to five image IDs; menus reference one optional image ID.

## REST endpoints
| Method | Path | Access |
|---|---|---|
| POST | /api/auth/register | Public customer/cook signup |
| POST | /api/auth/login, /api/auth/logout | Session creation/removal |
| GET | /api/auth/me | Current authenticated user |
| GET | /api/cooks, /api/cooks/:id | Approved public kitchens |
| GET | /api/taxonomy | Public cuisine/category metadata |
| GET, PUT | /api/kitchen | Cook's own profile |
| POST | /api/menu | Cook-owned menu creation |
| PUT, DELETE | /api/menu/:id | Cook-owned dish changes |
| GET, POST | /api/orders | Scoped history / customer request |
| PATCH | /api/orders/:id | Allowed owner role and state transition |
| POST | /api/reviews | Customer with delivered order |
| GET, POST | /api/complaints | Scoped list / customer-owned order |
| GET | /api/notifications | Own notifications |
| PATCH | /api/notifications/read | Mark own notifications read |
| GET | /api/subscriptions | Scoped weekly/monthly plan details |
| GET | /api/earnings | Cook cash totals and receipt history |
| PATCH | /api/orders/:id/cash | Owning cook records collection/refund |
| GET | /api/admin/cooks/:id | Admin submitted-menu inspection |
| GET | /api/admin | Admin data and KPIs |
| PATCH | /api/admin/cooks/:id | Admin approval control |
| PATCH | /api/admin/users/:id | Admin enable/disable (non-admin only) |
| PATCH | /api/admin/complaints/:id | Admin resolution |
| POST, DELETE | /api/admin/taxonomy[/:id] | Admin cuisine/category management |
| POST | /api/images | Cook-only bounded, validated photo upload |
| GET | /api/images/:id | Approved public image or owner/admin preview |
| GET | /api/health | Process health; not a DB health assertion |

## Authentication and security
bcrypt cost 12; 7-day HS256 signed session in an HTTP-only SameSite=Lax cookie. Secure cookies in production. Every protected request reads the account and checks disabled status. Public registration accepts only customer/cook roles; administrator creation is seed-only. MongoDB credentials and encryption/JWT keys never enter browser bundles. Contact data is encrypted with random IVs and authentication tags; passwords are hashed rather than reversibly encrypted. TLS and provider at-rest encryption cover transport and database storage as configured by the deployment operator.

Cross-origin mutations are rejected unless the origin matches the request origin or configured SITE_URL. Development permits the Vite origin. Express trusts one proxy hop for hosted protocol handling. Rate limits are process-local; production limits are 150 API requests/minute and 30 auth attempts/15 minutes, with higher local-development limits and JSON error responses; enforce distributed limits at the host for a high-traffic deployment. Invalid payloads return validation errors; internal database errors are not exposed.

## Data consistency and growth
Order state transitions use an atomic conditional update on current status. Related subscription summaries and notifications are separate writes; a full production-scale financial system should add transactional outbox/reconciliation before adding online payments. API collection lists are currently loaded in full for the phase-1 scope; add server pagination and search indexing before large multi-city traffic. No claim of large-scale load-test certification is made.

Each plan has a bounded meal count and permits a maximum of one delivery per Asia/Kolkata day. Subscription financial refunds and partial-period COD adjustments require support; no automated payment ledger exists.

## Performance decisions
Pre-rendered landing HTML, deferred hydration, compressed local static preview, WebP images, explicit image dimensions, lazy secondary images, self-hosted Manrope/Fraunces fonts (no external font requests), no WebGL runtime, Framer Motion scroll/pointer effects with only required animation features, compositor transforms, reduced motion, lazy dashboard chunk and Vercel hashed-asset caching. Static production paths are independent of MongoDB availability; forms and discovery display recoverable errors if the API is unavailable.

## Deployment reference
The shared Node API entry and static asset setup were checked against [Vercel's official Node runtime documentation](https://vercel.com/docs/functions/runtimes/node-js). Vercel hosting has not been initiated; validate cluster access, production cookies and SPA rewrites on the deployed URL.


Media requests permit up to 1 MB of JSON only on the image route; other APIs retain their 30 KB body limit. Sharp validates JPEG/PNG/WebP input, limits decoded pixel count, strips metadata and produces bounded WebP output. No original filename or local file path is served.
