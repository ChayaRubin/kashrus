import express from "express";
import * as restaurantsController from "../controllers/restaurantsController.js";

const router = express.Router();

router.get("/", restaurantsController.list);
router.get("/:id", restaurantsController.getById);
router.post("/", restaurantsController.create);
router.put("/:id", restaurantsController.update);
router.delete("/:id", restaurantsController.remove);
router.get("/admin/all", restaurantsController.listAll);

export default router;
