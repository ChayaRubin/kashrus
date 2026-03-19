import prisma from '../lib/prisma.js';

export async function createFeedback({ userId, restaurantId, message }) {
  return prisma.feedback.create({
    data: { userId, restaurantId, message },
    include: { restaurant: true, user: true },
  });
}

export async function listFeedback() {
  return prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: { restaurant: true, user: true }
  });
}

export async function updateFeedbackStatus(id, status) {
  return prisma.feedback.update({
    where: { id: Number(id) },
    data: { status }
  });
}

  export async function deleteFeedback(id) {
  return prisma.feedback.delete({
    where: { id: Number(id) },
  });
}
