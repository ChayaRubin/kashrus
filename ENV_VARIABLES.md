# Environment Variables for Going Live

Use this as a checklist when deploying the **frontend** (e.g. Netlify) and **backend** (e.g. Render).

---

## Frontend (Netlify / client)

Set these in your frontend host’s **Environment variables** (e.g. Netlify → Site settings → Environment variables).

| Variable        | Required | Description |
|----------------|----------|-------------|
| `VITE_API_URL` | **Yes**  | Full base URL of your backend API. Example: `https://your-app-name.onrender.com` (no trailing slash). The client uses this for all API calls and image uploads. |

**Example (Netlify):**
- Key: `VITE_API_URL`
- Value: `https://your-backend.onrender.com`

After changing env vars, **rebuild** the site so the new value is baked into the build.

---

## Backend (Render / server)

Set these in your backend host’s **Environment** (e.g. Render → Your Web Service → Environment).

### Required

| Variable        | Description |
|----------------|-------------|
| `DATABASE_URL` | PostgreSQL connection string from Clever Cloud (or your DB host). Example: `postgresql://user:password@host:port/database?sslmode=require` **If you see "too many connections"**, add `&connection_limit=2` (or `?connection_limit=2` if there is no `?` yet), e.g. `...?sslmode=require&connection_limit=2`. |
| `FRONTEND_URL` | Full URL of your frontend. Example: `https://your-site.netlify.app` (no trailing slash). Used for CORS and auth redirects (e.g. after Google login). |
| `JWT_SECRET`   | Secret used to sign and verify JWT tokens. Use a long random string. Generate one with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PORT`         | Usually set automatically by Render. Only set if your host requires a specific port (e.g. `5000`). |

### Optional (by feature)

| Variable                   | When to set |
|---------------------------|-------------|
| `EMAIL_USER`              | **Contact form, “Add restaurant” requests, feedback emails.** SMTP “from” address (e.g. Gmail address). |
| `EMAIL_PASS`              | **Same as above.** SMTP password (for Gmail, use an App Password). |
| `COMPANY_EMAIL`           | If set, contact/feedback emails are sent to this address instead of `EMAIL_USER`. |
| `CLOUDINARY_CLOUD_NAME`   | **Image uploads.** Your Cloudinary cloud name. |
| `CLOUDINARY_API_KEY`      | **Image uploads.** Cloudinary API key. |
| `CLOUDINARY_API_SECRET`   | **Image uploads.** Cloudinary API secret. |
| `GOOGLE_CLIENT_ID`        | Only if you enable Google OAuth (currently disabled in code). |
| `GOOGLE_CLIENT_SECRET`    | Only if you enable Google OAuth (currently disabled in code). |

---

## Quick checklist

**Frontend (Netlify):**
- [ ] `VITE_API_URL` = your Render backend URL (e.g. `https://xxx.onrender.com`)
- [ ] Rebuild the site after changing

**Backend (Render):**
- [ ] `DATABASE_URL` = Clever Cloud PostgreSQL connection string
- [ ] `FRONTEND_URL` = your Netlify site URL (e.g. `https://xxx.netlify.app`)
- [ ] `JWT_SECRET` = long random string
- [ ] `PORT` = leave default or set if required by host
- [ ] If you use contact/feedback/add-restaurant email: `EMAIL_USER`, `EMAIL_PASS` (and optionally `COMPANY_EMAIL`)
- [ ] If you use image uploads: `CLOUDINARY_*` variables

After setting `DATABASE_URL`, run migrations (e.g. via Render build command or `npx prisma migrate deploy`) so the database schema is up to date.

---

## Troubleshooting: "Too many database connections"

Clever Cloud (and other free tiers) allow only a few connections per database. If you see **"FATAL: too many connections for role ..."** in Prisma Studio, the API, or seed scripts:

1. **Limit each client’s connections**  
   Add a connection limit to `DATABASE_URL` so each app (Render, Prisma Studio, seeds) uses fewer connections:
   - If the URL already has `?`: append `&connection_limit=2`
   - If it has no `?`: append `?connection_limit=2`  
   Example:  
   `postgresql://user:pass@host:5432/db?sslmode=require&connection_limit=2`

2. **Use only one client at a time**  
   Close Prisma Studio when the app or seeds are running (or the other way around) so you don’t exceed the DB’s total connection limit.

3. **Prisma Studio**  
   When you run `npm run db:studio` from the server workspace, a wrapper script now injects `connection_limit=1` into `DATABASE_URL` so Studio uses only one connection. Use this instead of running `prisma studio` directly.

4. **Set the same URL everywhere**  
   See **DB_CONNECTIONS.md** in the project root for step-by-step fix. Use the same `DATABASE_URL` (with or without `connection_limit`) in:
   - `server/.env` (local)
   - Render Environment (backend)
   The server and the Studio wrapper add a connection limit when needed.
