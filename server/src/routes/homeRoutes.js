import express from "express";
import { getHome, updateHome } from "../controllers/homeController.js";

const router = express.Router();

router.get("/", getHome);     // GET /api/home
router.put("/", updateHome);  // PUT /api/home (admin only)

export default router;
