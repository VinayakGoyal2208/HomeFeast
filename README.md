# HomeFeast — Homemade Tiffin & Food Service Platform

HomeFeast connects customers with local home cooks and tiffin providers offering homemade meals through daily, weekly, and monthly plans.

The platform brings kitchen discovery, menus, pricing, meal requests, subscriptions, delivery updates, and support into one responsive web application.

Built for students, working professionals, elderly customers, and home-based food businesses.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Accounts and Roles](#accounts-and-roles)
- [Application Workflow](#application-workflow)
- [Meal Plans and Payments](#meal-plans-and-payments)
- [Image Uploads](#image-uploads)
- [API Overview](#api-overview)
- [Security](#security)
- [Build and Deployment](#build-and-deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)
- [Future Enhancements](#future-enhancements)

## Features

### Customers

- Register and sign in without email verification.
- Show or hide passwords on login and registration forms.
- Browse kitchens by city, neighbourhood, or kitchen name.
- Filter by cuisine, vegetarian/non-vegetarian meals, plan, and maximum price.
- Open a kitchen by clicking anywhere on its card.
- View cook profiles, kitchen photos, menus, prices, availability, delivery timings, and ratings.
- Request a daily meal or a weekly/monthly subscription.
- Track requests, delivery progress, subscriptions, and order history.
- Cancel eligible requests and pause or resume eligible subscriptions.
- Receive notifications and mark them as read.
- Review completed orders.
- Raise order-related complaints and view admin resolutions.

### Home Cooks

- Access a dedicated kitchen dashboard.
- Create and update kitchen profiles, service areas, and delivery timings.
- Set daily, weekly, and monthly plan prices.
- Upload kitchen photos and choose a cover image.
- Add, edit, and remove dishes, including dish photos and availability.
- Assign menu categories managed by the administrator.
- Accept or reject meal and subscription requests.
- Update preparation and delivery status.
- Record received cash and eligible full cash refunds.
- View outstanding amounts, recorded cash, completed plan value, and receipt history.

### Administrators

- Approve, reject, or suspend kitchens.
- Inspect submitted kitchen photos and menus before approval.
- Enable or disable customer and cook accounts.
- Monitor orders and subscriptions.
- Manage cuisines and categories.
- Resolve complaints with written notes.
- View registered users, active subscriptions, order conversion, cook onboarding, monthly activity, and customer retention.

### Interface and Interactions

- Responsive layouts for mobile, tablet, laptop, and desktop screens.
- Warm colour palette and locally served Manrope/Fraunces fonts.
- Scroll-driven thali rotation, depth effects, floating badges, and spring-based tilt cards.
- Animated authentication feedback and automatic dashboard navigation.
- Reduced-motion support.
- Kitchen discovery, plan comparisons, FAQs, and an interactive savings calculator.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, JavaScript, React, JSX, Tailwind CSS, custom CSS |
| Build tools | Vite |
| Animation and icons | Framer Motion, Lucide React |
| Backend | Node.js, Express |
| Database | MongoDB |
| Authentication | JSON Web Tokens, HTTP-only cookies, bcrypt |
| Validation and protection | Zod, Helmet, express-rate-limit |
| Image processing | Browser Canvas, Sharp |
| Testing | Node.js test runner, Playwright |
| Deployment configuration | Vercel |

## Project Structure

```text
HomeFeast/
├── api/
│   └── index.js              # Vercel API entry
├── public/
│   ├── boot.js               # Production client loader
│   ├── favicon.svg
│   ├── robots.txt
│   └── licenses/             # Font licences
├── scripts/
│   └── prerender.js          # Landing-page HTML generation
├── server/
│   ├── app.js                # Express routes and role checks
│   ├── db.js                 # MongoDB connection
│   ├── local.js              # Local API/static server
│   ├── media.js              # Image storage and access rules
│   ├── security.js           # Validation and contact encryption
│   └── seed.js               # Admin, indexes, and taxonomy
├── src/
│   ├── assets/
│   ├── main.jsx              # Routing, auth, discovery, kitchen details
│   ├── OriginalHome.jsx      # Landing page
│   ├── Dashboard.jsx         # Role-based dashboards
│   ├── Content.jsx           # Supporting content and notifications
│   ├── CookCard.jsx
│   ├── Motion.jsx
│   ├── PasswordField.jsx
│   ├── Photos.jsx
│   ├── preview.js            # Read-only example kitchens
│   ├── shared.jsx
│   ├── styles.css
│   └── original.css
├── tests/
├── verification/             # Recorded test results and screenshots
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vercel.json
└── vite.config.js
```

Generated folders such as `node_modules/`, `dist/`, and `.prerender/` are not application source.

## Getting Started

### Prerequisites

- Node.js 24 is recommended.
- npm.
- A running local MongoDB instance or an accessible MongoDB Atlas database.
- Google Chrome for the browser test scripts.

### 1. Open the project

Clone your repository or extract the source archive, then open a terminal inside the folder containing `package.json`.

### 2. Install dependencies

```bash
npm ci
```

### 3. Create the environment file

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**

```bash
cp .env.example .env
```

If a configured `.env` already exists, retain it instead of overwriting it.

### 4. Configure MongoDB and secrets

Edit `.env` using the configuration below. Replace the secret placeholders before using authentication and ordering.

### 5. Initialise the database

```bash
npm run seed
```

This command creates:

- Database indexes.
- Default cuisines and categories.
- The initial administrator, if its email does not already exist.

It does not create fake customers, live kitchens, or orders.

### 6. Start development

```bash
npm run dev
```

| Service | Address |
|---|---|
| Frontend | http://127.0.0.1:5173 |
| API | http://127.0.0.1:3001 |

The frontend proxies API requests to the local Express server.

If the frontend port is occupied, Vite may report another port. Free port `5173` to use the supplied development-origin configuration.

## Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/HomeFeast
MONGO_DB_NAME=HomeFeast

JWT_SECRET=replace-with-a-random-secret-of-at-least-32-characters
DATA_ENCRYPTION_KEY=replace-with-64-hexadecimal-characters

SITE_URL=
VITE_SITE_URL=

PORT=3001

ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin@123
```

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string. Use your Atlas URI when hosting remotely. |
| `MONGO_DB_NAME` | Documents the intended database name. The current database module explicitly selects `HomeFeast`. |
| `JWT_SECRET` | Server-side signing secret containing at least 32 characters. |
| `DATA_ENCRYPTION_KEY` | Exactly 64 hexadecimal characters for encrypting delivery contact details. |
| `SITE_URL` | Optional allowed site origin. Leave empty until the hosted URL is available. |
| `VITE_SITE_URL` | Reserved frontend site URL; it can remain empty because API calls use relative paths. |
| `PORT` | Local Express server port. |
| `ADMIN_EMAIL` | Email used when creating the initial admin account. |
| `ADMIN_PASSWORD` | Password used when creating that account for the first time. |

### Generate application secrets

Generate a JWT secret:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Generate an encryption key:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copy the generated values into their corresponding environment variables.

### Configuration notes

- Keep `.env` out of version control.
- Never expose database credentials or server secrets through `VITE_` variables.
- Retain the encryption key used for existing orders. Replacing it prevents their encrypted contact details from being read.
- Leave `NODE_ENV` unset for normal local development.
- Do not force `NODE_ENV=development` during a production build.

## Accounts and Roles

### Default development administrator

```text
Email: admin@gmail.com
Password: admin@123
```

For a fresh public deployment, configure appropriate admin credentials before the first seed.

The seed command does **not** reset existing passwords or replace existing accounts. Changing `ADMIN_PASSWORD` and rerunning the seed does not change an already-created account.

### Public registration

Users can register as:

| Role | Access |
|---|---|
| Customer | Kitchen discovery, orders, subscriptions, reviews, and support |
| Cook | Kitchen profile, menus, requests, deliveries, and earnings |

Administrator privileges cannot be selected during public registration.

Email verification is currently disabled. Successful login or registration displays confirmation feedback and redirects the user to the appropriate dashboard.

## Application Workflow

### Onboard a kitchen

1. Create a cook account.
2. Open **Dashboard → Profile**.
3. Enter kitchen details, service area, delivery timings, and plan prices.
4. Add optional kitchen photos and submit the profile.
5. Open **Menu** and add at least one available dish.
6. Sign in as admin and open **Cooks**.
7. Review the submitted menu/photos and approve the kitchen.

Approved kitchens owned by enabled accounts appear in public discovery.

Updating a kitchen profile or its plan pricing requests approval again.

### Place and fulfil a request

1. Register or sign in as a customer.
2. Browse kitchens and apply filters.
3. Open a kitchen and choose a meal plan.
4. Provide the meal preference, start date, phone number, and delivery address.
5. Submit the request.
6. The cook accepts or rejects it.
7. Track confirmation and delivery updates through the dashboard and notifications.
8. After completion, submit a review or raise an order-related complaint when needed.

### Preview kitchens

When no live kitchens are available, the application displays clearly labelled example profiles.

These previews:

- Demonstrate menus, pricing, locations, and meal plans.
- Cannot accept orders.
- Do not affect business metrics.
- Are not presented as verified live providers.

## Meal Plans and Payments

| Plan | Included meals |
|---|---|
| Daily | One tiffin for one service day |
| Weekly | One tiffin per service day for six service days |
| Monthly | One tiffin per service day for 26 service days |

### Plan rules

- Kitchen owners set the total price for each plan.
- Customers select one meal preference per request.
- Service days and delivery timings are confirmed with the cook.
- The customer pays the displayed full plan amount in cash at the first delivery.
- Plans do not renew or charge automatically.

### Payment method

**Cash on delivery is the only implemented payment method.**

Online payments and wallets are future enhancements.

Cash receipts and eligible full refunds are recorded manually by the cook. These records are not payment-gateway transactions.

### Delivery tracking

The cook progresses each meal through:

```text
Pending → Accepted → Preparing → Out for delivery → Delivered
```

For longer plans, the request returns to `Accepted` after a delivery until the meal allowance is completed.

A maximum of one delivery per plan is recorded per calendar day in the `Asia/Kolkata` timezone.

Customers can cancel eligible requests and pause or resume accepted weekly/monthly plans.

## Image Uploads

### Kitchen photos

Open **Cook Dashboard → Profile** to:

- Upload up to five kitchen photos.
- Select the cover image.
- Reorder or remove photos.

Save the profile to submit the changes.

### Dish photos

Open **Cook Dashboard → Menu** to add or replace one photo per dish.

Save the dish after uploading.

### Processing and storage

- Supported picker formats: JPEG, PNG, and WebP.
- Picker file limit: 8 MB per image.
- Images are resized before upload and validated again on the server.
- Stored output is WebP, bounded to 1200 pixels and 500 KB.
- Original image metadata is removed.
- Images persist in MongoDB instead of the server’s local filesystem.
- No additional image-storage credentials are required.
- Storage is limited to 40 photos per cook.
- Unattached and removed, unreferenced images expire automatically after approximately 24 hours.

Pending images are accessible to their owner and administrators. Public access is allowed for photos attached to approved live kitchens or their menus.

## API Overview

All endpoints use the `/api` prefix.

| Area | Main endpoints |
|---|---|
| Authentication | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |
| Discovery | `GET /cooks`, `GET /cooks/:id`, `GET /taxonomy` |
| Kitchen profile | `GET /kitchen`, `PUT /kitchen` |
| Menus | `POST /menu`, `PUT /menu/:id`, `DELETE /menu/:id` |
| Orders | `GET /orders`, `POST /orders`, `PATCH /orders/:id` |
| Subscriptions | `GET /subscriptions` |
| COD records | `PATCH /orders/:id/cash`, `GET /earnings` |
| Reviews and support | `POST /reviews`, `GET /complaints`, `POST /complaints` |
| Notifications | `GET /notifications`, `PATCH /notifications/read` |
| Images | `POST /images`, `GET /images/:id` |
| Administration | `GET /admin`, `GET /admin/cooks/:id`, protected cook/user/complaint/taxonomy controls |
| Health | `GET /health` |

Protected routes validate the account role and record ownership.

Subscription pause, resume, and cancellation actions use the corresponding order’s state-change endpoint.

## Security

Implemented protections include:

- bcrypt password hashing.
- Signed JWT sessions in HTTP-only cookies.
- Secure cookies in production.
- Role-based and ownership-based API authorization.
- Server-side validation with Zod.
- Server-calculated plan prices.
- AES-256-GCM encryption for delivery contact information.
- Origin checks, security headers, and request limits.
- Image format, size, and ownership validation.
- Reviews restricted to completed orders.

Admin approval is a platform workflow. The software does not independently inspect food hygiene.

## Build and Deployment

### Preview the production build locally

```bash
npm run build
npm start
```

Open:

```text
http://127.0.0.1:3001
```

The build generates the frontend, pre-renders the landing page, and separates the dashboard into a lazy-loaded chunk.

The local server serves the built application and API.

### Deploy to Vercel

1. Push the project to your repository without `.env`, `node_modules/`, or generated build folders.
2. Import the repository into Vercel.
3. Set the project root to the folder containing `package.json` and `vercel.json`.
4. Use the following build settings:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| API entry | `api/index.js` |

5. Add the server environment variables from your private configuration.
6. Use an externally accessible MongoDB URI, not the local `127.0.0.1` URI.
7. Ensure the MongoDB database user and network configuration allow the deployment to access `HomeFeast`.
8. Initialise that database with `npm run seed` from an environment configured for the same database.
9. Deploy the application.
10. Once the hosted URL is available, set `SITE_URL` to its origin without a trailing slash, then redeploy.

Example:

```env
SITE_URL=https://your-project.vercel.app
```

The app uses relative API URLs and can operate on its own origin while the site URL fields are blank.

The included configuration provides:

- API routing.
- SPA fallback for direct page URLs.
- Caching for hashed assets.

After deployment, verify:

- Registration, login, and logout.
- Direct-route refresh.
- Kitchen approval.
- Orders and subscriptions.
- Image uploads.
- Production cookies and API access.
- Performance on the hosted URL.

The under-three-second loading requirement is a performance target, not a guarantee for every device or network. See recorded measurements in `verification/` and repeat testing after deployment.

## Testing

### API and security tests

```bash
npm test
```

These cover authentication, permissions, kitchen approval, ordering, subscriptions, reviews, complaints, cash records, and photo access/storage rules.

### Browser checks

Build the application and keep the production server running in one terminal:

```bash
npm run build
npm start
```

With Google Chrome installed, run the following in another terminal:

```bash
node tests/browser.mjs
node tests/revision.mjs
node tests/content.mjs
node tests/production.mjs
node tests/performance.mjs
```

The scripts cover:

- Responsive layouts.
- Routing and navigation.
- Authentication page sizing.
- Animations and reduced motion.
- Password visibility.
- Whole-card interaction.
- Photo uploads and display.
- Production behaviour.
- Performance measurements.

Tests use temporary database fixtures and attempt to remove their own records afterward. Run integration tests against a development or test database.

Generated reports and screenshots are written to `verification/`.

## Troubleshooting

| Problem | Check |
|---|---|
| Database connection fails | Confirm MongoDB is running, the URI is correct, and network/database permissions permit access. |
| Authentication or ordering fails after setup | Replace the JWT/encryption placeholders with valid generated secrets. |
| Admin login fails | Seed the intended database and use the credentials originally created for that account. Rerunning the seed does not reset its password. |
| A kitchen is not listed | Confirm the cook account is enabled, the kitchen is approved, and the profile was not resubmitted for approval. |
| Kitchen approval fails | Add at least one available menu item and ensure the cook account is enabled. |
| An order cannot be placed | Check approval, meal preference, available dishes, contact details, and start date. |
| An uploaded photo is not public | Save its form and confirm the kitchen’s approval status. Unsaved/pending photos remain restricted. |
| Old order contact details cannot be read | Restore the original `DATA_ENCRYPTION_KEY` used to create them. |
| A port is occupied | Stop the existing local process before starting another server. |
| Direct URLs fail after deployment | Check the project root and the SPA/API rewrites in `vercel.json`. |

## Documentation

| File | Contents |
|---|---|
| `PRD.md` | Product scope and business rules |
| `TECHNICAL.md` | Architecture, data model, and API details |
| `REQUIREMENTS.md` | Requirement coverage and verification |
| `GAP_AUDIT.md` | Completeness review and remaining acceptance boundaries |
| `ORIGINAL_DESIGN.md` | Original design and animation preservation |
| `PHOTO_CONTROLS.md` | Password, card, and image-upload behaviour |

## Future Enhancements

- Online payments and wallets.
- Native mobile applications.
- Meal customisation.
- Nutrition and calorie tracking.
- AI-based recommendations.

Cloud kitchen integrations are outside the current scope.

Before a public production release, complete hosted workflow verification, performance checks, and capacity testing for the expected traffic.