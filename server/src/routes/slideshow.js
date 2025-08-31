import express from "express";
import * as slideshowController from "../controllers/slideshowController.js";

const router = express.Router();

// Public
router.get("/", slideshowController.getSlides);

// Admin CRUD
router.post("/", slideshowController.createSlide);
router.put("/:id", slideshowController.updateSlide);
router.delete("/:id", slideshowController.deleteSlide);

export default router;
