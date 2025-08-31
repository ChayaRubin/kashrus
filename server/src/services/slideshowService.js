import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function listSlides() {
  return prisma.slideshowImage.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
}

export async function createSlide({ url, title, order }) {
  return prisma.slideshowImage.create({
    data: { url, title, order },
  });
}

export async function updateSlide(id, data) {
  return prisma.slideshowImage.update({
    where: { id: Number(id) },
    data,
  });
}

export async function deleteSlide(id) {
  return prisma.slideshowImage.delete({
    where: { id: Number(id) },
  });
}
