// src/controllers/googleAuth.js
// Registers the Google OAuth strategy with passport using the shared Prisma client.
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../lib/prisma.js";

const backendBase =
  (process.env.BACKEND_URL && process.env.BACKEND_URL.replace(/\/$/, "")) ||
  "http://localhost:5000";

const callbackURL = `${backendBase}/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false);

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName || "User",
              email,
              role: "user",
            },
          });
        }

        done(null, { id: user.id, email: user.email, role: user.role });
      } catch (err) {
        done(err);
      }
    }
  )
);

