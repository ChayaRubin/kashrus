import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slideshow from '../../../components/Slideshow/Slideshow.jsx';
import CategoryPage from '../CategoryPage/CategoryPage.jsx';
import ContactSection from '../../../components/ContactSection/ContactSection.jsx';
import { Restaurants } from '../../../app/api.js';
import s from '../Home/Home.module.css';
import AboutUs from '../AboutUs/AboutUs.jsx';

const slides = ['/images/food1.jpg', '/images/food2.jpg', '/images/food3.jpg'];

export default function Home() {
  const nav = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  // scroll to hash target on mount + hash change
  useEffect(() => {
    const scrollToHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
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
      {/* Full-width slideshow */}
      <div className={s.hero}>
        <Slideshow images={slides} />
      </div>

      {/* Search */}
      <div className={s.searchBox} ref={boxRef}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a restaurant..."
          className={s.searchInput}
        />
        {open && results.length > 0 && (
          <div className={s.results}>
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => goToRestaurant(r.id)}
                className={s.resultItem}
              >
                <div style={{ flex: 1 }}>
                  <div className={s.resultName}>{r.name}</div>
                  <div className={s.resultMeta}>
                    {[r.city, r.address, r.hechsher].filter(Boolean).join(' • ')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        {open && !loading && results.length === 0 && (
          <div className={s.noResults}>No results found</div>
        )}
      </div>

      {/* About Us Section */}
      <CategoryPage />
      <div className={s.section} id="about">
        <AboutUs />
      </div>

      {/* Contact Section */}
      <div className={s.section} id="contact">
        <ContactSection />
      </div>
    </div>
  );
}
