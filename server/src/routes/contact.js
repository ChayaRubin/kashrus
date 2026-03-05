// server/src/routes/contact.js
import express from "express";
import contactController from "../controllers/contactController.js";
import { upload } from "../lib/index.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// send contact/request email — requires login
router.post("/", verifyToken, upload.array('images', 10), contactController.sendContactEmail);

export default router;
