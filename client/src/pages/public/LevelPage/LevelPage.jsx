import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Restaurants } from '../../../app/api.js';
import RestaurantCard from '../../../components/RestaurantCard/RestaurantCard.jsx';

export default function LevelPage() {
  const { level } = useParams(); // FIRST | SECOND | THIRD
  const [items, setItems] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    Restaurants.list(level).then(setItems).catch(console.error);
  }, [level]);

  if (!items) return <p>Loading…</p>;
  if (!items.length) return <p>No restaurants in this level yet.</p>;

  return (
    <>
      <h2 style={{ marginTop:0 }}>{level} level</h2>
      <ul style={{ listStyle:'none', padding:0, display:'grid', gap:12 }}>
        {items.map((r) => (
          <RestaurantCard key={r.id} r={r} onDoubleClick={() => nav(`/restaurant/${r.id}`)} />
        ))}
      </ul>
    </>
  );
}
