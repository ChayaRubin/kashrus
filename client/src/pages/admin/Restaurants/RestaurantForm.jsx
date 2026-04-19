import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Restaurants } from "../../../app/api.js";
import { uploadImage, createImagePreview, revokeImagePreview, validateImageFiles } from "../../../utils/imageUpload";
import styles from "./RestaurantForm.module.css";

const CATEGORIES = ['MEAT', 'DAIRY'];
const TYPES_BY_CATEGORY = {
  MEAT: ['FAST_FOOD', 'SIT_DOWN', 'OTHER'],
  DAIRY: ['BAGELS', 'SUSHI', 'PIZZA', 'FALAFEL', 'ICE_CREAM', 'SIT_DOWN', 'OTHER'],
};
const LEVELS = ['FIRST', 'SECOND', 'THIRD'];

const NEIGHBORHOODS = [
  "Bayit Vegan / Kriyat Yovel",
  "Talpiyot / Emek",
  "Ramot / Ramat Shlomo",
  "Givat Shaul / Har Nof",
  "Romeima / Shamgar",
  "Old City / Mamilla / Yaffo",
  "Pisgat Zeev / Neve Yaakov",
  "City Center / Geula / Meah Shearim",
  "Har Chotzvim",
  "Rechavia",
  "Shmuel Hanavi / Geula",
];

