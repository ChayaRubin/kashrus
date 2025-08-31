// server/src/services/ratingsService.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getUserRating(restaurantId, userId) {
  const rating = await prisma.restaurantRating.findUnique({
    where: { restaurantId_userId: { restaurantId, userId } }
  });
  return rating?.rating || 0;
}

export async function upsertRating(restaurantId, userId, rating) {
  const result = await prisma.restaurantRating.upsert({
    where: { restaurantId_userId: { restaurantId, userId } },
    update: { rating },
    create: { restaurantId, userId, rating }
  });

  await recalcRestaurantStats(restaurantId);
  return result.rating;
}

export async function deleteRating(restaurantId, userId) {
  await prisma.restaurantRating.delete({
    where: { restaurantId_userId: { restaurantId, userId } }
  });
  await recalcRestaurantStats(restaurantId);
}

async function recalcRestaurantStats(restaurantId) {
  const ratings = await prisma.restaurantRating.findMany({
    where: { restaurantId }
  });
  const ratingSum = ratings.reduce((sum, r) => sum + r.rating, 0);
  const ratingCount = ratings.length;

  await prisma.restaurant.update({
    where: { id: restaurantId },
    data: { ratingSum, ratingCount }
  });
}
