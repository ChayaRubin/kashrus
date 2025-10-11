import express from "express";
import * as slideshowController from "../controllers/slideshowController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Public
router.get("/", slideshowController.getSlides);

// Admin CRUD - Protected routes
router.post("/", verifyToken, slideshowController.createSlide);
router.put("/:id", verifyToken, slideshowController.updateSlide);
router.delete("/:id", verifyToken, slideshowController.deleteSlide);

export default router;
