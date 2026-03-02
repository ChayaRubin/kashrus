/**
 * Single shared PostgreSQL connection pool for the entire app.
 * - Use pool.query() in services; do NOT create new Client or Pool elsewhere.
 * - Limits connections to avoid exceeding Clever Cloud / free-tier limits.
 */
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn("DATABASE_URL is not set; database features will fail.");
}

// Clever Cloud free tier often allows only 1 connection; use max 1 to avoid "too many connections"
const pool = new Pool({
  connectionString,
  max: 1,
  min: 0,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 8000,
  ssl:
    connectionString && connectionString.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("error", (err) => {
  console.error("Unexpected pool error:", err.message);
});

/**
 * Execute a query. Use this instead of creating new clients.
 * @param {string} text - SQL query (use $1, $2 for params)
 * @param {unknown[]} [params] - Query parameters
 * @returns {Promise<pg.QueryResult>}
 */
export function query(text, params) {
  return pool.query(text, params);
}

export default pool;
