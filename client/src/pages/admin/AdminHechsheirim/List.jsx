import { useEffect, useState } from "react";
import { Hechsheirim } from "../../../app/api";
import styles from "./HechsheirimAdmin.module.css";
import { Link } from "react-router-dom";

export default function HechsheirimAdminList() {
  const [q, setQ] = useState("");
  const [data, setData] = useState({ items: [], total: 0 });

  useEffect(() => {
    Hechsheirim.list({ q, page: 1, pageSize: 100 }).then(setData);
  }, [q]);

  async function del(id) {
    if (!confirm("Delete this hechsher?")) return;
    await Hechsheirim.remove(id);
    Hechsheirim.list({ q, page: 1, pageSize: 100 }).then(setData);
  }

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <h1>Hechsheirim</h1>
        <Link to="/admin/hechsheirim/new" className={styles.btnPrimary}>
          + New
        </Link>
      </div>

      <input
        className={styles.input}
        placeholder="Search…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className={styles.cards}>
        {data.items.map((h) => (
          <div key={h.id} className={styles.card}>
            {h.symbolUrl && (
              <img src={h.symbolUrl} alt={h.name} className={styles.logo} />
            )}
            <div className={styles.cardHeader}>
              <h3>{h.name}</h3>
            </div>
            <p className={styles.desc}>
              {h.description
                ? h.description.slice(0, 100) +
                  (h.description.length > 100 ? "…" : "")
                : "—"}
            </p>
            <div className={styles.cardActions}>
              <Link className={styles.btn} to={`/admin/hechsheirim/${h.id}`}>
                Edit
              </Link>
              <button
                className={styles.btnDanger}
                onClick={() => del(h.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
