// src/utils/tokenUtils.js
import jwt from 'jsonwebtoken';

export function generateAndSetToken(res, payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin (e.g. Render frontend + API)
    secure: isProduction,                     // required when sameSite is 'none'
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}
