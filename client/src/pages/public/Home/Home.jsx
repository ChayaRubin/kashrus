import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slideshow from '../../../components/Slideshow/Slideshow.jsx';

const slides = ['/images/food1.jpg', '/images/food2.jpg', '/images/food3.jpg'];

export default function Home() {
  const nav = useNavigate();
  const btn = { padding:'24px 12px', borderRadius:14, border:'1px solid #e6e6e6', background:'#fff', fontSize:18, cursor:'pointer' };

  return (
    <div style={{ display:'grid', gap:24 }}>
      <Slideshow images={slides} />
      <div style={{ display:'grid', gap:16, gridTemplateColumns:'repeat(3, minmax(0,1fr))' }}>
        <button style={btn} onClick={() => nav('/level/FIRST')}>First level</button>
        <button style={btn} onClick={() => nav('/level/SECOND')}>Second level</button>
        <button style={btn} onClick={() => nav('/level/THIRD')}>Third level</button>
      </div>
    </div>
  );
}
