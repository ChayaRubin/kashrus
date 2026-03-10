import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Restaurants } from "../../../app/api.js";
import { useLevels } from "../../../components/LevelsContext/LevelsContext.jsx";
import s from "./LevelPage.module.css";

export default function LevelPage() {
  const { category, type } = useParams();
  const lv = useLevels();
  const nav = useNavigate();
  const location = useLocation();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await Restaurants.list({
          category,
          type,
          levels: [...lv.selected],
        });
        setRestaurants(data);
      } catch {
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [category, type, lv.selected]);

  if (loading) return <p className={s.info}>Loading…</p>;
  if (restaurants.length === 0) return <p className={s.info}>No restaurants found.</p>;

  return (
    <div className={s.wrap}>
      <div className={s.back}>
        <button
          onClick={() => nav(`/browse/${category}`)}
          className={s.backbutton}
        >
          ⬅ Back to {category}
        </button>
      </div>

      <h2 className={s.title}>{category} • {type}</h2>

      <div className={s.grid}>
        {restaurants.map((r) => (
          <div
            key={r.id}
            className={s.card}
            onClick={() =>
              nav(`/restaurant/${r.id}`, {
                state: { from: `/browse/${category}` },
              })
            }
          >
            {r.images?.[0] && <img src={r.images[0]} alt={r.name} className={s.thumb} />}
            <div className={s.details}>
              <span className={s.name}>{r.name}</span>
              <div className={s.meta}>{r.city} • {r.hechsher}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
