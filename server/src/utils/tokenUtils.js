// src/utils/tokenUtils.js
import jwt from 'jsonwebtoken';

export function generateAndSetToken(res, payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
  httpOnly: true,
  sameSite: 'lax',
  secure: false, // keep false on localhost
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',     // 👈 ensure cookie is visible everywhere
  });
}
