import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slideshow from '../../../components/Slideshow/Slideshow.jsx';
import CategoryPage from '../CategoryPage/CategoryPage.jsx';
import ContactSection from '../../../components/ContactSection/ContactSection.jsx';
import { Restaurants } from '../../../app/api.js';
import s from '../Home/Home.module.css'; // Assuming you have a CSS module for styles

const slides = ['/images/food1.jpg', '/images/food2.jpg', '/images/food3.jpg'];

export default function Home() {
  const nav = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (window.location.hash === '#contact') {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const data = await Restaurants.search(query.trim());
        setResults(data.slice(0, 8));
        setOpen(true);
      } catch (e) {
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const goToRestaurant = (id) => {
    setOpen(false);
    setQuery('');
    nav(`/restaurant/${id}`);
  };

  return (
    <div className={s.wrap}>
      <Slideshow images={slides} />

      <div style={{ display:'flex', justifyContent:'center', margin:'20px 0', position:'relative' }} ref={boxRef}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a restaurant..."
          style={{
            width:'min(720px, 92%)', padding:'14px 16px', borderRadius:12,
            border:'1px solid #ddd', boxShadow:'0 2px 8px rgba(0,0,0,0.04)'
          }}
        />
        {open && results.length > 0 && (
          <div style={{
            position:'absolute', top:'100%', marginTop:6, width:'min(720px, 92%)',
            background:'#fff', border:'1px solid #eee', borderRadius:12,
            boxShadow:'0 8px 24px rgba(0,0,0,0.08)', zIndex:20, overflow:'hidden'
          }}>
            {results.map(r => (
              <button
                key={r.id}
                onClick={() => goToRestaurant(r.id)}
                style={{
                  display:'flex', width:'100%', textAlign:'left', gap:12,
                  padding:'10px 12px', border:'none', background:'#fff', cursor:'pointer'
                }}
              >
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600 }}>{r.name}</div>
                  <div style={{ fontSize:12, color:'#666' }}>
                    {[r.city, r.address, r.hechsher].filter(Boolean).join(' • ')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        {open && !loading && results.length === 0 && (
          <div style={{
            position:'absolute', top:'100%', marginTop:6, width:'min(720px, 92%)',
            background:'#fff', border:'1px solid #eee', borderRadius:12,
            boxShadow:'0 8px 24px rgba(0,0,0,0.08)', zIndex:20, overflow:'hidden',
            padding:'12px 14px', color:'#666'
          }}>
            No results found
          </div>
        )}
      </div>

      <CategoryPage /> {/* ← just Meat + Dairy */}
      <ContactSection />
    </div>
  );
}
