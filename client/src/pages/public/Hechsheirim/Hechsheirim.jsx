// src/pages/public/Hechsheirim/HechsheirimPage.jsx
import { useEffect, useState } from "react";
import { Hechsheirim } from "../../../app/api";
import styles from "./Hechsheirim.module.css";

const LEVELS = ["FIRST", "SECOND", "THIRD"];

export default function HechsheirimPage() {
  const [q, setQ] = useState("");
  const [data, setData] = useState({ items: [], total: 0 });

  useEffect(() => {
    Hechsheirim.list({ q, page: 1, pageSize: 100 })
      .then((res) => {
        // normalize description → level
        const items = res.items.map((h) => ({
          ...h,
          level: h.description ? h.description.toUpperCase() : "OTHER",
        }));
        setData({ ...res, items });
      })
      .catch(console.error);
  }, [q]);

  // group into sections
  const grouped = LEVELS.map((lvl) => ({
    level: lvl,
    items: data.items.filter((h) => h.level === lvl),
  }));

  const other = data.items.filter((h) => !LEVELS.includes(h.level));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hechsheirim</h1>

      <input
        className={styles.input}
        placeholder="Search name/description…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {grouped.map(({ level, items }) =>
        items.length > 0 ? (
          <section key={level} className={styles.section}>
            <h2 className={styles.levelTitle}>{level}</h2>
            <ul className={styles.grid}>
              {items.map((h) => (
                <li key={h.id} className={styles.card}>
                  {h.symbolUrl && (
                    <img
                      className={styles.logo}
                      src={h.symbolUrl}
                      alt={h.name}
                    />
                  )}
                  <div className={styles.cardHeader}>{h.name}</div>
                </li>
              ))}
            </ul>
          </section>
        ) : null
      )}

      {other.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.levelTitle}>Other</h2>
          <ul className={styles.grid}>
            {other.map((h) => (
              <li key={h.id} className={styles.card}>
                {h.symbolUrl && (
                  <img
                    className={styles.logo}
                    src={h.symbolUrl}
                    alt={h.name}
                  />
                )}
                <div className={styles.cardHeader}>{h.name}</div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
