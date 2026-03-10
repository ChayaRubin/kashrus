// import React, { useEffect, useMemo, useState } from 'react';
// import { Restaurants } from '../../../app/api.js';
// import { useNavigate, useParams } from 'react-router-dom';
// import { uploadImage, createImagePreview, revokeImagePreview, validateImageFiles } from '../../../utils/imageUpload';
// import styles from './RestaurantForm.module.css';

// const CATEGORIES = ['MEAT', 'DAIRY'];
// const TYPES_BY_CATEGORY = {
//   MEAT: ['FAST_FOOD', 'SIT_DOWN', 'OTHER'],
//   DAIRY: ['BAGELS', 'SUSHI', 'PIZZA', 'FALAFEL', 'ICE_CREAM', 'SIT_DOWN', 'OTHER'],
// };
// const LEVELS = ['FIRST', 'SECOND', 'THIRD'];

// const NEIGHBORHOODS = [
//   "Bayit Vegan / Kriyat Yovel",
//   "Talpiyot / Emek",
//   "Ramot / Ramat Shlomo",
//   "Givat Shaul / Har Nof",
//   "Romeima / Shamgar",
//   "Old City / Mamilla / Yaffo",
//   "Pisgat zeev / Neve Yaakov",
//   "Ramat Eshkol / French Hill / Shmuel HaNavi",
//   "Beis Yisrael / Geula",
//   "Har Chotzvim",
//   "Other",
// ];

// export default function RestaurantForm() {
//   const { id } = useParams();
//   const nav = useNavigate();
//   const editing = id && id !== 'new';

//   const [f, setF] = useState({
//     name: '',
//     category: 'MEAT',
//     type: 'FAST_FOOD',
//     level: 'FIRST',
//     city: '',
//     neighborhood: '',
//     address: '',
//     phone: '',
//     hechsher: '',
//     images: [],
//     website: '',
//   });

