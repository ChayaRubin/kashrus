// ESM version
import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next) {
  const bearer = req.headers.authorization;
  const headerToken = bearer?.startsWith('Bearer ') ? bearer.split(' ')[1] : null;
  const cookieToken = req.cookies?.token;
  const token = headerToken || cookieToken;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
