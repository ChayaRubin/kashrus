// client/src/pages/public/TypePage/TypePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Restaurants } from "../../../app/api.js";
import s from "./TypePage.module.css";

const TYPES_BY_CATEGORY = {
  MEAT: ["FAST_FOOD", "SIT_DOWN"],
  DAIRY: ["BAGELS", "SUSHI", "PIZZA", "FALAFEL", "ICE_CREAM", "SIT_DOWN"],
};

const LEVELS = ["FIRST", "SECOND", "THIRD"];

export default function TypePage() {
  const { category } = useParams();
  const nav = useNavigate();
  const options = TYPES_BY_CATEGORY[category] || [];

  const [restaurants, setRestaurants] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);   // multi
  const [selectedLevels, setSelectedLevels] = useState([]); // multi
  const [loading, setLoading] = useState(false);

  function toggle(arr, val) {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }
  const onToggleType  = (t) => setSelectedTypes((prev) => toggle(prev, t));
  const onToggleLevel = (l) => setSelectedLevels((prev) => toggle(prev, l));

  useEffect(() => {
    // default: show nothing until at least one filter is selected
    if (selectedTypes.length === 0 && selectedLevels.length === 0) {
      setRestaurants([]);
      return;
    }

    setLoading(true);
    Restaurants.list({
      category,
      types: selectedTypes,
      levels: selectedLevels,
    })
      .then(setRestaurants)
      .catch((e) => {
        console.error("Failed to load restaurants", e);
        setRestaurants([]);
      })
      .finally(() => setLoading(false));
  }, [category, selectedTypes, selectedLevels]);

  return (
    <div className={s.wrap}>
      <h2 className={s.title}>{category} — choose types</h2>

      {/* TYPES: cards (multi-select) with visible "pressed" state */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 10px" }}>Types</h3>
        <div className={s.grid}>
          {options.map((t) => {
            const active = selectedTypes.includes(t);
            return (
              <button
                key={t}
                onClick={() => onToggleType(t)}
                className={s.card}
                title={t.replaceAll("_", " ")}
                style={{
                  border: active ? "2px solid #0a7cff" : "1px solid #e5e7eb",
                  background: active ? "#eaf3ff" : "#fff",
                  boxShadow: active ? "0 0 0 3px rgba(10,124,255,0.15)" : "none",
                  fontWeight: active ? 600 : 500,
                }}
              >
                {t.replaceAll("_", " ")}
              </button>
            );
          })}
        </div>
      </div>

      {/* LEVELS: checkboxes */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 10px" }}>Levels</h3>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {LEVELS.map((l) => (
            <label key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={selectedLevels.includes(l)}
                onChange={() => onToggleLevel(l)}
              />
              {l}
            </label>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      <div style={{ marginTop: 10 }}>
        {loading ? (
          <p>Loading…</p>
        ) : restaurants.length > 0 ? (
          <ul style={{ display: "grid", gap: 12, paddingLeft: 0, margin: 0 }}>
            {restaurants.map((r) => (
              <li
                key={r.id}
                onDoubleClick={() => nav(`/restaurant/${r.id}`)}
                style={{
                  listStyle: "none",
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <strong>{r.name}</strong> — {r.type} ({r.level})
              </li>
            ))}
          </ul>
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
}
