import express from "express";
import * as feedbackController from "../controllers/feedbackController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Public: submit feedback
router.post("/", verifyToken, feedbackController.submitFeedback);

// Admin: view + update feedback
router.get("/", verifyToken, feedbackController.listFeedback);
router.put("/:id", verifyToken, feedbackController.updateFeedback);
router.delete("/:id", verifyToken, feedbackController.deleteFeedback);

export default router;
