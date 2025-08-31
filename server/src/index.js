import 'dotenv/config';
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
import contactRoute from "./routes/contactRoute.js";
import uploadRoutes from "./routes/upload.js";
import slideshowRoutes from "./routes/slideshow.js";
// import ratingsRoutes from "./routes/ratings.js";
import feedbackRoutes from "./routes/feedback.js";
import contactRoutes from "./routes/contact.js";
import homeRoutes from "./routes/homeRoutes.js";



import './controllers/googleAuth.js'; 

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
app.use('/contact', contactRoute);
app.use("/upload", uploadRoutes);
app.use("/slideshow", slideshowRoutes);
// app.use("/ratings", ratingsRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/contact", contactRoutes);
app.use("/home", homeRoutes);

// health check
app.get('/', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
