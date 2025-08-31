// server/src/controllers/ratingsController.js
import * as ratingsService from "../services/ratingsService.js";

export async function getRating(req, res) {
  try {
    const rating = await ratingsService.getUserRating(
      parseInt(req.params.id),
      req.user.id
    );
    res.json({ rating });
  } catch (err) {
    console.error("getRating error:", err);
    res.status(500).json({ error: "Failed to get rating" });
  }
}

export async function rate(req, res) {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const result = await ratingsService.upsertRating(
      parseInt(req.params.id),
      req.user.id,
      rating
    );
    res.json({ success: true, rating: result });
  } catch (err) {
    console.error("rate error:", err);
    res.status(500).json({ error: "Failed to rate restaurant" });
  }
}

export async function removeRating(req, res) {
  try {
    await ratingsService.deleteRating(
      parseInt(req.params.id),
      req.user.id
    );
    res.json({ success: true });
  } catch (err) {
    console.error("removeRating error:", err);
    res.status(500).json({ error: "Failed to remove rating" });
  }
}
