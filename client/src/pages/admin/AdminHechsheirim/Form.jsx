import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Hechsheirim } from "../../../app/api";
import { uploadImage, createImagePreview, revokeImagePreview, validateImageFiles } from "../../../utils/imageUpload";
import styles from "./HechsheirimAdmin.module.css";

export default function HechsheirimForm() {
  const { id } = useParams();
  const editing = !!id && id !== "new"; // guard
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", description: "", symbolUrl: "" });
  const [uploadMode, setUploadMode] = useState('url'); // 'url' or 'upload'
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) Hechsheirim.get(id).then(setF).catch(console.error);
  }, [editing, id]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (filePreview) revokeImagePreview(filePreview);
    };
  }, [filePreview]);

  const set = (k, v) => setF(s => ({ ...s, [k]: v }));

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const validFiles = validateImageFiles([file]);
    if (validFiles.length === 0) {
      setError('Please select a valid image file');
      return;
    }

    setSelectedFile(validFiles[0]);
    setFilePreview(createImagePreview(validFiles[0]));
    setError('');
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    const validFiles = validateImageFiles([file]);
    if (validFiles.length === 0) {
      setError('Please drop a valid image file');
      return;
    }

    setSelectedFile(validFiles[0]);
    setFilePreview(createImagePreview(validFiles[0]));
    setError('');
  }

  function removeFile() {
    if (filePreview) revokeImagePreview(filePreview);
    setSelectedFile(null);
    setFilePreview(null);
  }

  async function uploadFile() {
    if (!selectedFile) return;

    setUploading(true);
    setError('');

    try {
      const uploadedUrl = await uploadImage(selectedFile);
      set('symbolUrl', uploadedUrl);
      
      // Clear selected file and preview
      revokeImagePreview(filePreview);
      setSelectedFile(null);
      setFilePreview(null);
      
      // Switch back to URL mode
      setUploadMode('url');
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

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
        Logo
      </label>
      
      {/* Mode Toggle */}
      <div className={styles.modeToggle}>
        <button
          type="button"
          className={`${styles.modeButton} ${uploadMode === 'url' ? styles.active : ''}`}
          onClick={() => setUploadMode('url')}
        >
          URL Input
        </button>
        <button
          type="button"
          className={`${styles.modeButton} ${uploadMode === 'upload' ? styles.active : ''}`}
          onClick={() => setUploadMode('upload')}
        >
          Upload File
        </button>
      </div>

      {/* URL Input Mode */}
      {uploadMode === 'url' && (
        <input 
          className={styles.input} 
          value={f.symbolUrl || ""} 
          onChange={e => set("symbolUrl", e.target.value)} 
          placeholder="Enter logo URL"
        />
      )}

      {/* File Upload Mode */}
      {uploadMode === 'upload' && (
        <div className={styles.uploadArea}>
          <div
            className={styles.dropZone}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p>Drag and drop logo here, or click to select file</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className={styles.fileInput}
            />
          </div>

          {/* File Preview */}
          {filePreview && (
            <div className={styles.filePreview}>
              <img src={filePreview} alt="Preview" />
              <button
                type="button"
                className={styles.removeFile}
                onClick={removeFile}
              >
                ×
              </button>
            </div>
          )}

          {/* Upload Button */}
          {selectedFile && (
            <button
              type="button"
              className={styles.uploadButton}
              onClick={uploadFile}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Logo'}
            </button>
          )}

          {/* Error Message */}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}

      {/* Logo Preview */}
      {f.symbolUrl && (
        <div className={styles.logoPreview}>
          <img src={f.symbolUrl} alt="Current logo" />
        </div>
      )}
      <div className={styles.formActions}>
        <button className={styles.btnPrimary} type="submit">Save</button>
      </div>
    </form>
  );
}
