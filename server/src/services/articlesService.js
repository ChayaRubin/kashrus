import prisma from "../lib/prisma.js";

export async function list({ q, skip, take }) {
  const where = q
    ? {
        OR: [
          { title:   { contains: q } },
          { content: { contains: q } },
        ],
      }
    : undefined;

  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.article.count({ where }),
  ]);

  return { items, total };
}

export const get    = (id) => prisma.article.findUnique({ where: { id: +id } });
export const create = (data) => prisma.article.create({ data });
export const update = (id, data) =>
  prisma.article.update({ where: { id: +id }, data });
export const remove = (id) =>
  prisma.article.delete({ where: { id: +id } });
