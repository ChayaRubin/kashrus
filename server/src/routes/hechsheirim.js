// src/routes/rabanim.js
import { Router } from "express";
import * as c from "../controllers/hechsheirimController.js";
const r = Router();
r.get("/", c.list);
r.get("/:id", c.get);
r.post("/", c.create);
r.put("/:id", c.update);
r.delete("/:id", c.remove);
export default r;
