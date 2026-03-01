# Fix: "Too many database connections"

Your DB (e.g. Clever Cloud free tier) allows only a few connections. When the **server** and **Prisma Studio** (or seeds) run together, they can exceed that limit.

## 1. Add connection limit to `server/.env`

Edit `server/.env` and ensure `DATABASE_URL` includes a connection limit.

- If the URL already has `?` (e.g. `?sslmode=require`), append: **`&connection_limit=2`**
- If it has no `?`, append: **`?connection_limit=2`**

**Example:**

```env
# Before
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require

# After (same line, add at the end)
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require&connection_limit=2
```

Then **restart the server** so it uses the new URL.

## 2. How to open Prisma Studio

Use the wrapper so Studio also uses a limited connection:

```bash
# From project root
npm run db:studio --workspace=server
```

or from the `server` folder:

```bash
npm run db:studio
```

**Do not** run `npx prisma studio` directly or open Studio from the IDE’s “Open Prisma Studio” if that bypasses the wrapper—it may open too many connections.

## 3. Don’t run everything at once

If you still see "too many connections":

- Close Prisma Studio when you’re not browsing the DB, or  
- Stop the dev server while using Studio.

With `connection_limit=2` in `DATABASE_URL`, the server uses at most 2 connections and the Studio wrapper uses 1, so total stays within typical free-tier limits.
