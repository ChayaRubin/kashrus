// src/services/usersService.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

const toBool = (v) => v === true || v === 1 || v === "1" || v === "true";

export async function createUser({ name, email, role = "user", can_self_book = false, password }) {
  if (!password) throw new Error("Password is required to create a user");

  const canSelfBook = toBool(can_self_book);
  const password_hash = await bcrypt.hash(String(password), 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, email, role, can_self_book: canSelfBook },
      select: userSelect,
    });
    await tx.password.create({ data: { userId: user.id, password_hash } });
    return user;
  });

  return result;
}

export async function updateUser(id, payload) {
  const userId = Number(id);
  const { password, ...rest } = payload;

  const data = {};
  if (rest.name !== undefined) data.name = rest.name;
  if (rest.email !== undefined) data.email = rest.email;
  if (rest.role !== undefined) data.role = rest.role;
  if (rest.can_self_book !== undefined) data.can_self_book = toBool(rest.can_self_book);

  if (!password) {
    return prisma.user.update({ where: { id: userId }, data, select: userSelect });
  }

  const password_hash = await bcrypt.hash(String(password), 10);
  const [updated] = await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data, select: userSelect }),
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
    prisma.password.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);
  return { ok: true };
}
