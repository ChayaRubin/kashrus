// server/src/services/restaurantsService.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const VALID_LEVELS = ["FIRST", "SECOND", "THIRD"];
const VALID_CATEGORIES = ["MEAT", "DAIRY"];
const VALID_TYPES = [
  "FAST_FOOD",
  "SIT_DOWN",
  "BAGELS",
  "SUSHI",
  "PIZZA",
  "FALAFEL",
  "ICE_CREAM",
];

// Helper: normalize images array -> string
function serializeImages(images) {
  if (!images) return null;
  if (Array.isArray(images)) {
    return images.length ? JSON.stringify(images) : null;
  }
  return String(images);
}

// Helper: parse stored string -> array
function parseImages(images) {
  if (!images) return [];
  try {
    return JSON.parse(images);
  } catch {
    return [images];
  }
}


export async function list({ where = {}, skip = 0, take = 100, orderBy = { id: "asc" } }) {
  return prisma.restaurant.findMany({ where, skip, take, orderBy });
}

export async function getById(id) {
  return prisma.restaurant.findUnique({ where: { id } });
}

// keep create/update/remove as you have, or strip logic if you want the controller to validate

export async function listWithImages({ where = {}, orderBy = { name: "asc" } }) {
  const rows = await prisma.restaurant.findMany({
    where,
    orderBy,
  });
  return rows.map((r) => ({ ...r, images: parseImages(r.images) }));
}


export async function create(data) {
  const { name, city, address, phone, hechsher, website, level, category, type, images } = data;
  const lvl = String(level || "").toUpperCase();
  const cat = String(category || "").toUpperCase();
  const typ = String(type || "").toUpperCase();

  if (!name) throw new Error("name is required");
  if (!VALID_LEVELS.includes(lvl)) throw new Error("invalid level");
  if (!VALID_CATEGORIES.includes(cat)) throw new Error("invalid category");
  if (!VALID_TYPES.includes(typ)) throw new Error("invalid type");

  const created = await prisma.restaurant.create({
    data: {
      name,
      city,
      address,
      phone,
      hechsher,
      website,
      level: lvl,
      category: cat,
      type: typ,
      images: serializeImages(images),
    },
  });
  return { ...created, images: parseImages(created.images) };
}

export async function update(id, data) {
  const { level, images, ...rest } = data;
  const updateData = { ...rest };

  if (level !== undefined) {
    const lvl = String(level).toUpperCase();
    if (!VALID_LEVELS.includes(lvl)) throw new Error("invalid level");
    updateData.level = lvl;
  }
  if (images !== undefined) {
    updateData.images = serializeImages(images);
  }

  const updated = await prisma.restaurant.update({
    where: { id: Number(id) },
    data: updateData,
  });
  return { ...updated, images: parseImages(updated.images) };
}

export async function remove(id) {
  return prisma.restaurant.delete({ where: { id: Number(id) } });
}
