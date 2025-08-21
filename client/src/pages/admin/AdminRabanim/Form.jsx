import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Rabanim } from "../../../app/api";
import styles from "./RabanimAdmin.module.css";

export default function RabbiForm() {
  const { id } = useParams();
  const editing = !!id && id !== "new"; // guard against undefined
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", bio: "", area: "" });

  useEffect(() => {
    if (editing) Rabanim.get(id).then(setF).catch(console.error);
  }, [editing, id]);

  const set = (k, v) => setF(s => ({ ...s, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    try {
      if (editing) await Rabanim.update(id, f);
      else await Rabanim.create(f);
      nav("/admin/rabanim");
    } catch (err) {
      console.error("Rabbi save error:", err);
    }
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <h1>{editing ? "Edit Rabbi" : "New Rabbi"}</h1>
      <label className={styles.label}>
        Name
        <input className={styles.input} value={f.name} onChange={e => set("name", e.target.value)} required />
      </label>
      <label className={styles.label}>
        Area
        <input className={styles.input} value={f.area || ""} onChange={e => set("area", e.target.value)} />
      </label>
      <label className={styles.label}>
        Bio
        <textarea className={styles.textarea} value={f.bio || ""} onChange={e => set("bio", e.target.value)} rows={8} />
      </label>
      <div className={styles.formActions}>
        <button className={styles.btnPrimary} type="submit">Save</button>
      </div>
    </form>
  );
}
