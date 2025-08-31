// server/src/routes/contact.js
import express from "express";
import contactController from "../controllers/contactController.js";

const router = express.Router();

// send email via Nodemailer
router.post("/", contactController.sendContactEmail);

export default router;
