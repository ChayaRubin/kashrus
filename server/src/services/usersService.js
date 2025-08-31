// src/services/usersService.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { id: "desc" }   // ✅ works with your schema
  });
}

export async function getUser(id) {
  return prisma.user.findUnique({ where: { id: Number(id) } });
}


export async function createUser({ name, email, role, can_self_book, password }) {
  // hash password before saving
  const hash = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      role,
      can_self_book,
      Password: {
        create: { password_hash: hash },  // ✅ match your schema
      },
    },
  });
}


export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id: Number(id) },
    data
  });
}

export async function deleteUser(id) {
  return prisma.user.delete({ where: { id: Number(id) } });
}
