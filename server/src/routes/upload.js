// server/src/routes/upload.js
import express from "express";
import { upload } from "../lib/index.js";

const router = express.Router();

// POST /upload/image
router.post("/image", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Upload middleware error:", err);
      return next(err);
    }
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file received or upload failed" });
    }
    res.json({ url: req.file.path });
  });
});

export default router;

