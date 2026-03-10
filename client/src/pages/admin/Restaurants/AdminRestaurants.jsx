import React, { useEffect, useState } from 'react';
import { Restaurants } from '../../../app/api.js';
import { useNavigate } from 'react-router-dom';
import styles from './AdminRestaurants.module.css';

export default function AdminRestaurants() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const list = await Restaurants.listAll();
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
    <div className={styles.container}>
      <div className={styles.head}>
        <h1>Restaurants</h1>
        <button
          className={styles.btnPrimary}
          onClick={() => nav('/admin/restaurants/new')}
        >
          + New
        </button>
      </div>

      {!items?.length ? (
        <p>No restaurants yet.</p>
      ) : (
        <div className={styles.cards}>
          {items.map((r) => (
            <div key={r.id} className={styles.card}>
              {/* optional: show logo/thumbnail if r.images */}
              {r.images?.length > 0 && (
                <img
                  src={Array.isArray(r.images) ? r.images[0] : r.images}
                  alt={r.name}
                  className={styles.logo}
                />
              )}

              <div className={styles.cardHeader}>
                <h3>{r.name}</h3>
              </div>
              <div className={styles.desc}>
                <p><strong>Level:</strong> {r.level}</p>
                <p><strong>City:</strong> {r.city || '—'}</p>
                <p><strong>Hechsher:</strong> {r.hechsher || '—'}</p>
              </div>
              <div className={styles.cardActions}>
                <button
                  className={styles.btn}
                  onClick={() => nav(`/admin/restaurants/${r.id}`)}
                >
                  Edit
                </button>
                <button
                  className={styles.btnDanger}
                  onClick={() => remove(r.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
