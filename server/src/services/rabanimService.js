// src/services/rabanimService.js
// import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma.js";
// const prisma = new PrismaClient();


export async function list({ q, area, skip, take }) {
  const where = {
    ...(q ? { OR: [{ name: { contains:q } }, { bio: { contains:q } }] } : {}),
    ...(area ? { area: { contains: area } } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.rabbi.findMany({ where, orderBy:{ name:"asc" }, skip, take }),
    prisma.rabbi.count({ where }),
  ]);
  return { items, total };
}
export const get    = (id) => prisma.rabbi.findUnique({ where:{ id:+id } });
export const create = (data) => prisma.rabbi.create({ data });
export const update = (id, data) => prisma.rabbi.update({ where:{ id:+id }, data });
export const remove = (id) => prisma.rabbi.delete({ where:{ id:+id } });