//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [uploadMode, setUploadMode] = useState('url'); // 'url' or 'upload'
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [filePreviews, setFilePreviews] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const typeOptions = useMemo(
//     () => TYPES_BY_CATEGORY[f.category] || [],
//     [f.category]
//   );

//   useEffect(() => {
//     if (!editing) return;
//     let ignore = false;

//     async function load() {
//       try {
//         const r = await Restaurants.get(Number(id));
//         if (ignore) return;
//         setF({
//           name: r.name || '',
//           category: r.category || 'MEAT',
//           type: r.type || 'FAST_FOOD',
//           level: r.level || 'FIRST',
//           city: r.city || '',
//           neighborhood: r.neighborhood || '',
//           address: r.address || '',
//           phone: r.phone || '',
//           hechsher: r.hechsher || '',
//           images: Array.isArray(r.images) ? r.images : (r.images ? [r.images] : []),
//           website: r.website || '',
//         });
//       } catch (e) {
//         console.error(e);
//         setError('Failed to load restaurant.');
//       }
//     }
//     load();
//     return () => { ignore = true; };
//   }, [editing, id]);

//   // Cleanup preview URLs on unmount
//   useEffect(() => {
//     return () => {
//       filePreviews.forEach(preview => revokeImagePreview(preview));
//     };
//   }, [filePreviews]);

//   function setField(key, val) {
//     setF((s) => ({ ...s, [key]: val }));
//   }

//   function setImagesFromTextarea(value) {
//     if (!value.trim()) {
//       setField('images', []);
//       return;
//     }
//     const arr = value.split('\n').map((s) => s.trim()).filter(Boolean);
//     setField('images', arr);
//   }

//   function handleFileSelect(event) {
//     const files = Array.from(event.target.files);
//     const validFiles = validateImageFiles(files);
    
//     if (validFiles.length === 0) {
//       setError('Please select valid image files');
//       return;
//     }

//     setSelectedFiles(validFiles);
    
//     // Create previews
//     const previews = validFiles.map(file => createImagePreview(file));
//     setFilePreviews(previews);
//     setError('');
//   }

//   function handleDragOver(event) {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'copy';
//   }

//   function handleDrop(event) {
//     event.preventDefault();
//     const files = Array.from(event.dataTransfer.files);
//     const validFiles = validateImageFiles(files);
    
//     if (validFiles.length === 0) {
//       setError('Please drop valid image files');
//       return;
//     }

//     setSelectedFiles(validFiles);
    
//     // Create previews
//     const previews = validFiles.map(file => createImagePreview(file));
//     setFilePreviews(previews);
//     setError('');
//   }

//   function removeFile(index) {
//     const newFiles = selectedFiles.filter((_, i) => i !== index);
//     const newPreviews = filePreviews.filter((_, i) => i !== index);
    
//     // Revoke the preview URL
//     revokeImagePreview(filePreviews[index]);
    
//     setSelectedFiles(newFiles);
//     setFilePreviews(newPreviews);
//   }

//   async function uploadFiles() {
//     if (selectedFiles.length === 0) return;

//     setUploading(true);
//     setError('');

//     try {
//       const uploadPromises = selectedFiles.map(file => uploadImage(file));
//       const uploadedUrls = await Promise.all(uploadPromises);
      
//       // Add uploaded URLs to existing images
//       setField('images', [...f.images, ...uploadedUrls]);
      
//       // Clear selected files and previews
//       filePreviews.forEach(preview => revokeImagePreview(preview));
//       setSelectedFiles([]);
//       setFilePreviews([]);
      
//       // Switch back to URL mode
//       setUploadMode('url');
      
//     } catch (error) {
//       console.error('Upload error:', error);
//       setError(error.message || 'Upload failed');
//     } finally {
//       setUploading(false);
//     }
//   }

//   async function submit(e) {
//     e.preventDefault();
//     setError('');

//     const payload = {
//       name: f.name.trim(),
//       category: f.category,
//       type: f.type,
//       level: f.level,
//       city: f.city || null,
//       neighborhood: f.neighborhood || null,
//       address: f.address || null,
//       phone: f.phone || null,
//       hechsher: f.hechsher || null,
//       images: f.images.length ? JSON.stringify(f.images) : null,
//       website: f.website || null,
//     };

//     try {
//       setSaving(true);
//       if (editing) {
//         await Restaurants.update(Number(id), payload);
//       } else {
//         await Restaurants.create(payload);
//       }
//       nav('/admin/restaurants');
//     } catch (e) {
//       console.error(e);
//       setError('Save failed. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className={styles.container}>
//       <h3 className={styles.title}>{editing ? 'Edit' : 'New'} Restaurant</h3>

//       {error && editing && <div className={styles.errorBox}>{error}</div>}

//       <form onSubmit={submit} className={styles.form}>
//         <div className={styles.row}>
//           <label className={styles.label}>Name</label>
//           <input className={styles.input} value={f.name} onChange={(e) => setField('name', e.target.value)} required />
//         </div>

//         <div className={styles.grid2}>
//           <div className={styles.row}>
//             <label className={styles.label}>Category</label>
//             <select className={styles.select} value={f.category} onChange={(e) => setField('category', e.target.value)} required>
//               {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
//             </select>
//           </div>

//           <div className={styles.row}>
//             <label className={styles.label}>Type</label>
//             <select className={styles.select} value={f.type} onChange={(e) => setField('type', e.target.value)} required>
//               {typeOptions.map((t) => <option key={t} value={t}>{t.replaceAll('_', ' ')}</option>)}
//             </select>
//           </div>
//         </div>

//         <div className={styles.grid2}>
//           <div className={styles.row}>
//             <label className={styles.label}>Level</label>
//             <select className={styles.select} value={f.level} onChange={(e) => setField('level', e.target.value)}>
//               {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
//             </select>
//           </div>
//           <div className={styles.row}>
//             <label className={styles.label}>Hechsher</label>
//             <input className={styles.input} value={f.hechsher} onChange={(e) => setField('hechsher', e.target.value)} />
//           </div>
//         </div>

//         <div className={styles.grid2}>
//           <div className={styles.row}>
//             <label className={styles.label}>City</label>
//             <input className={styles.input} value={f.city} onChange={(e) => setField('city', e.target.value)} />
//           </div>
//           <div className={styles.row}>
//             <label className={styles.label}>Neighborhood</label>
//             <select className={styles.select} value={f.neighborhood} onChange={(e) => setField('neighborhood', e.target.value)}>
//               <option value="">Select neighborhood</option>
//               {NEIGHBORHOODS.map((n) => <option key={n} value={n}>{n}</option>)}
//             </select>
//           </div>
//         </div>

//         <div className={styles.grid2}>
//           <div className={styles.row}>
//             <label className={styles.label}>Phone</label>
//             <input className={styles.input} value={f.phone} onChange={(e) => setField('phone', e.target.value)} />
//           </div>
//           <div className={styles.row}>
//             {/* Empty div for grid alignment */}
//           </div>
//         </div>

//         <div className={styles.row}>
//           <label className={styles.label}>Address</label>
//           <input className={styles.input} value={f.address} onChange={(e) => setField('address', e.target.value)} />
//         </div>

//         <div className={styles.row}>
//           <label className={styles.label}>Website</label>
//           <input className={styles.input} value={f.website} onChange={(e) => setField('website', e.target.value)} />
//         </div>

//         <div className={styles.row}>
//           <label className={styles.label}>Images</label>
          
//           {/* Mode Toggle */}
//           <div className={styles.modeToggle}>
//             <button
//               type="button"
//               className={`${styles.modeButton} ${uploadMode === 'url' ? styles.active : ''}`}
//               onClick={() => setUploadMode('url')}
//             >
//               URL Input
//             </button>
//             <button
//               type="button"
//               className={`${styles.modeButton} ${uploadMode === 'upload' ? styles.active : ''}`}
//               onClick={() => setUploadMode('upload')}
//             >
//               Upload Files
//             </button>
//           </div>

//           {/* URL Input Mode */}
//           {uploadMode === 'url' && (
//             <textarea
//               className={styles.textarea}
//               value={f.images.join('\n')}
//               onChange={(e) => setImagesFromTextarea(e.target.value)}
//               placeholder="Enter image URLs (one per line)"
//             />
//           )}

//           {/* File Upload Mode */}
//           {uploadMode === 'upload' && (
//             <div className={styles.uploadArea}>
//               <div
//                 className={styles.dropZone}
//                 onDragOver={handleDragOver}
//                 onDrop={handleDrop}
//               >
//                 <p>Drag and drop images here, or click to select files</p>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleFileSelect}
//                   className={styles.fileInput}
//                 />
//               </div>

//               {/* File Previews */}
//               {filePreviews.length > 0 && (
//                 <div className={styles.filePreviews}>
//                   {filePreviews.map((preview, index) => (
//                     <div key={index} className={styles.filePreview}>
//                       <img src={preview} alt={`Preview ${index + 1}`} />
//                       <button
//                         type="button"
//                         className={styles.removeFile}
//                         onClick={() => removeFile(index)}
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Upload Button */}
//               {selectedFiles.length > 0 && (
//                 <button
//                   type="button"
//                   className={styles.uploadButton}
//                   onClick={uploadFiles}
//                   disabled={uploading}
//                 >
//                   {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`}
//                 </button>
//               )}
//             </div>
//           )}

//           {/* Image Previews */}
//           {!!f.images.length && (
//             <div className={styles.imagesPreview}>
//               {f.images.map((src, i) => (
//                 <img key={i} src={src} alt={`preview ${i+1}`} />
//               ))}
//             </div>
//           )}
//         </div>

//         <div className={styles.actions}>
//           <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
//             {saving ? 'Saving…' : editing ? 'Save' : 'Create'}
//           </button>
//           <button type="button" onClick={() => nav(-1)} disabled={saving} className={`${styles.btn} ${styles.btnSecondary}`}>
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

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
];

export default function RestaurantForm() {
  const { id } = useParams();
  const editing = !!id && id !== "new";
  const nav = useNavigate();
  const [f, setF] = useState({
    name: "",
    address: "",
    phone: "",
    category: "MEAT",
    type: "",
    level: "",
    neighborhood: "",
    description: "",
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
    if (editing) Restaurants.get(id).then(setF).catch(console.error);
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
    setSaving(true); // ✅ start loading
    try {
      if (editing) await Restaurants.update(id, f);
      else await Restaurants.create(f);
      nav("/admin/restaurants");
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Save failed");
    } finally {
      setSaving(false); // ✅ end loading
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
