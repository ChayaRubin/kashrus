# Client Site

## Running locally

The frontend talks to the backend at `http://localhost:5000`. **You must start the backend** or you’ll see `ERR_CONNECTION_REFUSED`.

### Start both (recommended)

From the project root:

```bash
npm run dev
```

This starts:

- **Backend** (API) on http://localhost:5000  
- **Frontend** (Vite) on http://localhost:5173 (or 5174 if 5173 is in use)

### Start separately

**Terminal 1 – backend**

```bash
npm run dev-server
```

(or `npm run dev --workspace=server` from the project root)

**Terminal 2 – frontend**

```bash
npm run dev-client
```

(or `npm run dev --workspace=client`)

Then open the URL Vite prints (e.g. http://localhost:5173). The app will load slideshow, home, auth, rabanim, hechsheirim, and articles from the API once the server is running.

---

See **ENV_VARIABLES.md** for environment variables and **DB_CONNECTIONS.md** for database connection limits (e.g. Clever Cloud).
