import { prisma } from '../lib/prisma.js';

export async function getHomeContent() {
  // one row with id=1
  return prisma.homeContent.findUnique({ where: { id: 1 } });
}

export async function updateHomeContent(data) {
  return prisma.homeContent.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
}

