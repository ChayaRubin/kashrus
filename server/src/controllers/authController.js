// src/controllers/authController.js
import bcrypt from "bcryptjs";
import authService from "../services/authService.js";
import { generateAndSetToken } from "../utils/tokenUtils.js";

// --- Signup ---
async function signup(req, res) {
  const { name, email, password } = req.body;
  try {
    if (await authService.emailExists(email)) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const { insertId } = await authService.insertUser(name, email, "user");
    const hashedPassword = await bcrypt.hash(password, 10);
    await authService.insertPasswordHash(insertId, hashedPassword);

    generateAndSetToken(res, { id: insertId, email, role: "user" });
    res.status(201).json({
      message: "Signup successful",
      user: { id: insertId, email, role: "user" },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration error" });
  }
}

// --- Login ---
async function login(req, res) {
  console.log("Login body:", req.body); // 👈 debug log

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and password are required" });
  }

  try {
    const user = await authService.getUserByEmail(email);
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const hash = await authService.getPasswordHashByUserId(user.id);
    if (!hash)
      return res.status(401).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, hash);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    generateAndSetToken(res, {
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ error: "Login error" });
  }
}

// --- Google OAuth callback ---
function googleCallback(req, res) {
  const user = req.user;
  generateAndSetToken(res, {
    id: user.id,
    email: user.email,
    role: user.role,
  });
  res.redirect(
    process.env.FRONTEND_URL
      ? `${process.env.FRONTEND_URL}/`
      : "http://localhost:5173/"
  );
}

// --- Logout ---
function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
}

// --- Get current user ---
function getMe(req, res) {
  const { id, email, role } = req.user;
  res.json({ id, email, role });
}

export default { signup, login, googleCallback, logout, getMe };
