# HomeFeast
Homemade tiffin and food service platform. React JSX + JavaScript + HTML5 + Tailwind CSS + Node/Express REST API + MongoDB.

## Run locally
Use Node.js 22.12+ or 24.
```sh
npm ci
# Copy .env.example to .env if this is an extracted source archive.
npm run seed
npm run dev
```
Open http://127.0.0.1:5173. The API runs on port 3001.

The working folder already contains a private .env configured from the reference MongoDB URI. The database is explicitly HomeFeast regardless of the database path in that URI. Existing SlotBay collections are not used. The reference file itself was not edited. SITE_URL and VITE_SITE_URL are blank.

## Accounts
Admin: admin@gmail.com / admin@123. The seed command creates this account once, hashes its password, and creates indexes and taxonomy. Public registration supports customer and cook accounts only; email verification is disabled.

Customers receive orders, subscriptions, notifications, reviews and support screens. Cooks receive a profile, menu editor, requests, earnings and delivery controls. Admins receive approvals, user controls, order/subscription monitoring, complaints, cuisines/categories and KPI screens.

The database starts with no invented kitchens or orders. When there are no live listings, the interface shows labelled read-only preview profiles stored in src/preview.js. They cannot accept orders and do not affect database metrics. Register a cook, submit the kitchen, add available dishes, and approve the cook from the admin dashboard to make it discoverable. Editing kitchen profile/pricing requests approval again.

## Build and preview production
```sh
npm run build
npm start
```
Open http://127.0.0.1:3001. This serves the built frontend and API. Do not set NODE_ENV=development for a production build. Vercel supplies its production environment; local development can leave NODE_ENV unset.

## Vercel
1. Import this folder as the project root. Use the included package-lock.json.
2. Build command: npm run build. Output directory: dist. API entry: api/index.js.
3. Add MONGO_URI, JWT_SECRET, DATA_ENCRYPTION_KEY, ADMIN_EMAIL and ADMIN_PASSWORD as server-side environment variables. Use the private local .env values or generate new secrets before introducing real orders. Never prefix these with VITE_.
4. Keep SITE_URL and VITE_SITE_URL empty until the hosted URL is available. Then set SITE_URL to the origin, for example https://your-project.vercel.app (no trailing slash). The app uses relative API requests and works on its own origin with these blank.
5. Allow the deployment network to reach your MongoDB cluster and ensure the database user can access HomeFeast.
6. Initialize the database with npm run seed from your configured local environment. This was already done for the current working copy.
7. Deploy, then test login, kitchen approval, a COD request and refresh on a direct dashboard/detail URL.

vercel.json includes SPA fallback, an API rewrite to the shared Express function, and immutable cache headers for hashed assets. This follows the shared API entry approach in [Vercel's Node.js runtime documentation](https://vercel.com/docs/functions/runtimes/node-js). Deployment itself has not been performed.

## Environment
- MONGO_URI: server-only connection string.
- MONGO_DB_NAME: documents the intended database; server/db.js enforces HomeFeast.
- JWT_SECRET: random string of at least 32 characters.
- DATA_ENCRYPTION_KEY: 64 hexadecimal characters for AES-256-GCM. Retain this key to read existing delivery contacts.
- SITE_URL: blank now; optional explicit allowed deployment origin.
- VITE_SITE_URL: blank now; reserved for future absolute frontend URLs.
- PORT: 3001 for the local API.
- ADMIN_EMAIL / ADMIN_PASSWORD: seed-only administrator credentials.
- NODE_ENV: omit in local .env; deployment supplies production.

## Validation
```sh
npm test
# With npm run build completed, npm start active, and Chrome installed:
node tests/browser.mjs
# With npm run build completed and npm start active:
node tests/performance.mjs
node tests/production.mjs
node tests/content.mjs
```
API and browser tests create temporary accounts and records in HomeFeast and remove their own fixtures afterward. Browser tests use installed Chrome. Review verification/ for recorded results and screenshots.

Read ORIGINAL_DESIGN.md, GAP_AUDIT.md, PRD.md, TECHNICAL.md and REQUIREMENTS.md for scope, business rules, architecture, audit findings and verification limits.

## Payment and subscriptions
Cash on delivery only. No payment gateway, wallet, payment keys or payment SDK. Daily = 1 meal, weekly = 6 service-day meals, monthly = 26 service-day meals. A request uses a single meal preference and total plan price. The cook confirms delivery days and the customer pays the full displayed amount at first delivery. This phase records delivery status and manual COD cash receipt/refund entries; these are provider-entered bookkeeping records, not payment-gateway receipts.

Cooks progress each service-day meal through accepted → preparing → out for delivery → delivered. Longer plans return to accepted until all service-day meals are delivered; at most one meal is recorded per calendar day in Asia/Kolkata. Customers can cancel pending/accepted plans and pause/resume accepted weekly/monthly plans.

## Packaging
HomeFeast-source.zip excludes node_modules, dist, .prerender, .env and local screenshots. It includes machine-readable verification results. The working folder contains the configured private .env and the verified dist build. Use .env.example when sharing or setting up another checkout.



## Password and cook-photo controls
See PHOTO_CONTROLS.md. Cooks add up to five kitchen photos from Profile and one photo per dish from Menu. Save the relevant form after uploading. Photos are optimized and stored in HomeFeast MongoDB, with no extra environment credentials.
