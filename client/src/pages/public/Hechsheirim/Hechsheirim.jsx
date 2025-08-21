// src/pages/public/Hechsheirim/HechsheirimPage.jsx
import { useEffect, useState } from "react";
import { Hechsheirim } from "../../../app/api"; // 👈 make sure api.js also points to "/hechsheirim"
import styles from "./Hechsheirim.module.css";

export default function HechsheirimPage() {
  const [q, setQ] = useState("");
  const [data, setData] = useState({ items: [], total: 0 });

  useEffect(() => {
    Hechsheirim.list({ q, page: 1, pageSize: 50 })
      .then(setData)
      .catch(console.error);
  }, [q]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hechsheirim</h1>

      <input
        className={styles.input}
        placeholder="Search name/description…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <ul className={styles.grid}>
        {data.items.map((h) => (
          <li key={h.id} className={styles.card}>
            {h.symbolUrl && (
              <img className={styles.logo} src={h.symbolUrl} alt={h.name} />
            )}
            <div className={styles.cardHeader}>{h.name}</div>
            {h.description && <p className={styles.text}>{h.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
