// server/src/routes/upload.js
import express from "express";
import { upload } from "../lib/index.js";

const router = express.Router();

// POST /upload/image
router.post("/image", upload.single("file"), (req, res) => {
  try {
    res.json({ url: req.file.path }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;

