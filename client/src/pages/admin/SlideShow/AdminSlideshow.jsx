// src/pages/admin/Slideshow/AdminSlideshow.jsx
import { useEffect, useState, useRef } from "react";
import { SlideshowAPI } from "../../../app/api";
import { uploadImage, createImagePreview, revokeImagePreview, validateImageFiles } from "../../../utils/imageUpload";
import styles from "./AdminSlideshow.module.css";

export default function AdminSlideshow() {
  const [slides, setSlides] = useState([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editUrl, setEditUrl] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [uploadMode, setUploadMode] = useState("url"); // "url" or "upload"
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    SlideshowAPI.list().then(setSlides);
  }, []);

  const addSlide = async () => {
    setError("");
    
    try {
      let imageUrl = url;
      
      // Handle file upload if in upload mode
      if (uploadMode === "upload" && selectedFile) {
        setUploading(true);
        imageUrl = await uploadImage(selectedFile);
      }
      
      if (!imageUrl) {
        setError("Please provide an image URL or select a file to upload");
        return;
      }
      
      const newSlide = await SlideshowAPI.create({ url: imageUrl, title, order: slides.length });
      setSlides([...slides, newSlide]);
      setUrl("");
      setTitle("");
      setSelectedFile(null);
      setFilePreview(null);
      revokeImagePreview(filePreview);
    } catch (err) {
      console.error("Failed to add slide", err);
      setError(err.message || "Failed to add slide");
    } finally {
      setUploading(false);
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
    if (!confirm("Are you sure you want to delete this slide?")) {
      return;
    }
    
    try {
      await SlideshowAPI.remove(id);
      setSlides(slides.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete slide", err);
      setError(err.message || "Failed to delete slide. Please try again.");
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validFiles = validateImageFiles(files);
      if (validFiles.length > 0) {
        const file = validFiles[0];
        setSelectedFile(file);
        const preview = createImagePreview(file);
        setFilePreview(preview);
        setError("");
      } else {
        setError("Please select a valid image file (JPG, PNG, WebP) under 5MB");
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const validFiles = validateImageFiles(files);
      if (validFiles.length > 0) {
        const file = validFiles[0];
        setSelectedFile(file);
        const preview = createImagePreview(file);
        setFilePreview(preview);
        setError("");
      } else {
        setError("Please select a valid image file (JPG, PNG, WebP) under 5MB");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      revokeImagePreview(filePreview);
      setFilePreview(null);
    }
  };

  const switchMode = (mode) => {
    setUploadMode(mode);
    setError("");
    if (mode === "url") {
      clearFile();
    } else {
      setUrl("");
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (filePreview) {
        revokeImagePreview(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Slideshow</h1>

      {/* Upload Mode Toggle */}
      <div className={styles.modeToggle}>
        <button
          className={`${styles.modeButton} ${uploadMode === "url" ? styles.active : ""}`}
          onClick={() => switchMode("url")}
        >
           Add by URL
        </button>
        <button
          className={`${styles.modeButton} ${uploadMode === "upload" ? styles.active : ""}`}
          onClick={() => switchMode("upload")}
        >
           Upload Image
        </button>
      </div>

      {/* Error Message */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Add Slide Form */}
      <div className={styles.form}>
        {uploadMode === "url" ? (
          <>
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
          </>
        ) : (
          <>
            <div className={styles.uploadArea}>
              <div
                className={styles.dropZone}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                {filePreview ? (
                  <div className={styles.filePreview}>
                    <img src={filePreview} alt="Preview" className={styles.previewImage} />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                      className={styles.removeFile}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className={styles.dropText}>
                    <div className={styles.dropIcon}>📁</div>
                    <div>Click to select or drag & drop an image</div>
                    <div className={styles.dropHint}>JPG, PNG, WebP (max 5MB)</div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className={styles.input}
            />
          </>
        )}
        <button 
          onClick={addSlide} 
          className={styles.addButton}
          disabled={uploading || (uploadMode === "upload" && !selectedFile) || (uploadMode === "url" && !url)}
        >
          {uploading ? "Uploading..." : "Add Slide"}
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
            <span>{s.title || "Untitled"}</span>
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
