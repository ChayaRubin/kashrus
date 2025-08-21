// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const authService = {
//   emailExists: async (email) => {
//     const user = await prisma.user.findUnique({ where: { email } });
//     return !!user;
//   },

//   insertUser: async (name, email, role = 'user') => {
//     const user = await prisma.user.create({
//       data: { name, email, role, can_self_book: false },
//     });
//     // keep same shape used by controller
//     return { insertId: user.id, user };
//   },

//   insertPasswordHash: async (userId, hash) => {
//     await prisma.password.create({
//       data: { userId, password_hash: hash },
//     });
//   },

//   getUserByEmail: async (email) => {
//     return prisma.user.findUnique({ where: { email } });
//   },

//   getPasswordHashByUserId: async (userId) => {
//     const pwd = await prisma.password.findUnique({ where: { userId } });
//     return pwd ? pwd.password_hash : null;
//   },
// };

// module.exports = authService;
// src/services/authService.js
// src/services/authService.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const authService = {
  emailExists: async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    return !!user;
  },

  insertUser: async (name, email, role = 'user') => {
    const user = await prisma.user.create({
      data: { name, email, role, can_self_book: false },
    });
    return { insertId: user.id, user };
  },

  insertPasswordHash: async (userId, hash) => {
    await prisma.password.create({
      data: { userId, password_hash: hash },
    });
  },

  getUserByEmail: async (email) => {
    return prisma.user.findUnique({ where: { email } });
  },

  getPasswordHashByUserId: async (userId) => {
    const pwd = await prisma.password.findUnique({ where: { userId } });
    return pwd ? pwd.password_hash : null;
  },
};

export default authService;
