import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slideshow from "../../../components/Slideshow/Slideshow.jsx";
import CategoryPage, { setFromHomePage } from "../CategoryPage/CategoryPage.jsx";
import ContactSection from "../../../components/ContactSection/ContactSection.jsx";
import { Restaurants, SlideshowAPI, HomeAPI } from "../../../app/api.js";
import s from "./Home.module.css";
import AboutUs from "../AboutUs/AboutUs.jsx";

// Simple category component for home page
function HomeCategoryPage() {
  const nav = useNavigate();
  
  const handleCategoryClick = (category) => {
    setFromHomePage(); // Set flag before navigation
    nav(`/browse/${category}`);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <button 
        onClick={() => handleCategoryClick('MEAT')}
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '20px 20px',
          fontSize: '1.3rem',
          fontWeight: '600',
          color: '#459BAC',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          width: '80%',
          margin: 'auto'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#f0f9fb';
          e.target.style.borderColor = '#459BAC';
          e.target.style.transform = 'translateY(-3px)';
          e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#fff';
          e.target.style.borderColor = '#e5e7eb';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }}
      >
        Meat
      </button>
      <button 
        onClick={() => handleCategoryClick('DAIRY')}
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '20px 20px',
          fontSize: '1.3rem',
          fontWeight: '600',
          color: '#459BAC',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          width: '80%',
          margin: 'auto'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#f0f9fb';
          e.target.style.borderColor = '#459BAC';
          e.target.style.transform = 'translateY(-3px)';
          e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#fff';
          e.target.style.borderColor = '#e5e7eb';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }}
      >
        Dairy
      </button>
    </div>
  );
}

export default function Home() {
  const nav = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); // currently visible
  const [allResults, setAllResults] = useState([]); // full list from API
  const [visibleCount, setVisibleCount] = useState(8);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState([]);
  const [content, setContent] = useState(null); // ✅ texts from DB
  const boxRef = useRef(null);

  // Check for hash immediately on mount and prevent default scroll
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Prevent default scroll to top
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, []); // Run only on mount

  // fetch slides once
  useEffect(() => {
    SlideshowAPI.list().then(setSlides).catch(console.error);
  }, []);

  // fetch home content texts
  useEffect(() => {
    HomeAPI.get().then(setContent).catch(console.error);
  }, []);

  // handle hash-based scrolling when component mounts or content loads
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          const yOffset = -80; // navbar height
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          return true;
        }
      }
      return false;
    };

    // Prevent default scroll to top behavior
    window.scrollTo(0, 0);
    
    // Try to scroll to hash immediately
    const timer1 = setTimeout(() => {
      if (!scrollToHash()) {
        // If not successful, try again after content loads
        const timer2 = setTimeout(() => {
          scrollToHash();
        }, 200);
        return () => clearTimeout(timer2);
      }
    }, 50);
    
    return () => clearTimeout(timer1);
  }, [content]); // Re-run when content loads

  // Listen for hash changes (in case user navigates directly to hash)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash.replace('#', ''));
          if (element) {
            const yOffset = -80;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setAllResults([]);
      setVisibleCount(8);
      setOpen(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const data = await Restaurants.list({
          q: query.trim(),
          types: ["FAST_FOOD", "SIT_DOWN", "PIZZA", "SUSHI", "BAGELS", "FALAFEL", "ICE_CREAM"],
          levels: ["FIRST", "SECOND", "THIRD"],
        });
        setAllResults(data);
        setVisibleCount(8);
        setResults(data.slice(0, 8));
        setOpen(true);
      } catch {
        setResults([]);
        setAllResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  // load more when scrolled to bottom of results box
  const onResultsScroll = (e) => {
    const el = e.currentTarget;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4; // small threshold
    if (!atBottom) return;

    // if more items available, reveal next chunk
    if (visibleCount < allResults.length) {
      const next = Math.min(visibleCount + 8, allResults.length);
      setVisibleCount(next);
      setResults(allResults.slice(0, next));
    }
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const goToRestaurant = (id) => {
    setOpen(false);
    setQuery("");
    nav(`/restaurant/${id}`, { state: { fromHome: true } });
  };

  return (
    <div className={s.wrap}>
      <div className={s.hero}>
        <Slideshow
          images={slides.map((s) => s.url)}
          fullScreen
          overlayText={content?.slideshowText}
        />

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
            <div className={s.results} onScroll={onResultsScroll}>
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => goToRestaurant(r.id)}
                  className={s.resultItem}
                >
                  <div className={s.resultText}>
                    <div className={s.resultName}>{r.name}</div>
                    <div className={s.resultMeta}>
                      {[ r.address, r.hechsher, r.neighborhood].filter(Boolean).join(" • ")}
                    </div>
                  </div>
                </button>
              ))}
              {visibleCount < allResults.length && (
                <div className={s.noResults}>Scroll for more…</div>
              )}
            </div>
          )}
          {open && !loading && results.length === 0 && (
            <div className={s.noResults}>No results found</div>
          )}
        </div>

        {/* Categories */}
        <div className={s.heroCategories}>
          <HomeCategoryPage />
        </div>
      </div>

      {/* Sections */}
      <div className={s.section} id="about">
        <AboutUs text={content?.aboutUsText} />
      </div>
      <div className={s.section} id="contact">
        <ContactSection text={content?.contactText} />
      </div>
    </div>
  );
}
