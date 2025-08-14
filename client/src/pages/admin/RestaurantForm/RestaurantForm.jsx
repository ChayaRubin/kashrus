import React, { useEffect, useState } from 'react';
import { Restaurants } from '../../../app/api.js';
import { useNavigate, useParams } from 'react-router-dom';

const LEVELS = ['FIRST','SECOND','THIRD'];

export default function RestaurantForm() {
  const { id } = useParams(); // "new" or number
  const nav = useNavigate();
  const editing = id !== 'new';

  const [f, setF] = useState({
    name:'', level:'FIRST', city:'', address:'', phone:'', hechsher:'', description:'', images:[], website:''
  });

  useEffect(() => {
    if (editing) Restaurants.get(id).then((r) => setF({ ...r, images:(r.images||[]) }));
  }, [id, editing]);

  function setField(key, val) { setF((s) => ({ ...s, [key]: val })); }

  async function submit(e) {
    e.preventDefault();
    const payload = { ...f, images: (Array.isArray(f.images) ? f.images : []) };
    if (editing) await Restaurants.update(Number(id), payload);
    else await Restaurants.create(payload);
    nav('/admin/restaurants');
  }

  return (
    <form onSubmit={submit} style={{ display:'grid', gap:12, maxWidth:640 }}>
      <h3 style={{ margin:0 }}>{editing ? 'Edit' : 'New'} Restaurant</h3>

      <input value={f.name} onChange={e=>setField('name', e.target.value)} placeholder="Name" required />

      <select value={f.level} onChange={e=>setField('level', e.target.value)}>
        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
      </select>

      <input value={f.city} onChange={e=>setField('city', e.target.value)} placeholder="City" />
      <input value={f.address} onChange={e=>setField('address', e.target.value)} placeholder="Address" />
      <input value={f.phone} onChange={e=>setField('phone', e.target.value)} placeholder="Phone" />
      <input value={f.hechsher} onChange={e=>setField('hechsher', e.target.value)} placeholder="Hechsher" />
      <input value={f.website} onChange={e=>setField('website', e.target.value)} placeholder="https://…" />

      <textarea value={f.description} onChange={e=>setField('description', e.target.value)} rows={5} placeholder="Description" />

      {/* images as comma-separated URLs */}
      <textarea
        value={f.images.join('\n')}
        onChange={e=>setField('images', e.target.value.split('\n').map(s=>s.trim()).filter(Boolean))}
        rows={4}
        placeholder={"/images/food1.jpg\n/images/food2.jpg"}
      />

      <div style={{ display:'flex', gap:8 }}>
        <button type="submit">{editing ? 'Save' : 'Create'}</button>
        <button type="button" onClick={() => nav(-1)}>Cancel</button>
      </div>
    </form>
  );
}
