// src/services/usersService.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Small helper so we never return password hashes
const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  can_self_book: true,
};

export async function listUsers() {
  return prisma.user.findMany({ select: userSelect, orderBy: { id: "asc" } });
}

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    select: userSelect,
  });
}

export async function createUser({ name, email, role = "user", can_self_book = false, password }) {
  if (!password) {
    throw new Error("Password is required to create a user");
  }
  const password_hash = await bcrypt.hash(String(password), 10);

  return prisma.user.create({
    data: {
      name,
      email,
      role,
      can_self_book,
      // create the related Password row
      Password: {
        create: { password_hash },
      },
    },
    select: userSelect,
  });
}

export async function updateUser(id, payload) {
  const userId = Number(id);
  const { password, ...rest } = payload;

  // Build update data for the User model
  const userData = {};
  if (rest.name !== undefined) userData.name = rest.name;
  if (rest.email !== undefined) userData.email = rest.email;
  if (rest.role !== undefined) userData.role = rest.role;
  if (rest.can_self_book !== undefined) userData.can_self_book = !!rest.can_self_book;

  // If no password change, simple update
  if (!password) {
    return prisma.user.update({
      where: { id: userId },
      data: userData,
      select: userSelect,
    });
  }

  // If password provided, update both user and password in a transaction
  const password_hash = await bcrypt.hash(String(password), 10);

  const [updated] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: userData,
      select: userSelect,
    }),
    prisma.password.upsert({
      where: { userId },
      update: { password_hash },
      create: { userId, password_hash },
    }),
  ]);

  return updated;
}

export async function deleteUser(id) {
  const userId = Number(id);
  await prisma.$transaction([
    prisma.password.deleteMany({ where: { userId } }), // ensure no orphaned password row
    prisma.user.delete({ where: { id: userId } }),
  ]);
  return { ok: true };
}
