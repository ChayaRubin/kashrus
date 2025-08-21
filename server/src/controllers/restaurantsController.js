// server/src/controllers/restaurantsController.js
import * as restaurantsService from "../services/restaurantsService.js";

// Helper: normalize to array of uppercase strings
function toArrayUpper(v) {
  if (Array.isArray(v)) return v.map(x => String(x).toUpperCase()).filter(Boolean);
  if (typeof v === "string" && v.trim()) {
    return v.split(",").map(s => s.trim().toUpperCase()).filter(Boolean);
  }
  return [];
}

// Expand FIRST/SECOND/THIRD hierarchy
function expandLevels(levels) {
  const order = ["FIRST", "SECOND", "THIRD"];
  const out = new Set();
  for (const lvl of levels) {
    const idx = order.indexOf(lvl);
    if (idx >= 0) for (let i = 0; i <= idx; i++) out.add(order[i]);
  }
  return [...out];
}

export async function list(req, res) {
  try {
    const { q, category, type, types, levels, skip = "0", take = "100" } = req.query;

    const categoryUp = category ? String(category).toUpperCase() : undefined;

    // types: prefer multi, fallback to legacy single
    const typesArr   = toArrayUpper(types);
    const legacyOne  = type ? [String(type).toUpperCase()] : [];
    const finalTypes = typesArr.length ? typesArr : legacyOne;

    // levels (required)
    const rawLevels = toArrayUpper(levels);

    // RULE: must have at least one type AND one level
    if (finalTypes.length === 0 || rawLevels.length === 0) {
      return res.json([]); // nothing selected => nothing returned
    }

    const expandedLevels = expandLevels(rawLevels);

    // Build Prisma where (service stays thin)
    const where = {};
    if (categoryUp) where.category = categoryUp;
    if (finalTypes.length) where.type = { in: finalTypes };
    if (expandedLevels.length) where.level = { in: expandedLevels };
    if (q && q.trim()) {
      where.OR = [
        { name:     { contains: q } },
        { city:     { contains: q } },
        { address:  { contains: q } },
        { hechsher: { contains: q } },
      ];
    }

    const rows = await restaurantsService.list({
      where,
      skip: Number(skip) || 0,
      take: Number(take) || 100,
      orderBy: { name: "asc" },
    });

    res.json(rows);
  } catch (err) {
    console.error("restaurantsController.list error:", err);
    res.status(500).json({ error: "Failed to load restaurants" });
  }
}

export async function getById(req, res) {
  try {
    const row = await restaurantsService.getById(Number(req.params.id));
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    console.error("restaurantsController.getById error:", err);
    res.status(500).json({ error: "Failed to load restaurant" });
  }
}

// create/update/remove can stay as you had them


export async function create(req, res) {
  try {
    const created = await restaurantsService.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error("restaurantsController.create error:", err);
    res.status(400).json({ error: err.message || "Failed to create" });
  }
}

export async function update(req, res) {
  try {
    const updated = await restaurantsService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error("restaurantsController.update error:", err);
    res.status(400).json({ error: err.message || "Failed to update" });
  }
}

export async function remove(req, res) {
  try {
    await restaurantsService.remove(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("restaurantsController.remove error:", err);
    res.status(400).json({ error: err.message || "Failed to remove" });
  }
}
