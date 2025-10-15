import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Articles } from "../../../app/api";
import styles from "./ArticlesAdmin.module.css";

export default function ArticleForm() {
  const { id } = useParams();
  const editing = !!id && id !== "new"; // guard
  const nav = useNavigate();
  const [f, setF] = useState({ title: "", content: "", author: "" });

  useEffect(() => {
    if (editing) Articles.get(id).then(setF).catch(console.error);
  }, [editing, id]);

  const set = (k, v) => setF(s => ({ ...s, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    try {
      if (editing) await Articles.update(id, f);
      else await Articles.create(f);
      nav("/admin/articles");
    } catch (err) {
      console.error("Article save error:", err);
    }
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <h1>{editing ? "Edit Article" : "New Article"}</h1>
      <label className={styles.label}>
        Title
        <input className={styles.input} value={f.title} onChange={e => set("title", e.target.value)} required />
      </label>
      <label className={styles.label}>
        Author
        <input className={styles.input} value={f.author || ""} onChange={e => set("author", e.target.value)}  />
      </label>
      <label className={styles.label}>
        Content
        <textarea className={styles.textarea} value={f.content || ""} onChange={e => set("content", e.target.value)} rows={14} />
      </label>
      <div className={styles.formActions}>
        <button className={styles.btnPrimary} type="submit">Save</button>
      </div>
    </form>
  );
}
