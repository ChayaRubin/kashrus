import React from 'react';

export default function RestaurantCard({ r, onDoubleClick }) {
  return (
    <li
      onDoubleClick={onDoubleClick}
      style={{
        display:'grid', gridTemplateColumns:'120px 1fr', gap:16, alignItems:'center',
        border:'1px solid #eee', borderRadius:12, padding:12, cursor:'default'
      }}
      title="Double click to view details"
    >
      <img src={r.images?.[0] ?? '/images/placeholder.jpg'} alt={r.name}
           style={{ width:120, height:80, objectFit:'cover', borderRadius:10 }} />
      <div>
        <div style={{ fontWeight:600 }}>{r.name}</div>
        <div style={{ color:'#666', fontSize:14 }}>{r.city ? `${r.city} • ` : ''}{r.hechsher || '—'}</div>
        <div style={{ fontSize:12, color:'#999' }}>(Double‑click to open details)</div>
      </div>
    </li>
  );
}
