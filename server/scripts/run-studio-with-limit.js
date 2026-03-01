/**
 * Run Prisma Studio with connection_limit=1 so it doesn't exhaust the DB.
 * Use: npm run db:studio (after we point db:studio to this script)
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

let url = process.env.DATABASE_URL || "";
if (url && !url.includes("connection_limit=")) {
  url += (url.includes("?") ? "&" : "?") + "connection_limit=1";
  process.env.DATABASE_URL = url;
}

// From server/scripts, schema is at ../../db/prisma/schema.prisma (project root)
const rootDir = path.join(__dirname, "../..");
const schemaPath = path.join(rootDir, "db/prisma/schema.prisma");
const child = spawn("npx", ["prisma", "studio", `--schema=${schemaPath}`], {
  stdio: "inherit",
  env: process.env,
  cwd: rootDir,
});
child.on("exit", (code) => process.exit(code || 0));
