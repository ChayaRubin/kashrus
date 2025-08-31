import express from "express";
import * as ratingsController from "../controllers/ratingsController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Endpoints for ratings
router.get("/:id/rating", verifyToken, ratingsController.getRating);
router.post("/:id/rate", verifyToken, ratingsController.rate);
router.delete("/:id/rating", verifyToken, ratingsController.removeRating);
// server/src/routes/ratings.js
router.get("/mine", verifyToken, async (req, res) => {
  try {
    const ratings = await prisma.restaurantRating.findMany({
      where: { userId: req.user.id },
      include: { restaurant: true }, // so we can show restaurant name
    });
    res.json(ratings);
  } catch (err) {
    console.error("Error fetching my ratings:", err);
    res.status(500).json({ error: "Failed to load ratings" });
  }
});

export default router;
