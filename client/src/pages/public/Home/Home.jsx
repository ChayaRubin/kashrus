import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slideshow from "../../../components/Slideshow/Slideshow.jsx";
import CategoryPage from "../CategoryPage/CategoryPage.jsx";
import ContactSection from "../../../components/ContactSection/ContactSection.jsx";
import { Restaurants, SlideshowAPI, HomeAPI } from "../../../app/api.js";
import s from "./Home.module.css";
import AboutUs from "../AboutUs/AboutUs.jsx";

export default function Home() {
  const nav = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState([]);
  const [content, setContent] = useState(null); // ✅ texts from DB
  const boxRef = useRef(null);

  // fetch slides once
  useEffect(() => {
    SlideshowAPI.list().then(setSlides).catch(console.error);
  }, []);

  // fetch home content texts
  useEffect(() => {
    HomeAPI.get().then(setContent).catch(console.error);
  }, []);

  // debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
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
        setResults(data.slice(0, 8));
        setOpen(true);
      } catch {
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

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
            <div className={s.results}>
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => goToRestaurant(r.id)}
                  className={s.resultItem}
                >
                  <div className={s.resultText}>
                    <div className={s.resultName}>{r.name}</div>
                    <div className={s.resultMeta}>
                      {[r.city, r.address, r.hechsher].filter(Boolean).join(" • ")}
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

        {/* Categories */}
        <div className={s.heroCategories}>
          <CategoryPage />
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
