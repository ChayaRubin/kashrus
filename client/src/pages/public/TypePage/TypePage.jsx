import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Restaurants } from "../../../app/api.js";
import s from "./TypePage.module.css";

const TYPES_BY_CATEGORY = {
  MEAT: ["FAST_FOOD", "SIT_DOWN"],
  DAIRY: ["BAGELS", "SUSHI", "PIZZA", "FALAFEL", "ICE_CREAM", "SIT_DOWN"],
};

const LEVELS = ["FIRST", "SECOND", "THIRD"];

const NEIGHBORHOODS = [
  "Har Nof / Bayit Vegan",
  "Talpiyot",
  "Ramot / Ramat Shlomo",
  "Romeima / Shamgar",
  "Old City / Mamilla",
  "Pisgat zeev / Neve Yaakov",
  "Ramat Eshkol / French Hill / Shmuel HaNavi",
  "Beis Yisrael / Geula",
  "Har Chotzvim",
  "Other",
];

export default function TypePage() {
  const { category } = useParams();
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const options = TYPES_BY_CATEGORY[category] || [];

  const [restaurants, setRestaurants] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  function toggle(arr, val) {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  const onToggleType = (t) => setSelectedTypes((prev) => toggle(prev, t));
  const onToggleLevel = (l) => setSelectedLevels((prev) => toggle(prev, l));

  // Initialize state from URL
  useEffect(() => {
    const typesParam = searchParams.get("types");
    const levelsParam = searchParams.get("levels");
    const neighborhoodParam = searchParams.get("neighborhood");

    const initialTypes = typesParam ? typesParam.split(",").filter(Boolean) : [];
    const initialLevels = levelsParam ? levelsParam.split(",").filter(Boolean) : [];

    setSelectedTypes(initialTypes.filter((t) => (TYPES_BY_CATEGORY[category] || []).includes(t)));
    setSelectedLevels(initialLevels.filter((l) => LEVELS.includes(l)));
    setSelectedNeighborhood(neighborhoodParam || "");
  }, [category]);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedTypes.length > 0) params.set("types", selectedTypes.join(","));
    else params.delete("types");

    if (selectedLevels.length > 0) params.set("levels", selectedLevels.join(","));
    else params.delete("levels");

    if (selectedNeighborhood) params.set("neighborhood", selectedNeighborhood);
    else params.delete("neighborhood");

    setSearchParams(params, { replace: true });
  }, [selectedTypes, selectedLevels, selectedNeighborhood, setSearchParams]);

  // Fetch restaurants
  useEffect(() => {
    if (selectedTypes.length === 0 && selectedLevels.length === 0) {
      setRestaurants([]);
      return;
    }
    setLoading(true);
    Restaurants.list({
      category,
      types: selectedTypes,
      levels: selectedLevels,
      neighborhood: selectedNeighborhood || undefined,
    })
      .then(setRestaurants)
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, [category, selectedTypes, selectedLevels, selectedNeighborhood]);

  return (
    <div className={s.wrap}>
      <div className={s.back}>
        <button onClick={() => nav("/browse")} className={s.backbutton}>
          Back
        </button>
      </div>

<div className={s.section}>
    <div className={s.levelNote}>
    We recommend choosing <strong>FIRST</strong> level for the best results!
  </div>
  <div className={s.levelsRow}>
  {/* <h2 className={s.levelsTitle}>Levels</h2> */}
  <div className={s.levels}>
    {LEVELS.map((l) => (
  <label key={l} className={s.levelLabel}>
    {l} TIER
    <input
      type="checkbox"
      checked={selectedLevels.includes(l)}
      onChange={() => onToggleLevel(l)}
    />
  </label>
))}



  </div>
</div>

</div>



      <h2 className={s.title}>{category}</h2>

      {/* TYPES */}
      <div className={s.section}>
        <div className={s.grid}>
          {options.map((t) => {
            const active = selectedTypes.includes(t);
            return (
              <button
                key={t}
                onClick={() => onToggleType(t)}
                className={`${s.card} ${active ? s.cardActive : ""}`}
              >
                {t.replaceAll("_", " ")}
              </button>
            );
          })}
        </div>
      </div>

      {/* CUSTOM NEIGHBORHOOD DROPDOWN */}
      <div className={s.section}>
        <h3 className={s.subtitle}>Neighborhood</h3>
        <div className={s.dropdownWrap}>
          <button
            className={s.dropdownBtn}
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            {selectedNeighborhood || "All"}
            <span className={s.arrow}>▼</span>
          </button>
          {openDropdown && (
            <ul className={s.dropdownList}>
              <li
                onClick={() => {
                  setSelectedNeighborhood("");
                  setOpenDropdown(false);
                }}
              >
                All
              </li>
              {NEIGHBORHOODS.map((n) => (
                <li
                  key={n}
                  onClick={() => {
                    setSelectedNeighborhood(n);
                    setOpenDropdown(false);
                  }}
                >
                  {n}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* RESULTS */}
      <div className={s.section}>
        {loading ? (
          <p>Loading…</p>
        ) : restaurants.length > 0 ? (
          <ul className={s.results}>
            {restaurants.map((r) => (
              <li
                key={r.id}
                onClick={() =>
                  nav(`/restaurant/${r.id}`, {
                    state: {
                      from: `/browse/${category}?types=${selectedTypes.join(",")}&levels=${selectedLevels.join(",")}&neighborhood=${selectedNeighborhood}`,
                    },
                  })
                }
                className={s.resultItem}
              >
                <div className={s.resultContent}>
                  <strong>{r.name}</strong> — {r.type} ({r.level})
                  <div className={s.meta}>
                    <p>
                       {r.hechsher || "N/A"}
                    </p>
                    <p>
                       {r.address || "N/A"}
                    </p>
                    <p>
                       {r.neighborhood || "N/A"}
                    </p>
                  </div>
                </div>
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
