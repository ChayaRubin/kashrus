# Why It Works Locally But Not on Render

When the app works locally but not on Render, it’s usually one of these.

---

## 1. Frontend still calls localhost (most common)

The built frontend (Netlify) must call your **Render** API, not `http://localhost:5000`.

**Fix – Netlify (or wherever the frontend is hosted):**

1. Open **Site settings → Environment variables**.
2. Add (or update):
   - **Key:** `VITE_API_URL`
   - **Value:** Your Render backend URL, e.g. `https://your-app-name.onrender.com`  
   (no trailing slash, HTTPS.)
3. **Trigger a new deploy** (Build & deploy → Trigger deploy).  
   Env vars are baked in at build time; changing them alone is not enough.

After redeploy, open the live site and check the Network tab: requests should go to `https://...onrender.com`, not `localhost:5000`.

**If the frontend is a Render Static Site (e.g. kashrusFront):**

- **Root Directory:** set to `client` (so the build runs in the folder that has `vite build`).
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment:** `VITE_API_URL` = `https://kashrus-back.onrender.com` (your backend URL, no trailing slash).
- After changing **any** env var, click **Manual Deploy** so a new build runs with the new value. The current live site was built with the old env; only a new build fixes it.

---

## 2. CORS: backend doesn’t allow your frontend URL

The server only allows the origin in `FRONTEND_URL`. If that’s wrong or missing, the browser blocks requests.

**Fix – Render:**

1. Open your **Web Service → Environment**.
2. Set:
   - **Key:** `FRONTEND_URL`
   - **Value:** Exact URL of your frontend, e.g. `https://your-site.netlify.app`  
   (no trailing slash.)
3. Save and let the service redeploy.

`FRONTEND_URL` must match the origin of the tab (e.g. Netlify URL). No typo, no `http` if the site is `https`.

---

## 3. Backend can’t reach the database

If `DATABASE_URL` is missing or wrong on Render, the server may crash at startup or return 500 on any DB request.

**Fix – Render:**

1. **Environment** → set `DATABASE_URL` to your **Clever Cloud** PostgreSQL connection string (same one you use locally, or the one from Clever Cloud’s dashboard).
2. For limited connection plans, add to the URL: `&connection_limit=2` (or `?connection_limit=2` if there’s no `?` yet).
3. Save and redeploy.

Check **Logs** on Render after deploy. If you see “Can't reach database” or “too many connections”, the problem is `DATABASE_URL` or the DB plan.

---

## 4. Render build/start or root directory

The server must **build** and **start** from the right place.

**Recommended on Render:**

- **Root Directory:** `server`  
  (so Render runs `npm install` and `npm start` inside the `server` folder.)
- **Build Command:**  
  `npm install && npm run db:generate`  
  (or `npm install` if `postinstall` already runs `prisma generate`.)
- **Start Command:**  
  `npm start`

If you don’t set Root Directory to `server`, then Build Command could be e.g. `cd server && npm install && npm run db:generate` and Start Command `cd server && npm start`, so that both run from the repo root but execute in `server`.

After a deploy, open `https://your-service.onrender.com` in the browser. You should see something like `{"ok":true}`. If you get “Application failed to start” or no response, check the **Logs** and fix Root Directory / Build / Start.

---

## 5. Required env vars on Render (recap)

| Variable        | Required | Example |
|----------------|----------|---------|
| `DATABASE_URL` | Yes      | Clever Cloud PostgreSQL URL (add `&connection_limit=2` if needed). |
| `FRONTEND_URL` | Yes      | `https://your-site.netlify.app` |
| `JWT_SECRET`   | Yes      | Long random string (e.g. from `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`). |
| `PORT`         | No       | Render sets this; don’t override unless required. |

---

## Quick checks

1. **Backend up?**  
   Open `https://your-render-url.onrender.com` → expect `{"ok":true}` or similar.
2. **Frontend URL?**  
   In Netlify (or your host), `VITE_API_URL` = that Render URL, then **rebuild** the site.
3. **CORS?**  
   In Render, `FRONTEND_URL` = exact frontend URL (e.g. Netlify), no trailing slash.
4. **DB?**  
   In Render, `DATABASE_URL` correct and, if needed, includes `connection_limit=2`. Check Render Logs for DB errors.

Once these match, the same app that works locally should work on Render.
