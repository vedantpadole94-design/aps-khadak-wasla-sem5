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

1. Provision MongoDB and restrict its network access to the backend host.
2. Deploy the backend with `MONGODB_URI`, a new private `JWT_SECRET`, `NODE_ENV=production`, and a suitable `PORT`. Never reuse a development secret.
3. The API allows `https://www.apskhadakwasla.in` and `https://apskhadakwasla.in`; localhost is allowed only in development. Add any additional exact frontend origins to `CORS_ORIGIN` as a comma-separated list. The API does not enable credentialed cross-origin cookies; admin requests use bearer tokens.
4. For a separately hosted frontend, set `VITE_API_URL` at build time to the full API base URL ending in `/api`. For a same-origin deployment, leave it unset and route `/api` and `/uploads` to the backend.
5. Provide persistent storage for `backend/src/uploads` (or configure an equivalent persistent mount); uploaded content is not automatically copied to another host or object store.
6. If email notifications are needed, configure `ENQUIRY_EMAIL`, `EMAIL_USER`, and `EMAIL_PASS` using your mail provider's credentials. Email delivery is optional; enquiries are stored even when mail is not configured.
7. Run the checks above, configure HTTPS, set up database backups and monitoring, then verify the live health endpoint, admin login, enquiry flow, and image uploads.

### Credential rotation

If credentials may have been exposed, rotate them immediately. Otherwise, rotate them regularly according to your security policy:

1. Change the MongoDB database user's password in MongoDB Atlas and update `MONGODB_URI` in the backend environment.
2. Generate a new `JWT_SECRET` and update it in the backend environment. This invalidates existing login tokens, so administrators will need to sign in again.
3. Revoke the Gmail app password and create a replacement in the Google Account, then update `EMAIL_PASS`.
4. Regenerate the Cloudinary API keys in the Cloudinary Dashboard and update the corresponding backend environment variables.

After updating deployment secrets, restart or redeploy the backend and verify database connectivity, admin login, email notifications, and image uploads. Never add replacement secrets to source control or share them in chat.

The frontend's `dist` folder is produced by `npm run build`; deploy its contents to a static host configured to serve `index.html` for client-side routes. Do not deploy the local `.env` files or treat the included seeded content as verified current school information. Review notices, admissions dates, results, contact details, and public disclosures with the school before publication.

## Features

- Public information pages, calendar, faculty directory, gallery, admissions and enquiry form.
- Admin-managed principal profile, pages, faculty, results, notices, popups, events, gallery, enquiries and settings.
- Optional enquiry email notifications.
- JWT-protected admin API rou