export default function RestaurantForm() {
  const { id } = useParams();
  const editing = !!id && id !== "new";
  const nav = useNavigate();
  const [f, setF] = useState({
    name: "",
    address: "",
    phone: "",
    website: "",
    category: "MEAT",
    type: "FAST_FOOD",
    level: "FIRST",
    hechsher: "",
    city: "",
    neighborhood: "",
    description: "",
    images: [],
    logoUrl: ""
  });

  const [uploadMode, setUploadMode] = useState('url');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false); // ✅ added this
  const [error, setError] = useState('');

  const types = useMemo(() => TYPES_BY_CATEGORY[f.category] || [], [f.category]);

  useEffect(() => {
    if (editing) {
      Restaurants.get(id).then((data) => {
        const typesForCat = TYPES_BY_CATEGORY[data?.category] || TYPES_BY_CATEGORY.MEAT;
        const imagesArray = Array.isArray(data?.images) ? data.images : (data?.images ? [data.images] : []);
        const firstImage = imagesArray.length ? imagesArray[0] : "";
        setF({
          ...data,
          level: LEVELS.includes(data?.level) ? data.level : "FIRST",
          type: typesForCat.includes(data?.type) ? data.type : typesForCat[0],
          images: imagesArray,
          logoUrl: firstImage,
        });
      }).catch(console.error);
    }
  }, [editing, id]);

  useEffect(() => () => filePreview && revokeImagePreview(filePreview), [filePreview]);

  const set = (k, v) => setF(s => ({ ...s, [k]: v }));

  // Upload Handling (same as HechsheirimForm)
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const validFiles = validateImageFiles([file]);
    if (validFiles.length === 0) return setError('Please select a valid image file');
    setSelectedFile(validFiles[0]);
    setFilePreview(createImagePreview(validFiles[0]));
    setError('');
  }

  async function uploadFile() {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const uploadedUrl = await uploadImage(selectedFile);
      set('logoUrl', uploadedUrl);
      revokeImagePreview(filePreview);
      setSelectedFile(null);
      setFilePreview(null);
      setUploadMode('url');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const typesForCat = TYPES_BY_CATEGORY[f.category] || TYPES_BY_CATEGORY.MEAT;
      const normalizedLevel = LEVELS.includes(f.level) ? f.level : "FIRST";
      const normalizedType =
        f.type && typesForCat.includes(f.type) ? f.type : typesForCat[0];

      // Build images array from logoUrl or existing images
      let images = [];
      if (f.logoUrl && f.logoUrl.trim()) {
        images = [f.logoUrl.trim()];
      } else if (Array.isArray(f.images) && f.images.length) {
        images = f.images;
      }

      const payload = {
        name: f.name.trim(),
        category: f.category,
        type: normalizedType,
        level: normalizedLevel,
        city: f.city || null,
        neighborhood: f.neighborhood || null,
        address: f.address || null,
        phone: f.phone || null,
        hechsher: f.hechsher || null,
        website: f.website || null,
        images,
      };

      if (editing) await Restaurants.update(id, payload);
      else await Restaurants.create(payload);
      nav("/admin/restaurants");
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <h1>{editing ? "Edit Restaurant" : "New Restaurant"}</h1>

      <label className={styles.label}>
        Name
        <input className={styles.input} value={f.name} onChange={e => set("name", e.target.value)} required />
      </label>

      <label className={styles.label}>
        Address
        <input className={styles.input} value={f.address} onChange={e => set("address", e.target.value)} />
      </label>

      <label className={styles.label}>
        Phone
        <input className={styles.input} value={f.phone} onChange={e => set("phone", e.target.value)} />
      </label>

      <label className={styles.label}>
        Website
        <input className={styles.input} type="url" value={f.website ?? ""} onChange={e => set("website", e.target.value)} placeholder="https://..." />
      </label>

      <label className={styles.label}>
        Category
        <select className={styles.select} value={f.category} onChange={e => set("category", e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      <label className={styles.label}>
        Type
        <select className={styles.select} value={f.type} onChange={e => set("type", e.target.value)}>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>

      <label className={styles.label}>
        Level
        <select className={styles.select} value={f.level} onChange={e => set("level", e.target.value)}>
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </label>

      <label className={styles.label}>
        Hechsher
        <input className={styles.input} value={f.hechsher ?? ""} onChange={e => set("hechsher", e.target.value)} placeholder="e.g. Rav Rubin, Bedatz" />
      </label>

      <label className={styles.label}>
        City
        <input className={styles.input} value={f.city ?? ""} onChange={e => set("city", e.target.value)} placeholder="e.g. Jerusalem" />
      </label>

      <label className={styles.label}>
        Neighborhood
        <select className={styles.select} value={f.neighborhood} onChange={e => set("neighborhood", e.target.value)}>
          <option value="">Select neighborhood</option>
          {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>

      <label className={styles.label}>
        Description
        <textarea className={styles.textarea} value={f.description} onChange={e => set("description", e.target.value)} rows={4} />
      </label>

      <label className={styles.label}>Logo</label>
      <div className={styles.modeToggle}>
        <button type="button" className={`${styles.modeButton} ${uploadMode === 'url' ? styles.active : ''}`} onClick={() => setUploadMode('url')}>
          URL Input
        </button>
        <button type="button" className={`${styles.modeButton} ${uploadMode === 'upload' ? styles.active : ''}`} onClick={() => setUploadMode('upload')}>
          Upload File
        </button>
      </div>

      {uploadMode === 'url' && (
        <input className={styles.input} value={f.logoUrl} onChange={e => set("logoUrl", e.target.value)} placeholder="Enter logo URL" />
      )}

      {uploadMode === 'upload' && (
        <div className={styles.uploadArea}>
          <div className={styles.dropZone}>
            <p>Drag and drop logo here, or click to select file</p>
            <input type="file" accept="image/*" onChange={handleFileSelect} className={styles.fileInput} />
          </div>

          {filePreview && (
            <div className={styles.filePreview}>
              <img src={filePreview} alt="Preview" />
              <button type="button" className={styles.removeFile} onClick={() => { revokeImagePreview(filePreview); setSelectedFile(null); setFilePreview(null); }}>×</button>
            </div>
          )}

          {selectedFile && (
            <button type="button" className={styles.uploadButton} onClick={uploadFile} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Logo'}
            </button>
          )}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}

      {f.logoUrl && (
        <div className={styles.logoPreview}>
          <img src={f.logoUrl} alt="Current logo" />
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="submit"
          disabled={saving}
          className={`${styles.btn} ${styles.btnPrimary}`}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>

        <button
          type="button"
          onClick={() => nav(-1)}
          disabled={saving}
          className={`${styles.btn} ${styles.btnSecondary}`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
