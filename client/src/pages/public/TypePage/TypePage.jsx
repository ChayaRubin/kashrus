import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Restaurants } from "../../../app/api.js";
import s from "./TypePage.module.css";

const TYPES_BY_CATEGORY = {
  MEAT: ["FAST_FOOD", "SIT_DOWN"],
  DAIRY: ["BAGELS", "SUSHI", "PIZZA", "FALAFEL", "ICE_CREAM", "SIT_DOWN"],
};

const LEVELS = ["FIRST", "SECOND", "THIRD"];

const NEIGHBORHOODS = [
  "Bayit Vegan / Kriyat Yovel",
  "Talpiyot / Emek",
  "Ramot / Ramat Shlomo",
  "Romeima / Shamgar",
  "Givat Shaul / Har Nof",
  "Old City / Mamilla / Yaffo",
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

  const [allRestaurants, setAllRestaurants] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [hasMore, setHasMore] = useState(true);

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
    
    // Reset pagination when filters change
    setVisibleCount(10);
    setAllRestaurants([]);
    setRestaurants([]);
    setHasMore(true);
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

  // Fetch all restaurants when filters change
  useEffect(() => {
    if (selectedTypes.length === 0 && selectedLevels.length === 0) {
      setAllRestaurants([]);
      setRestaurants([]);
      setHasMore(false);
      return;
    }
    
    setLoading(true);
    Restaurants.list({
      category,
      types: selectedTypes,
      levels: selectedLevels,
      neighborhood: selectedNeighborhood || undefined,
      // Load all results at once (like Home page search)
    })
      .then((data) => {
        // Sort by level priority: FIRST, then SECOND, then THIRD
        const sortedData = data.sort((a, b) => {
          const levelOrder = { 'FIRST': 1, 'SECOND': 2, 'THIRD': 3 };
          return levelOrder[a.level] - levelOrder[b.level];
        });
        
        setAllRestaurants(sortedData);
        setRestaurants(sortedData.slice(0, 10)); // Show first 10
        setVisibleCount(10);
        setHasMore(sortedData.length > 10);
      })
      .catch(() => {
        setAllRestaurants([]);
        setRestaurants([]);
        setHasMore(false);
      })
      .finally(() => setLoading(false));
  }, [category, selectedTypes, selectedLevels, selectedNeighborhood]);

  const loadMore = () => {
    if (!hasMore) return;
    
    const nextCount = Math.min(visibleCount + 10, allRestaurants.length);
    setVisibleCount(nextCount);
    setRestaurants(allRestaurants.slice(0, nextCount));
    setHasMore(nextCount < allRestaurants.length);
  };

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
      <h4 className={s.title}>{category}</h4>

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
          <>
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
                    <div className={s.cardHeader}>
                      <strong>{r.name}</strong>
                      <span className={`${s.levelBadge} ${s[`level${r.level}`]}`}>
                        {r.level}
                      </span>
                    </div>
                    
                    <div className={s.typeInfo}>
                      <span className={s.typeLabel}>{r.type.replace(/_/g, ' ')}</span>
                    </div>
                    
                    <div className={s.meta}>
                      <div className={s.metaItem}>
                        <span className={s.metaLabel}>Hechsher:</span>
                        <span className={s.metaText}>{r.hechsher || "N/A"}</span>
                      </div>
                      <div className={s.metaItem}>
                        <span className={s.metaLabel}>Address:</span>
                        <span className={s.metaText}>{r.address || "N/A"}</span>
                      </div>
                      <div className={s.metaItem}>
                        <span className={s.metaLabel}>Area:</span>
                        <span className={s.metaText}>{r.neighborhood || "N/A"}</span>
                      </div>
                      {r.city && (
                        <div className={s.metaItem}>
                          <span className={s.metaLabel}>City:</span>
                          <span className={s.metaText}>{r.city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Load more */}
            {restaurants.length > 0 && hasMore && (
              <div className={s.loadMoreWrap}>
                <button
                  className={s.loadMoreBtn}
                  onClick={loadMore}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
}
