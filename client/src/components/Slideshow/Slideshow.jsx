import React, { useEffect, useState } from 'react';

export default function Slideshow({ images, height = 360, interval = 3000 }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!images?.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images, interval]);

  if (!images?.length) return null;
  const src = images[idx];

  return (
    <div style={{ width:'100%', height, overflow:'hidden', borderRadius:16, boxShadow:'0 2px 16px rgba(0,0,0,0.08)' }}>
      <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
    </div>
  );
}
