import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Restaurants, Hechsheirim } from "../../../app/api.js";
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
  const [selectedLevels, setSelectedLevels] = useState([]); // stores EXTRA levels beyond FIRST
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [hechsheirim, setHechsheirim] = useState([]);
  const [query, setQuery] = useState("");
  const [showHechsheirimPopup, setShowHechsheirimPopup] = useState(false);

  function toggle(arr, val) {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  const onToggleType = (t) => setSelectedTypes((prev) => toggle(prev, t));
  const onToggleLevel = (l) =>
    setSelectedLevels((prev) => {
      if (l === "FIRST") {
        // FIRST is always included; clicking it does nothing
        return prev;
      }
      return toggle(prev, l);
    });

  // Initialize state from URL (runs on mount and whenever the query string changes)
  useEffect(() => {
    const typesParam = searchParams.get("types");
    const levelsParam = searchParams.get("levels");
    const neighborhoodParam = searchParams.get("neighborhood");

    const initialTypes = typesParam
      ? typesParam.split(",").filter(Boolean)
      : [];
    const initialTypesFiltered = initialTypes.filter((t) =>
      (TYPES_BY_CATEGORY[category] || []).includes(t)
    );

    setSelectedTypes(initialTypesFiltered);
    // selectedLevels holds EXTRA levels beyond FIRST.
    // Restore from URL so going back keeps SECOND/THIRD selection.
    if (levelsParam) {
      const fromUrl = levelsParam.split(",").filter(Boolean);
      const extra = fromUrl.filter(
        (l) => l !== "FIRST" && LEVELS.includes(l)
      );
      setSelectedLevels(extra);
    } else {
      setSelectedLevels([]);
    }
    setSelectedNeighborhood(neighborhoodParam || "");
    
    // Reset pagination when filters change
    setVisibleCount(10);
    setAllRestaurants([]);
    setRestaurants([]);
    setHasMore(true);
  }, [category, searchParams]);

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

  // Fetch hechsheirim
  useEffect(() => {
    Hechsheirim.list({ page: 1, pageSize: 100 })
      .then((res) => {
        // Normalize description → level
        const items = (res.items || []).map((h) => ({
          ...h,
          level: h.description ? h.description.toUpperCase() : "OTHER",
        }));
        setHechsheirim(items);
      })
      .catch(console.error);
  }, []);

  // Fetch restaurants whenever filters change
  useEffect(() => {
    setLoading(true);
    // FIRST tier is always included.
    // If SECOND is selected → show FIRST + SECOND.
    // If THIRD is selected → show FIRST + SECOND + THIRD.
    const extraLevels = selectedLevels.filter((l) => l !== "FIRST");
    const levelSet = new Set(["FIRST"]);
    extraLevels.forEach((lvl) => {
      if (lvl === "SECOND") {
        levelSet.add("SECOND");
      } else if (lvl === "THIRD") {
        levelSet.add("SECOND");
        levelSet.add("THIRD");
      }
    });
    const effectiveLevels = ["FIRST", "SECOND", "THIRD"].filter((l) =>
      levelSet.has(l)
    );

    Restaurants.list({
      category,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      // send effective levels to backend too
      levels: effectiveLevels,
      neighborhood: selectedNeighborhood || undefined,
    })
      .then((data) => {
        // 1) Filter by effective levels
        let filtered = data.filter((r) => effectiveLevels.includes(r.level));

        // 2) Also filter by selected types on the client (safety)
        if (selectedTypes.length > 0) {
          filtered = filtered.filter((r) => selectedTypes.includes(r.type));
        }

        // 3) Also filter by neighborhood on the client (safety)
        if (selectedNeighborhood) {
          filtered = filtered.filter(
            (r) => r.neighborhood === selectedNeighborhood
          );
        }

        // Sort by level priority: FIRST, then SECOND, then THIRD
        const sortedData = filtered.sort((a, b) => {
          const levelOrder = { FIRST: 1, SECOND: 2, THIRD: 3 };
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
  }, [category, selectedTypes, selectedLevels, selectedNeighborhood, searchParams]);

  const loadMore = () => {
    if (!hasMore) return;
    
    const nextCount = Math.min(visibleCount + 10, allRestaurants.length);
    setVisibleCount(nextCount);
    setRestaurants(allRestaurants.slice(0, nextCount));
    setHasMore(nextCount < allRestaurants.length);
  };

  // Group hechsheirim by tier (in order: FIRST, SECOND, THIRD)
  const groupedHechsheirim = LEVELS.map((lvl) => ({
    level: lvl,
    items: hechsheirim.filter((h) => h.level === lvl),
  }));
  const otherHechsheirim = hechsheirim.filter((h) => !LEVELS.includes(h.level));

  // Filter restaurants by search query (name + address + hechsher)
  const lowerQuery = query.trim().toLowerCase();
  const visibleRestaurants = lowerQuery
    ? restaurants.filter((r) =>
        [
          r.name,
          r.address,
          r.hechsher,
          r.neighborhood,
          r.city,
          r.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(lowerQuery)
      )
    : restaurants;

  return (
    <div className={s.wrap}>
      <div className={s.back}>
        <button onClick={() => nav("/")} className={s.backbutton}>
          ⬅ Back to Home
        </button>
      </div>

      <div className={s.categoryTitleContainer}>
        <h4 className={s.categoryTitle}>{category}</h4>
      </div>
      
      <div className={s.hechsheirimButtonContainer}>
        <button 
          onClick={() => setShowHechsheirimPopup(true)} 
          className={s.hechsheirimButton}
        >
          Hechsheirim symbols...
        </button>
      </div>
      
      {/* Mobile Popup Overlay */}
      {showHechsheirimPopup && (
        <div 
          className={s.popupOverlay}
          onClick={() => setShowHechsheirimPopup(false)}
        >
          <div 
            className={s.hechsheirimPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={s.popupHeader}>
              <h3 className={s.sidebarTitle}>Hechsheirim</h3>
              <button 
                onClick={() => setShowHechsheirimPopup(false)}
                className={s.closeButton}
              >
                ×
              </button>
            </div>
            <div className={s.hechsheirimList}>
              {groupedHechsheirim.map(({ level, items }) =>
                items.length > 0 ? (
                  <div key={level} className={s.tierSection}>
                    <h4 className={s.tierTitle}>{level}</h4>
                    {items.map((h) => (
                      <div key={h.id} className={s.hechsherItem}>
                        {h.symbolUrl && (
                          <img
                            src={h.symbolUrl}
                            alt={h.name}
                            className={s.hechsherLogo}
                          />
                        )}
                        <span className={s.hechsherName}>{h.name}</span>
                      </div>
                    ))}
                  </div>
                ) : null
              )}
              {otherHechsheirim.length > 0 && (
                <div className={s.tierSection}>
                  <h4 className={s.tierTitle}>Other</h4>
                  {otherHechsheirim.map((h) => (
                    <div key={h.id} className={s.hechsherItem}>
                      {h.symbolUrl && (
                        <img
                          src={h.symbolUrl}
                          alt={h.name}
                          className={s.hechsherLogo}
                        />
                      )}
                      <span className={s.hechsherName}>{h.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className={s.mainLayout}>
        {/* Hechsheirim Sidebar */}
        <div className={s.hechsheirimSidebar}>
          <h3 className={s.sidebarTitle}>Hechsheirim</h3>
          <div className={s.hechsheirimList}>
            {groupedHechsheirim.map(({ level, items }) =>
              items.length > 0 ? (
                <div key={level} className={s.tierSection}>
                  <h4 className={s.tierTitle}>{level}</h4>
                  {items.map((h) => (
                    <div key={h.id} className={s.hechsherItem}>
                      {h.symbolUrl && (
                        <img
                          src={h.symbolUrl}
                          alt={h.name}
                          className={s.hechsherLogo}
                        />
                      )}
                      <span className={s.hechsherName}>{h.name}</span>
                    </div>
                  ))}
                </div>
              ) : null
            )}
            {otherHechsheirim.length > 0 && (
              <div className={s.tierSection}>
                <h4 className={s.tierTitle}>Other</h4>
                {otherHechsheirim.map((h) => (
                  <div key={h.id} className={s.hechsherItem}>
                    {h.symbolUrl && (
                      <img
                        src={h.symbolUrl}
                        alt={h.name}
                        className={s.hechsherLogo}
                      />
                    )}
                    <span className={s.hechsherName}>{h.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className={s.mainContent}>
          <div className={s.categoryTitleDesktop}>
            <h4 className={s.categoryTitle}>{category}</h4>
          </div>

          {/* Filters Row - All three filters side by side on large screens */}
          <div className={s.filtersRow}>
<div className={s.section}>
              <p className={s.filterHint}>Select one or more tiers</p>
  <div className={s.levels}>
    {LEVELS.map((l) => {
      const checked =
        l === "FIRST" ? true : selectedLevels.includes(l);
      return (
        <label
          key={l}
          className={`${s.levelLabel} ${s[`levelLabel${l}`]}`}
        >
          {l} TIER
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggleLevel(l)}
          />
        </label>
      );
    })}
  </div>
</div>
      {/* TYPES */}
      <div className={s.section}>
              <p className={s.filterHint}>Select one or more types</p>
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
              <p className={s.filterHint}>Filter restaurants by neighborhood</p>
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
      </div>

      {/* RESULTS */}
      <div className={s.section}>
        <div className={s.searchRow}>
          <input
            className={s.searchInput}
            type="text"
            placeholder="Search by name, area, or hechsher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <p>Loading…</p>
        ) : visibleRestaurants.length > 0 ? (
          <>
            <ul className={s.results}>
              {visibleRestaurants.map((r) => (
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
          <div className={s.emptyState}>
            <p className={s.emptyMessage}>No restaurants found.</p>
            <p className={s.emptyHint}>
              Try adjusting your filters or selecting different options to see more results.
            </p>
            {(selectedTypes.length > 0 || selectedLevels.length > 0 || selectedNeighborhood) && (
              <button
                className={s.clearFiltersBtn}
                onClick={() => {
                  setSelectedTypes([]);
                  setSelectedLevels([]);
                  setSelectedNeighborhood("");
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
        </div>
      </div>

      {/* Back-to-top arrow */}
      <button
        className={s.scrollTopButton}
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ^
      </button>
    </div>
  );
}
