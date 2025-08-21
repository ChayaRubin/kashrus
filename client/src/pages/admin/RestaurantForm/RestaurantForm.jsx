// src/pages/admin/RestaurantForm/RestaurantForm.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Restaurants } from '../../../app/api.js';
import { useNavigate, useParams } from 'react-router-dom';

const CATEGORIES = ['MEAT', 'DAIRY'];
const TYPES_BY_CATEGORY = {
  MEAT:  ['FAST_FOOD', 'SIT_DOWN'],
  DAIRY: ['BAGELS', 'SUSHI', 'PIZZA', 'FALAFEL', 'ICE_CREAM', 'SIT_DOWN'],
};
const LEVELS = ['FIRST','SECOND','THIRD'];

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
          // description: r.description || '',
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

  const input = { padding: '10px 12px', borderRadius: 10, border: '1px solid #e6e6e6' };
  const row = { display: 'grid', gap: 8 };
  const grid2 = { display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 14, maxWidth: 760 }}>
      <h3>{editing ? 'Edit' : 'New'} Restaurant</h3>

      {error && editing && (
        <div style={{ padding: 10, borderRadius: 10, background: '#fff3f3', color: '#b30000' }}>
          {error}
        </div>
      )}

      <div style={row}>
        <label>Name</label>
        <input style={input} value={f.name} onChange={(e) => setField('name', e.target.value)} required />
      </div>

      <div style={grid2}>
        <div style={row}>
          <label>Category</label>
          <select style={input} value={f.category} onChange={(e) => setField('category', e.target.value)} required>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={row}>
          <label>Type</label>
          <select style={input} value={f.type} onChange={(e) => setField('type', e.target.value)} required>
            {typeOptions.map((t) => <option key={t} value={t}>{t.replaceAll('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      <div style={grid2}>
        <div style={row}>
          <label>Level</label>
          <select style={input} value={f.level} onChange={(e) => setField('level', e.target.value)}>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div style={row}>
          <label>Hechsher</label>
          <input style={input} value={f.hechsher} onChange={(e) => setField('hechsher', e.target.value)} />
        </div>
      </div>

      <div style={grid2}>
        <div style={row}>
          <label>City</label>
          <input style={input} value={f.city} onChange={(e) => setField('city', e.target.value)} />
        </div>
        <div style={row}>
          <label>Phone</label>
          <input style={input} value={f.phone} onChange={(e) => setField('phone', e.target.value)} />
        </div>
      </div>

      <div style={row}>
        <label>Address</label>
        <input style={input} value={f.address} onChange={(e) => setField('address', e.target.value)} />
      </div>

      <div style={row}>
        <label>Website</label>
        <input
          style={input}
          value={f.website}
          onChange={(e) => setField('website', e.target.value)}
          placeholder="https://…"
        />
      </div>
{/* 
      <div style={row}>
        <label>Description</label>
        <textarea
          style={{ ...input, minHeight: 120 }}
          value={f.description}
          onChange={(e) => setField('description', e.target.value)}
          placeholder="Short info, hashgacha details, specialties…"
        />
      </div> */}

      <div style={row}>
        <label>Images (one URL per line)</label>
        <textarea
          style={{ ...input, minHeight: 100, fontFamily: 'monospace' }}
          value={f.images.join('\n')}
          onChange={(e) => setImagesFromTextarea(e.target.value)}
          placeholder={`/images/food1.jpg\nhttps://…`}
        />
        {!!f.images.length && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))',
            gap: 10, marginTop: 6
          }}>
            {f.images.map((src, i) => (
              <img key={i} src={src} alt={`preview ${i+1}`} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 10 }} />
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save' : 'Create'}
        </button>
        <button type="button" onClick={() => nav(-1)} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
