import React, { useEffect, useMemo, useState } from 'react';
import { Restaurants } from '../../../app/api.js';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './RestaurantForm.module.css';

const CATEGORIES = ['MEAT', 'DAIRY'];
const TYPES_BY_CATEGORY = {
  MEAT: ['FAST_FOOD', 'SIT_DOWN'],
  DAIRY: ['BAGELS', 'SUSHI', 'PIZZA', 'FALAFEL', 'ICE_CREAM', 'SIT_DOWN'],
};
const LEVELS = ['FIRST', 'SECOND', 'THIRD'];

export default function RestaurantForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const editing = id && id !== 'new';

  const [f, setF] = useState({
    name: '',
    category: 'MEAT',
    type: 'FAST_FOOD',
    level: 'FIRST',
    city: '',
    address: '',
    phone: '',
    hechsher: '',
    images: [],
    website: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const typeOptions = useMemo(
    () => TYPES_BY_CATEGORY[f.category] || [],
    [f.category]
  );

  useEffect(() => {
    if (!editing) return;
    let ignore = false;

    async function load() {
      try {
        const r = await Restaurants.get(Number(id));
        if (ignore) return;
        setF({
          name: r.name || '',
          category: r.category || 'MEAT',
          type: r.type || 'FAST_FOOD',
          level: r.level || 'FIRST',
          city: r.city || '',
          address: r.address || '',
          phone: r.phone || '',
          hechsher: r.hechsher || '',
          images: Array.isArray(r.images) ? r.images : (r.images ? [r.images] : []),
          website: r.website || '',
        });
      } catch (e) {
        console.error(e);
        setError('Failed to load restaurant.');
      }
    }
    load();
    return () => { ignore = true; };
  }, [editing, id]);

  function setField(key, val) {
    setF((s) => ({ ...s, [key]: val }));
  }

  function setImagesFromTextarea(value) {
    const arr = value.split('\n').map((s) => s.trim()).filter(Boolean);
    setField('images', arr);
  }

  async function submit(e) {
    e.preventDefault();
    setError('');

    const payload = {
      name: f.name.trim(),
      category: f.category,
      type: f.type,
      level: f.level,
      city: f.city || null,
      address: f.address || null,
      phone: f.phone || null,
      hechsher: f.hechsher || null,
      images: f.images.length ? JSON.stringify(f.images) : null,
      website: f.website || null,
    };

    try {
      setSaving(true);
      if (editing) {
        await Restaurants.update(Number(id), payload);
      } else {
        await Restaurants.create(payload);
      }
      nav('/admin/restaurants');
    } catch (e) {
      console.error(e);
      setError('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{editing ? 'Edit' : 'New'} Restaurant</h3>

      {error && editing && <div className={styles.errorBox}>{error}</div>}

      <form onSubmit={submit} className={styles.form}>
        <div className={styles.row}>
          <label className={styles.label}>Name</label>
          <input className={styles.input} value={f.name} onChange={(e) => setField('name', e.target.value)} required />
        </div>

        <div className={styles.grid2}>
          <div className={styles.row}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={f.category} onChange={(e) => setField('category', e.target.value)} required>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className={styles.row}>
            <label className={styles.label}>Type</label>
            <select className={styles.select} value={f.type} onChange={(e) => setField('type', e.target.value)} required>
              {typeOptions.map((t) => <option key={t} value={t}>{t.replaceAll('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={styles.row}>
            <label className={styles.label}>Level</label>
            <select className={styles.select} value={f.level} onChange={(e) => setField('level', e.target.value)}>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Hechsher</label>
            <input className={styles.input} value={f.hechsher} onChange={(e) => setField('hechsher', e.target.value)} />
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={styles.row}>
            <label className={styles.label}>City</label>
            <input className={styles.input} value={f.city} onChange={(e) => setField('city', e.target.value)} />
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Phone</label>
            <input className={styles.input} value={f.phone} onChange={(e) => setField('phone', e.target.value)} />
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Address</label>
          <input className={styles.input} value={f.address} onChange={(e) => setField('address', e.target.value)} />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Website</label>
          <input className={styles.input} value={f.website} onChange={(e) => setField('website', e.target.value)} placeholder="https://…" />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Images (one URL per line)</label>
          <textarea
            className={styles.textarea}
            value={f.images.join('\n')}
            onChange={(e) => setImagesFromTextarea(e.target.value)}
            placeholder={`/images/food1.jpg\nhttps://…`}
          />
          {!!f.images.length && (
            <div className={styles.imagesPreview}>
              {f.images.map((src, i) => (
                <img key={i} src={src} alt={`preview ${i+1}`} />
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
            {saving ? 'Saving…' : editing ? 'Save' : 'Create'}
          </button>
          <button type="button" onClick={() => nav(-1)} disabled={saving} className={`${styles.btn} ${styles.btnSecondary}`}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
