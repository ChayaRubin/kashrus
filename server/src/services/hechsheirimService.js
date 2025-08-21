// src/services/hechsherimService.js
// import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma.js";
// const prisma = new PrismaClient();


export async function list({ q, skip, take }) {
  const where = q ? {
    OR: [
      { name: { contains:q } },
      { description: { contains:q } },
    ],
  } : undefined;

  const [items, total] = await Promise.all([
    prisma.hechsher.findMany({ where, orderBy:{ name:"asc" }, skip, take }),
    prisma.hechsher.count({ where }),
  ]);
  return { items, total };
}
export const get    = (id) => prisma.hechsher.findUnique({ where:{ id:+id } });
export const create = (data) => prisma.hechsher.create({ data });
export const update = (id, data) => prisma.hechsher.update({ where:{ id:+id }, data });
export const remove = (id) => prisma.hechsher.delete({ where:{ id:+id } });
