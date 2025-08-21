import express from 'express';
import passport from 'passport';
import verifyToken from '../middleware/verifyToken.js';
import authController from '../controllers/authController.js';
import '../controllers/googleAuth.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', verifyToken, authController.getMe);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
);

export default router;
