// src/controllers/usersController.js
import * as usersService from "../services/usersService.js";
import { Prisma } from "@prisma/client";

// GET /users
export async function getAll(req, res) {
  try {
    const data = await usersService.listUsers();
    res.json(data);
  } catch (err) {
    console.error("Users controller error [GET /users]:", err);
    res.status(500).json({ error: "Failed to fetch users", detail: err?.message || String(err) });
  }
}

// GET /users/:id
export async function getById(req, res) {
  try {
    const data = await usersService.getUserById(req.params.id);
    if (!data) return res.status(404).json({ error: "User not found" });
    res.json(data);
  } catch (err) {
    console.error(`Users controller error [GET /users/${req.params.id}]:`, err);
    res.status(500).json({ error: "Failed to fetch user", detail: err?.message || String(err) });
  }
}

// POST /users
export async function create(req, res) {
  try {
    const { name, email, role, can_self_book, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }

    const data = await usersService.createUser({ name, email, role, can_self_book, password });
    res.status(201).json(data);
  } catch (err) {
    // Handle unique email constraint nicely
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      console.error("Users controller error [POST /users] unique email:", err);
      return res.status(409).json({ error: "Email already exists" });
    }
    console.error("Users controller error [POST /users]:", err);
    res.status(500).json({ error: "Failed to create user", detail: err?.message || String(err) });
  }
}

// PUT /users/:id
export async function update(req, res) {
  try {
    const data = await usersService.updateUser(req.params.id, req.body || {});
    res.json(data);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      console.error(`Users controller error [PUT /users/${req.params.id}] unique email:`, err);
      return res.status(409).json({ error: "Email already exists" });
    }
    // If Prisma says record not found
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    console.error(`Users controller error [PUT /users/${req.params.id}]:`, err);
    res.status(500).json({ error: "Failed to update user", detail: err?.message || String(err) });
  }
}

// DELETE /users/:id
export async function remove(req, res) {
  try {
    await usersService.deleteUser(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    // If Prisma says record not found
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    console.error(`Users controller error [DELETE /users/${req.params.id}]:`, err);
    res.status(500).json({ error: "Failed to delete user", detail: err?.message || String(err) });
  }
}
