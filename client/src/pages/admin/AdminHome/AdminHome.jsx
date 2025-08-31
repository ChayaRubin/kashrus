import React, { useEffect, useState } from "react";
import { HomeAPI } from "../../../app/api.js";
import styles from "./AdminHome.module.css";

export default function AdminHome() {
  const [content, setContent] = useState({
    slideshowText: "",
    aboutUsText: "",
    contactText: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    HomeAPI.get()
      .then((data) => {
        setContent(data || { slideshowText: "", aboutUsText: "", contactText: "" });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) =>
    setContent({ ...content, [field]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      await HomeAPI.update(content);
      alert("✅ Home content updated");
    } catch (err) {
      console.error(err);
      alert("❌ Error saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Manage Home Page Content</h1>

      <label className={styles.label}>Slideshow Text</label>
      <textarea
        className={styles.textarea}
        value={content.slideshowText}
        onChange={handleChange("slideshowText")}
        rows={2}
      />

      <label className={styles.label}>About Us</label>
      <textarea
        className={styles.textarea}
        value={content.aboutUsText}
        onChange={handleChange("aboutUsText")}
        rows={6}
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className={styles.SaveButton}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
