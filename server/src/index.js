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
    // Local dev: allow any localhost or 127.0.0.1
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return cb(null, origin);
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

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
