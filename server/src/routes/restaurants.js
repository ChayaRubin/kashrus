import express from "express";
import * as restaurantsController from "../controllers/restaurantsController.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

router.get("/", restaurantsController.list);
router.get("/admin/all", restaurantsController.listAll);

// Regular restaurant routes
router.get("/:id", restaurantsController.getById);
router.post("/", restaurantsController.create);
router.put("/:id", restaurantsController.update);
router.delete("/:id", restaurantsController.remove);

export default router;
