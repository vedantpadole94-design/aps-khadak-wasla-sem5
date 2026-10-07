# Army Public School Khadakwasla website

React/Vite public website and admin panel, with an Express/MongoD- npm
- MongoDB (local or a reachable managed MongoDB deployment)

## Local setup

### 1. Configure the backend

```sh
cd backend
npm ci
cp .env.example .env
```

Edit `backend/.env` and set `MONGODB_URI`, a private `JWT_SECRET` of at least 32 random characters, and a unique `ADMIN_PASSWORD` of at least 12 characters. Generate a secret with `openssl rand -base64 48`. Keep `.env` private and out of source control.

Seed demo site content and the configured administrator account once:

```sh
npm run seed
```

Seeding does not overwrite existing content. To intentionally replace the seeded site content in the configured database, pass `--force`:

```sh
npm run seed -- --force
```

Start the API:

```sh
npm start
```

The API listens on port 5001 by default and exposes `/api/health`.

### 2. Start the frontend

In a second terminal:

```sh
cd frontend
npm ci
npm run dev
```

Vite proxies `/api` and `/uploads` to the local backend. The development site is served at the URL printed by Vite (normally `http://localhost:5173`).

## Checks

```sh
cd backend
npm test
```

```sh
cd frontend
npm run lint
npm run build
```

## Deployment

This repository is configured for **Vercel (frontend) + Render (API) + MongoDB Atlas (database)**. The Vercel project root must be `frontend`; Render uses the root-level `render.yaml` blueprint and deploys from `backend`.

1. Create a MongoDB Atlas M0 cluster and database user. Add `0.0.0.0/0` to Atlas Network Access only if needed for Render's changing outbound IPs; use a unique database password and least-privilege database user. Use the Atlas connection string as `MONGODB_URI` and include `aps_khadakwasla` as its database name.
2. Push this repository to GitHub. In Render, create a Blueprint from the repository and fill its prompts for `MONGODB_URI`, `CORS_ORIGIN` (temporarily use `https://example.invalid` until Vercel gives you the real URL), and `ADMIN_PASSWORD` (at least 12 characters). Render generates `JWT_SECRET` and supplies `PORT`; do not set a fixed production port.
3. After Render deploys, copy its service URL, such as `https://aps-khadakwasla-api.onrender.com`. Its health check is `https://<render-service>.onrender.com/api/health`.
4. In Vercel, import the same repository and set the project root to `frontend`. Add the build-time environment variable `VITE_API_URL=https://<render-service>.onrender.com/api`, then deploy. `frontend/vercel.json` enables React Router deep links on refresh.
5. Copy the Vercel production origin (scheme and hostname only) into Render's `CORS_ORIGIN`, replacing the temporary value, then redeploy the backend. For preview domains, add their exact origins as comma-separated values if you want previews to call the API.
6. Seed the database once from a trusted local environment: copy `backend/.env.example` to `backend/.env`, fill in the Atlas `MONGODB_URI`, and use the same `ADMIN_USERNAME` and `ADMIN_PASSWORD` configured on Render. Run `cd backend && npm ci && npm run seed`. The seeder refuses to run without explicit admin credentials and refuses to replace existing content unless `--force` is deliberately supplied. Never use `--force` against production unless a full replacement is intended.
7. Test the Vercel website, refresh a nested route, check `/api/health`, sign in to the admin panel, and submit a test enquiry.

### Free-tier limitations and optional services

- **Uploads are local disk only; Cloudinary is not implemented.** Render's free service has ephemeral storage, so files uploaded through the admin panel can disappear on restart/redeploy. Do not rely on admin uploads until the upload routes are migrated to a persistent object-storage provider or a paid persistent disk is configured. Existing externally hosted image URLs can still be used.
- **Email uses Gmail SMTP through Nodemailer.** Enquiry saving is independent of email and failures are logged, but Gmail SMTP is not a reliable production option on Render's free tier, where outbound SMTP may be blocked. Configure a supported HTTPS email API before relying on notifications; no email API integration is included yet.
- Render's free web service can sleep when idle and cold-start on the next request. Free-tier limits and availability can change; confirm current platform terms when creating the services.
- `PORT` is assigned by Render. Locally, the backend defaults to port 5001 and the frontend to 5173.
- `backend/.env.example` and `frontend/.env.example` contain variable names/sample local values only. Never upload `.env` files or place secrets in Vercel's frontend environment.

Review the seeded notices, admissions dates, results, contact details, and public disclosures with the school before publishing; the included seed content is not verified current school information.

## Features

- Public information pages, calendar, faculty directory, gallery, admissions and enquiry form.
- Admin-managed principal profile, pages, faculty, results, notices, popups, events, gallery, enquiries and settings.
- Optional enquiry email notifications.
- JWT-protected admin API rou
