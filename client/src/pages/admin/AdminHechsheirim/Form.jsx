import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Hechsheirim } from "../../../app/api";
import styles from "./HechsheirimAdmin.module.css";

export default function HechsheirimForm() {
  const { id } = useParams();
  const editing = !!id && id !== "new"; // guard
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", description: "", symbolUrl: "" });

  useEffect(() => {
    if (editing) Hechsheirim.get(id).then(setF).catch(console.error);
  }, [editing, id]);

  const set = (k, v) => setF(s => ({ ...s, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    try {
      if (editing) await Hechsheirim.update(id, f);
      else await Hechsheirim.create(f);
      nav("/admin/hechsheirim");
    } catch (err) {
      console.error("Hechsher save error:", err);
    }
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <h1>{editing ? "Edit Hechsher" : "New Hechsher"}</h1>
      <label className={styles.label}>
        Name
        <input className={styles.input} value={f.name} onChange={e => set("name", e.target.value)} required />
      </label>
      <label className={styles.label}>
        Description
        <textarea className={styles.textarea} value={f.description || ""} onChange={e => set("description", e.target.value)} rows={6} />
      </label>
      <label className={styles.label}>
        Logo URL
        <input className={styles.input} value={f.symbolUrl || ""} onChange={e => set("symbolUrl", e.target.value)} />
      </label>
      <div className={styles.formActions}>
        <button className={styles.btnPrimary} type="submit">Save</button>
      </div>
    </form>
  );
}
