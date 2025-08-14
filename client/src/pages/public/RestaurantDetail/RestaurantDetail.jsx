import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Restaurants } from '../../../app/api.js';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [r, setR] = useState(null);

  useEffect(() => { Restaurants.get(id).then(setR); }, [id]);
  if (!r) return <p>Loading…</p>;

  return (
    <div style={{ display:'grid', gap:16 }}>
      <h2 style={{ margin:0 }}>{r.name}</h2>
      <div style={{ color:'#666' }}>
        Level: {r.level} {r.hechsher ? `• ${r.hechsher}` : ''} {r.city ? `• ${r.city}` : ''}
      </div>

      {r.images?.length ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px,1fr))', gap:10 }}>
          {r.images.map((src, i) => (
            <img key={i} src={src} alt={`Photo ${i+1}`} style={{ width:'100%', height:120, objectFit:'cover', borderRadius:12 }} />
          ))}
        </div>
      ) : null}

      {r.description && <p style={{ whiteSpace:'pre-wrap' }}>{r.description}</p>}

      <div style={{ display:'grid', gap:6 }}>
        {r.address && <div><strong>Address:</strong> {r.address}</div>}
        {r.phone && <div><strong>Phone:</strong> {r.phone}</div>}
        {r.website && <div><a href={r.website} target="_blank" rel="noreferrer">Website</a></div>}
      </div>
    </div>
  );
}
