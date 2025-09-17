// server/src/routes/contact.js
import express from "express";
import contactController from "../controllers/contactController.js";
import { upload } from "../lib/index.js";

const router = express.Router();

// send email via Nodemailer with file upload support
router.post("/", upload.array('images', 10), contactController.sendContactEmail);

export default router;
