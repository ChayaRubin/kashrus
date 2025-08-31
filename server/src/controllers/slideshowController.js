import * as slideshowService from "../services/slideshowService.js";

// GET /slideshow
export async function getSlides(req, res, next) {
  try {
    const slides = await slideshowService.listSlides();
    res.json(slides);
  } catch (err) {
    next(err);
  }
}

// POST /slideshow
export async function createSlide(req, res, next) {
  try {
    const slide = await slideshowService.createSlide(req.body);
    res.status(201).json(slide);
  } catch (err) {
    next(err);
  }
}

// PUT /slideshow/:id
export async function updateSlide(req, res, next) {
  try {
    const slide = await slideshowService.updateSlide(req.params.id, req.body);
    res.json(slide);
  } catch (err) {
    next(err);
  }
}

// DELETE /slideshow/:id
export async function deleteSlide(req, res, next) {
  try {
    await slideshowService.deleteSlide(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
