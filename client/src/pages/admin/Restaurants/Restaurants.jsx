import React, { useEffect, useState } from 'react';
import { Restaurants } from '../../../app/api.js';
import { useNavigate } from 'react-router-dom';

const ALL_LEVELS = ['FIRST', 'SECOND', 'THIRD'];
const ALL_TYPES = [
  'MEAT',
  'DAIRY',
  'FAST_FOOD',
  'SIT_DOWN',
  'BAGELS',
  'SUSHI',
  'PIZZA',
  'FALAFEL',
  'ICE_CREAM',
];

export default function AdminRestaurants() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

async function load() {
  setLoading(true);
  try {
    const list = await Restaurants.listAll(); // ✅ new API
    setItems(list);
  } finally {
    setLoading(false);
  }
}


  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm('Delete this restaurant?')) return;
    await Restaurants.remove(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
        <h3 style={{ margin:0 }}>Restaurants</h3>
        <button onClick={() => nav('/admin/restaurants/new')}>New</button>
      </div>
      {!items?.length ? <p>No restaurants yet.</p> : (
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th align="left">Name</th>
              <th>Level</th>
              <th>City</th>
              <th>Hechsher</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(r => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td align="center">{r.level}</td>
                <td align="center">{r.city || '—'}</td>
                <td align="center">{r.hechsher || '—'}</td>
                <td align="right">
                  <button onClick={() => nav(`/admin/restaurants/${r.id}`)}>Edit</button>{' '}
                  <button onClick={() => remove(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
