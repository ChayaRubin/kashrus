// src/pages/admin/Slideshow/AdminSlideshow.jsx
import { useEffect, useState } from "react";
import { SlideshowAPI } from "../../../app/api";
import styles from "./AdminSlideshow.module.css";

export default function AdminSlideshow() {
  const [slides, setSlides] = useState([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editUrl, setEditUrl] = useState("");
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    SlideshowAPI.list().then(setSlides);
  }, []);

  const addSlide = async () => {
    try {
      const newSlide = await SlideshowAPI.create({ url, title, order: slides.length });
      setSlides([...slides, newSlide]);
      setUrl("");
      setTitle("");
    } catch (err) {
      console.error("Failed to add slide", err);
    }
  };

  const startEdit = (slide) => {
    setEditingId(slide.id);
    setEditUrl(slide.url || "");
    setEditTitle(slide.title || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditUrl("");
    setEditTitle("");
  };

  const saveEdit = async (slide) => {
    try {
      const updated = await SlideshowAPI.update(slide.id, { url: editUrl, title: editTitle, order: slide.order ?? 0 });
      setSlides((prev) => prev.map((s) => (s.id === slide.id ? updated : s)));
      cancelEdit();
    } catch (err) {
      console.error("Failed to update slide", err);
    }
  };

  const deleteSlide = async (id) => {
    try {
      await SlideshowAPI.remove(id);
      setSlides(slides.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete slide", err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Slideshow</h1>

      <div className={styles.form}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Image URL"
          className={styles.input}
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className={styles.input}
        />
        <button onClick={addSlide} className={styles.addButton}>
          Add
        </button>
      </div>
<ul className={styles.list}>
  {slides.map((s) => (
    <li key={s.id} className={styles.item}>
      {editingId === s.id ? (
        <>
          <img src={editUrl || s.url} alt={editTitle || s.title} />
          <div className={styles.form}>
            <input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="Image URL"
              className={styles.input}
            />
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title (optional)"
              className={styles.input}
            />
          </div>
          <div className={styles.cardActions}>
            <button onClick={() => saveEdit(s)} className={styles.btn}>Save</button>
            <button onClick={cancelEdit} className={styles.btnDanger}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <img src={s.url} alt={s.title} />
          <div className={styles.details}>
            <span>{s.title}</span>
          </div>
          <div className={styles.cardActions}>
            <button
              onClick={() => startEdit(s)}
              className={styles.btn}
            >
              Edit
            </button>
            <button
              onClick={() => deleteSlide(s.id)}
              className={styles.btnDanger}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  ))}
</ul>

    </div>
  );
}
