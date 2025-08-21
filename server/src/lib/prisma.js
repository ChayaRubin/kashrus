import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// TEMP: print the models your *running server* actually sees
console.log(
  "Prisma models (server):",
  Object.keys(prisma).filter(k => !k.startsWith("$") && !k.startsWith("_"))
);

export default prisma;
