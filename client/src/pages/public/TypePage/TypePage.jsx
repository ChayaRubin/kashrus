// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// import { Restaurants } from "../../../app/api.js";
// import s from "./TypePage.module.css";

// const TYPES_BY_CATEGORY = {
//   MEAT: ["FAST_FOOD", "SIT_DOWN"],
//   DAIRY: ["BAGELS", "SUSHI", "PIZZA", "FALAFEL", "ICE_CREAM", "SIT_DOWN"],
// };

// const LEVELS = ["FIRST", "SECOND", "THIRD"];

// export default function TypePage() {
//   const { category } = useParams();
//   const nav = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const options = TYPES_BY_CATEGORY[category] || [];

//   const [restaurants, setRestaurants] = useState([]);
//   const [selectedTypes, setSelectedTypes] = useState([]);
//   const [selectedLevels, setSelectedLevels] = useState([]);
//   const [loading, setLoading] = useState(false);

//   function toggle(arr, val) {
//     return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
//   }

//   const onToggleType = (t) => setSelectedTypes((prev) => toggle(prev, t));
//   const onToggleLevel = (l) => setSelectedLevels((prev) => toggle(prev, l));

//   // Initialize state from URL
//   useEffect(() => {
//     const typesParam = searchParams.get("types");
//     const levelsParam = searchParams.get("levels");
//     const initialTypes = typesParam ? typesParam.split(",").filter(Boolean) : [];
//     const initialLevels = levelsParam ? levelsParam.split(",").filter(Boolean) : [];
//     setSelectedTypes(
//       initialTypes.filter((t) => (TYPES_BY_CATEGORY[category] || []).includes(t))
//     );
//     setSelectedLevels(initialLevels.filter((l) => LEVELS.includes(l)));
//   }, [category]);

//   // Keep URL in sync
//   useEffect(() => {
//     const params = new URLSearchParams(searchParams);
//     if (selectedTypes.length > 0) params.set("types", selectedTypes.join(","));
//     else params.delete("types");
//     if (selectedLevels.length > 0) params.set("levels", selectedLevels.join(","));
//     else params.delete("levels");
//     setSearchParams(params, { replace: true });
//   }, [selectedTypes, selectedLevels, setSearchParams]);

//   useEffect(() => {
//     if (selectedTypes.length === 0 && selectedLevels.length === 0) {
//       setRestaurants([]);
//       return;
//     }
//     setLoading(true);
//     Restaurants.list({ category, types: selectedTypes, levels: selectedLevels })
//       .then(setRestaurants)
//       .catch(() => setRestaurants([]))
//       .finally(() => setLoading(false));
//   }, [category, selectedTypes, selectedLevels]);

//   return (
//     <div className={s.wrap}>
//       <div className={s.back}>
//         <button onClick={() => nav("/browse")} className={s.backbutton}>
//           ⬅ Back to Categories
//         </button>
//       </div>

//       <h2 className={s.title}>{category} — choose types</h2>

//       {/* TYPES */}
//       <div className={s.section}>
//         <h3 className={s.subtitle}>Types</h3>
//         <div className={s.grid}>
//           {options.map((t) => {
//             const active = selectedTypes.includes(t);
//             return (
//               <button
//                 key={t}
//                 onClick={() => onToggleType(t)}
//                 className={`${s.card} ${active ? s.cardActive : ""}`}
//               >
//                 {t.replaceAll("_", " ")}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* LEVELS */}
//       <div className={s.section}>
//         <h3 className={s.subtitle}>Levels</h3>
//         <div className={s.levels}>
//           {LEVELS.map((l) => (
//             <label key={l} className={s.levelLabel}>
//               <input
//                 type="checkbox"
//                 checked={selectedLevels.includes(l)}
//                 onChange={() => onToggleLevel(l)}
//               />
//               {l}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* RESULTS */}
//       <div className={s.section}>
//         {loading ? (
//           <p>Loading…</p>
//         ) : restaurants.length > 0 ? (
//           <ul className={s.results}>
//             {restaurants.map((r) => (
//               <li
//                 key={r.id}
//                 onClick={() =>
//                   nav(`/restaurant/${r.id}`, {
//                     state: {
//                       from: `/browse/${category}?types=${selectedTypes.join(",")}&levels=${selectedLevels.join(",")}`,
//                     },
//                   })
//                 }
//                 className={s.resultItem}
//               >
//                 <div className={s.resultContent}>
//                   <strong>{r.name}</strong> — {r.type} ({r.level})
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No restaurants found.</p>
//         )}
//       </div>
//     </div>
//   );
// }
// src/pages/public/TypePage/TypePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const options = TYPES_BY_CATEGORY[category] || [];

  const [restaurants, setRestaurants] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
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
    const initialTypes = typesParam ? typesParam.split(",").filter(Boolean) : [];
    const initialLevels = levelsParam ? levelsParam.split(",").filter(Boolean) : [];
    setSelectedTypes(initialTypes.filter((t) => (TYPES_BY_CATEGORY[category] || []).includes(t)));
    setSelectedLevels(initialLevels.filter((l) => LEVELS.includes(l)));
  }, [category]);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedTypes.length > 0) params.set("types", selectedTypes.join(","));
    else params.delete("types");
    if (selectedLevels.length > 0) params.set("levels", selectedLevels.join(","));
    else params.delete("levels");
    setSearchParams(params, { replace: true });
  }, [selectedTypes, selectedLevels, setSearchParams]);

  // Fetch restaurants
  useEffect(() => {
    if (selectedTypes.length === 0 && selectedLevels.length === 0) {
      setRestaurants([]);
      return;
    }
    setLoading(true);
    Restaurants.list({ category, types: selectedTypes, levels: selectedLevels })
      .then(setRestaurants)
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, [category, selectedTypes, selectedLevels]);

  return (
    <div className={s.wrap}>
      <div className={s.back}>
        <button onClick={() => nav("/browse")} className={s.backbutton}>
          ⬅ Back to Categories
        </button>
      </div>

      <h2 className={s.title}>{category} — choose types</h2>

      {/* TYPES */}
      <div className={s.section}>
        {/* <h3 className={s.subtitle}>Types</h3> */}
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

      {/* LEVELS */}
      <div className={s.section}>
        <h3 className={s.subtitle}>Levels</h3>
        <div className={s.levels}>
          {LEVELS.map((l) => (
            <label key={l} className={s.levelLabel}>
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
                      from: `/browse/${category}?types=${selectedTypes.join(",")}&levels=${selectedLevels.join(",")}`,
                    },
                  })
                }
                className={s.resultItem}
              >
                <div className={s.resultContent}>
                  <strong>{r.name}</strong> — {r.type} ({r.level})
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
