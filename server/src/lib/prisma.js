import { PrismaClient } from "@prisma/client";

// Use a small connection pool to avoid "too many connections" on limited DBs (e.g. Clever Cloud)
const url = process.env.DATABASE_URL;
const urlWithLimit =
  url && !url.includes("connection_limit=")
    ? `${url}${url.includes("?") ? "&" : "?"}connection_limit=2`
    : url;
const opts = urlWithLimit ? { datasources: { db: { url: urlWithLimit } } } : {};
const prisma = new PrismaClient(opts);

// TEMP: print the models your *running server* actually sees
console.log(
  "Prisma models (server):",
  Object.keys(prisma).filter(k => !k.startsWith("$") && !k.startsWith("_"))
);

export default prisma;
