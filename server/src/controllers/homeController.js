import * as homeService from "../services/homeService.js";

export async function getHome(req, res) {
  try {
    const content = await homeService.getHomeContent();
    res.json(content);
  } catch (err) {
    console.error("Error fetching home content:", err);
    res.status(500).json({ error: "Failed to load home content" });
  }
}

export async function updateHome(req, res) {
  try {
    const { slideshowText, aboutUsText, contactText } = req.body;
    const updated = await homeService.updateHomeContent({
      slideshowText,
      aboutUsText,
      contactText,
    });
    res.json(updated);
  } catch (err) {
    console.error("Error updating home content:", err);
    res.status(500).json({ error: "Failed to update home content" });
  }
}
