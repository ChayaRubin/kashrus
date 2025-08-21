// src/routes/usersRoute.js
import { Router } from "express";
import { getAll, getById, create, update, remove } from "../controllers/usersController.js";
// If you have auth/role middleware, import them here.
// import { verifyToken, requireRole } from "../middleware/auth.js";

const router = Router();

// Add your auth/role guards as needed:
// router.use(verifyToken)
// router.use(requireRole("admin"))

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
