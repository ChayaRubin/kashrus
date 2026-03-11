import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import morgan from 'morgan';

import authRoute from './routes/authRoute.js';
import restaurantsRoute from './routes/restaurants.js';
import articlesRoutes from "./routes/articles.js";
import rabanimRoutes from "./routes/rabanim.js";
import hechsheirimRoutes from "./routes/hechsheirim.js";
import usersRoute from "./routes/usersRoute.js";
import uploadRoutes from "./routes/upload.js";
import slideshowRoutes from "./routes/slideshow.js";
// import ratingsRoutes from "./routes/ratings.js";
import feedbackRoutes from "./routes/feedback.js";
import contactRoutes from "./routes/contact.js";
import homeRoutes from "./routes/homeRoutes.js";
import { errorHandler } from "./middleware/error.js";

import './controllers/googleAuth.js'; 

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
// CORS: production = FRONTEND_URL only; local = any localhost/127.0.0.1
const isProduction = process.env.FRONTEND_URL && !/localhost|127\.0\.0\.1/.test(process.env.FRONTEND_URL);
const normalizeOrigin = (url) => (url || "").replace(/\/$/, ""); // no trailing slash
const allowedFrontend = normalizeOrigin(process.env.FRONTEND_URL);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (isProduction && allowedFrontend) {
      if (normalizeOrigin(origin) === allowedFrontend) return cb(null, origin);
      return cb(null, false);
    }
    // Local dev: allow localhost, 127.0.0.1, and any Capacitor/WebView origin
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return cb(null, origin);
    if (/^capacitor:\/\/localhost$/.test(origin) || /^ionic:\/\/localhost$/.test(origin)) return cb(null, origin);
    // Allow any origin in local dev (no FRONTEND_URL set) so Android app always works
    if (!isProduction) return cb(null, origin || true);
    return cb(null, false);
  },
  credentials: true,
}));
app.use(passport.initialize());

// routes
app.use('/auth', authRoute);
app.use("/articles", articlesRoutes);
app.use("/rabanim", rabanimRoutes);
app.use("/hechsheirim", hechsheirimRoutes);
app.use('/restaurants', restaurantsRoute);
app.use('/users', usersRoute);
app.use("/upload", uploadRoutes);
app.use("/slideshow", slideshowRoutes);
// app.use("/ratings", ratingsRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/contact", contactRoutes);
app.use("/home", homeRoutes);

// health check
app.get('/', (_req, res) => res.json({ ok: true }));

// Image proxy for Android: emulator often fails HTTPS to Cloudinary (cert error).
// App requests image via our HTTP backend, we fetch from Cloudinary and stream back.
const ALLOWED_IMAGE_HOSTS = ['res.cloudinary.com', 'cloudinary.com'];
app.get('/api/proxy-image', async (req, res) => {
  const rawUrl = req.query.url;
  if (!rawUrl || typeof rawUrl !== 'string') {
    return res.status(400).json({ error: 'Missing url' });
  }
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return res.status(400).json({ error: 'Invalid url' });
  }
  if (parsed.protocol !== 'https:') {
    return res.status(400).json({ error: 'Only https URLs allowed' });
  }
  if (!ALLOWED_IMAGE_HOSTS.includes(parsed.hostname)) {
    return res.status(403).json({ error: 'Domain not allowed' });
  }
  try {
    const imageRes = await fetch(rawUrl, { method: 'GET' });
    if (!imageRes.ok) {
      return res.status(imageRes.status).send(imageRes.statusText);
    }
    const contentType = imageRes.headers.get('content-type') || 'image/png';
    res.setHeader('content-type', contentType);
    res.setHeader('cache-control', imageRes.headers.get('cache-control') || 'public, max-age=86400');
    const buf = await imageRes.arrayBuffer();
    res.send(Buffer.from(buf));
  } catch (err) {
    console.error('Proxy image error', rawUrl, err);
    res.status(502).json({ error: 'Failed to fetch image' });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () =>
  console.log(`API running on http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`)
);
