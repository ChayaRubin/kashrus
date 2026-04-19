import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
    <div className={s.categoryGrid}>
      <button
        type="button"
        onClick={() => handleCategoryClick('MEAT')}
        className={s.categoryBtn}
      >
        Meat
      </button>
      <button
        type="button"
        onClick={() => handleCategoryClick('DAIRY')}
        className={s.categoryBtn}
      >
        Dairy
      </button>
    </div>
  );
}

const ALL_TYPES = ["FAST_FOOD", "SIT_DOWN", "PIZZA", "SUSHI", "BAGELS", "FALAFEL", "ICE_CREAM"];
const ALL_LEVELS = ["FIRST", "SECOND", "THIRD"];

export default function Home() {
  const nav = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [content, setContent] = useState(null);
  const boxRef = useRef(null);

  const q = (search || "").trim().toLowerCase();
  const filtered = !allRestaurants.length
    ? []
    : !q
      ? allRestaurants
      : allRestaurants.filter(
          (r) =>
            (r.name || "").toLowerCase().includes(q) ||
            (r.city || "").toLowerCase().includes(q) ||
            (r.hechsher || "").toLowerCase().includes(q) ||
            (r.neighborhood || "").toLowerCase().includes(q) ||
            (r.address || "").toLowerCase().includes(q)
        );
  const results = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    const qParam = searchParams.get("q") || "";
    if (qParam !== search) {
      setSearch(qParam);
    }
  }, [searchParams, search]);

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

  // load all restaurants once (like Manage Restaurants), then filter client-side
  useEffect(() => {
    setLoadingList(true);
    Restaurants.list({ types: ALL_TYPES, levels: ALL_LEVELS })
      .then((data) => setAllRestaurants(Array.isArray(data) ? data : []))
      .catch(() => setAllRestaurants([]))
      .finally(() => setLoadingList(false));
  }, []);

  // open dropdown when user has typed something
  useEffect(() => {
    setOpen(!!q);
    if (!q) setVisibleCount(8);
  }, [q]);

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

  const onResultsScroll = (e) => {
    const el = e.currentTarget;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
    if (!atBottom) return;
    if (visibleCount < filtered.length) {
      setVisibleCount((prev) => Math.min(prev + 8, filtered.length));
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
    nav(`/restaurant/${id}`, {
      state: {
        from: `${location.pathname}${location.search}${location.hash}`,
        fromHome: true,
      },
    });
  };

  return (
    <div className={s.wrap}>
      <div className={s.hero}>
        <Slideshow
          images={slides.map((s) => s.url)}
          fullScreen
          overlayText={content?.slideshowText}
        />
        <div className={s.searchBox} ref={boxRef}>
          <input
            type="search"
            value={search}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSearch(nextValue);
              const params = new URLSearchParams(searchParams);
              if (nextValue.trim()) params.set("q", nextValue);
              else params.delete("q");
              setSearchParams(params, { replace: true });
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="Search restaurants…"
            className={s.searchInput}
            aria-label="Search restaurants"
          />
          {open && q && (
            <>
              {loadingList && (
                <div className={s.noResults}>Loading…</div>
              )}
              {!loadingList && results.length > 0 && (
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
                          {[r.address, r.hechsher, r.neighborhood].filter(Boolean).join(" • ")}
                        </div>
                      </div>
                    </button>
                  ))}
                  {hasMore && (
                    <div className={s.noResults}>Scroll for more…</div>
                  )}
                </div>
              )}
              {!loadingList && results.length === 0 && (
                <div className={s.noResults}>
                  {allRestaurants.length && q ? "No restaurants match your search." : "No restaurants yet."}
                </div>
              )}
            </>
          )}
        </div>
        <div className={s.heroCategories}>
          <HomeCategoryPage />
        </div>
      </div>
      <div className={s.section} id="about">
        <AboutUs text={content?.aboutUsText} />
      </div>
      <div className={s.section} id="contact">
        <ContactSection text={content?.contactText} />
      </div>
    </div>
  );
}
