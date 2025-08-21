import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Restaurants } from "../../../app/api.js";
import { useLevels } from "../../../components/LevelsContext/LevelsContext.jsx";

export default function LevelPage() {
  const { category, type } = useParams(); // e.g. /restaurants/MEAT/SIT_DOWN
  const lv = useLevels();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await Restaurants.list({
          category,
          type,
          levels: [...lv.selected], // 👈 pass selected levels!
        });
        setRestaurants(data);
      } catch (err) {
        console.error("Failed to load restaurants", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [category, type, lv.selected]); // 👈 refetch when filters change

  if (loading) return <p>Loading…</p>;

  if (restaurants.length === 0) {
    return <p>No restaurants found for this filter.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {category} • {type}
      </h2>

      <div className="grid gap-3">
        {restaurants.map((r) => (
          <div
            key={r.id}
            className="border rounded-lg p-3 shadow-sm bg-white cursor-pointer"
            onDoubleClick={() => (window.location.href = `/restaurant/${r.id}`)}
          >
            {r.images && r.images.length > 0 && (
              <img
                src={r.images[0]}
                alt={r.name}
                className="w-16 h-16 object-cover rounded inline-block mr-2"
              />
            )}
            <span className="font-semibold">{r.name}</span>
            <div className="text-sm text-gray-600">
              {r.city} • {r.hechsher}
            </div>
            <div className="text-xs text-gray-500">
              (Double-click to open details)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
