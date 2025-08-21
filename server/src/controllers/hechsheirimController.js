// src/controllers/hechsherimController.js
import * as svc from "../services/hechsheirimService.js";
import { pageParams } from "../utils/pagination.js";
export async function list(req,res){ const { q } = req.query; const { skip, take } = pageParams(req.query); res.json(await svc.list({ q, skip, take })); }
export async function get(req,res){ const x = await svc.get(req.params.id); if(!x) return res.sendStatus(404); res.json(x); }
export async function create(req,res){ res.status(201).json(await svc.create(req.body)); }
export async function update(req,res){ res.json(await svc.update(req.params.id, req.body)); }
export async function remove(req,res){ res.json(await svc.remove(req.params.id)); }
