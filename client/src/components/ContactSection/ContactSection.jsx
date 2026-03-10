import React, { useState } from 'react';
import styles from './ContactSection.module.css';
import { api } from '../../app/api.js';

export default function ContactPage() {
  const [mode, setMode] = useState('question'); // 'question' | 'add_restaurant'
  const [formData, setFormData] = useState({
    // common
    name: '',
    email: '',
    phone: '',
    // question-specific
    subject: '',
    message: '',
    // add_restaurant-specific
    requesterName: '',
    requesterEmail: '',
    restaurantName: '',
    city: '',
    address: '',
    website: '',
    kashrus: '',
    details: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      requesterName: '',
      requesterEmail: '',
      restaurantName: '',
      city: '',
      address: '',
      website: '',
      kashrus: '',
      details: '',
    });
    setImages([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError('Some files were rejected. Please ensure all files are images under 5MB.');
    }

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const captureImage = async () => {
    console.log('Capture image clicked');
    
    try {
      // Check if we're on HTTPS or localhost (required for camera access)
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      if (!isSecure) {
        console.log('Not on HTTPS, falling back to file input');
        setError('Camera access requires HTTPS. Using file picker instead.');
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e) => {
          if (e.target.files && e.target.files[0]) {
            handleImageChange(e);
          }
        };
        input.click();
        return;
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia not supported, falling back to file input');
        setError('Camera not supported on this device. Using file picker instead.');
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e) => {
          if (e.target.files && e.target.files[0]) {
            handleImageChange(e);
          }
        };
        input.click();
        return;
      }

      console.log('Requesting camera access...');
      // Request camera access with simpler constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true
      });
      console.log('Camera access granted');

      // Create camera modal
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `;

      const video = document.createElement('video');
      video.style.cssText = `
        max-width: 90%;
        max-height: 70%;
        border-radius: 8px;
      `;
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;

      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      `;

      const captureBtn = document.createElement('button');
      captureBtn.textContent = '📸 Capture Photo';
      captureBtn.style.cssText = `
        background: #459BAC;
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
      `;

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '❌ Cancel';
      cancelBtn.style.cssText = `
        background: #666;
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
      `;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      captureBtn.onclick = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
              type: 'image/jpeg'
            });
            
            // Create a fake event object to use with handleImageChange
            const fakeEvent = {
              target: {
                files: [file]
              }
            };
            handleImageChange(fakeEvent);
          }
        }, 'image/jpeg', 0.8);

        // Clean up
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };

      cancelBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };

      buttonContainer.appendChild(captureBtn);
      buttonContainer.appendChild(cancelBtn);
      modal.appendChild(video);
      modal.appendChild(buttonContainer);
      document.body.appendChild(modal);

    } catch (error) {
      console.error('Camera access error:', error);
      
      let errorMessage = 'Camera access denied or not available. Using file picker instead.';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access or use "Choose from PC" instead.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device. Using file picker instead.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported on this device. Using file picker instead.';
      }
      
      setError(errorMessage);
      
      // Fallback to file input
      setTimeout(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e) => {
          if (e.target.files && e.target.files[0]) {
            handleImageChange(e);
          }
        };
        input.click();
      }, 1000); // Small delay to show error message
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    // Client-side validation
    let validationError = '';
    
    if (mode === 'add_restaurant') {
      if (!formData.requesterName && !formData.name) {
        validationError = 'Missing required fields: Name is required';
      } else if (!formData.requesterEmail && !formData.email) {
        validationError = 'Missing required fields: Email is required';
      } else if (!formData.restaurantName) {
        validationError = 'Missing required fields: Restaurant name is required';
      }
    } else {
      if (!formData.name) {
        validationError = 'Missing required fields: Name is required';
      } else if (!formData.email) {
        validationError = 'Missing required fields: Email is required';
      } else if (!formData.message) {
        validationError = 'Missing required fields: Message is required';
      }
    }

    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add images to FormData
      images.forEach((imageObj, index) => {
        formDataToSend.append('images', imageObj.file);
      });

      let payload;
      if (mode === 'add_restaurant') {
        payload = {
          type: 'add_restaurant',
          requesterName: formData.requesterName || formData.name,
          requesterEmail: formData.requesterEmail || formData.email,
          restaurantName: formData.restaurantName,
          city: formData.city,
          address: formData.address,
          phone: formData.phone,
          website: formData.website,
          kashrus: formData.kashrus,
          details: formData.details,
        };
      } else {
        payload = {
          type: 'question',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        };
      }

      // Add payload data to FormData
      Object.keys(payload).forEach(key => {
        formDataToSend.append(key, payload[key]);
      });

      console.log('Sending payload:', payload);
      console.log('Images to send:', images.length);
      
      // Debug: Log all FormData entries
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
      
      await api.post('/contact', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const imageText = images.length > 0 ? ` with ${images.length} image${images.length > 1 ? 's' : ''}` : '';
      setSuccess(mode === 'add_restaurant' 
        ? `✅ Your restaurant request was sent successfully${imageText}.` 
        : `✅ Your question was sent successfully${imageText}.`);
      resetForm();
    } catch (err) {
      console.error('Contact submit error:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      
      let errorMessage = '❌ There was a server connection error.';
      
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 400) {
          errorMessage = data?.error || '❌ Invalid form data. Please check your inputs.';
        } else if (status === 413) {
          errorMessage = '❌ File too large. Please reduce image size.';
        } else if (status === 500) {
          errorMessage = '❌ Server error. Please try again later.';
        } else if (data?.error) {
          errorMessage = `❌ ${data.error}`;
        } else {
          errorMessage = `❌ Server error (${status}): ${err.response.statusText}`;
        }
      } else if (err.request) {
        // Network error
        errorMessage = '❌ Network error. Please check your internet connection.';
      } else {
        // Other error
        errorMessage = `❌ Error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact" className={styles.wrapper}>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Choose between sending a question or a restaurant addition request.
          </p>

          <div className={styles.row} style={{ marginBottom: 16 }}>
            <button
              type="button"
              className={styles.button}
              style={{ opacity: mode === 'question' ? 1 : 0.6 }}
              onClick={() => setMode('question')}
            >
              Ask a Question
            </button>
            <button
              type="button"
              className={styles.button}
              style={{ opacity: mode === 'add_restaurant' ? 1 : 0.6 }}
              onClick={() => setMode('add_restaurant')}
            >
              Request Restaurant Addition
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {mode === 'question' ? (
              <>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="name" className={styles.label} style={{ color: '#459BAC', fontWeight: '600' }}>Full Name *</label>
                    <input name="name" id="name" type="text" value={formData.name} onChange={handleChange} required className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="email" className={styles.label} style={{ color: '#459BAC', fontWeight: '600' }}>Email *</label>
                    <input name="email" id="email" type="email" value={formData.email} onChange={handleChange} required className={styles.input} />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="phone" className={styles.label}>Phone</label>
                  <input name="phone" id="phone" type="text" value={formData.phone} onChange={handleChange} className={styles.input} />
                </div>

                <div className={styles.field}>
                  <label htmlFor="subject" className={styles.label}>Subject</label>
                  <input name="subject" id="subject" type="text" value={formData.subject} onChange={handleChange} className={styles.input} />
                </div>

                <div className={styles.field}>
                  <label htmlFor="message" className={styles.label} style={{ color: '#459BAC', fontWeight: '600' }}>Message *</label>
                  <textarea name="message" id="message" rows="5" value={formData.message} onChange={handleChange} className={styles.textarea} required />
                </div>
              </>
            ) : (
              <>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="requesterName" className={styles.label} style={{ color: '#459BAC', fontWeight: '600' }}>Your Name *</label>
                    <input name="requesterName" id="requesterName" type="text" value={formData.requesterName} onChange={handleChange} required className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="requesterEmail" className={styles.label} style={{ color: '#459BAC', fontWeight: '600' }}>Your Email *</label>
                    <input name="requesterEmail" id="requesterEmail" type="email" value={formData.requesterEmail} onChange={handleChange} required className={styles.input} />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="restaurantName" className={styles.label} style={{ color: '#459BAC', fontWeight: '600' }}>Restaurant Name *</label>
                  <input name="restaurantName" id="restaurantName" type="text" value={formData.restaurantName} onChange={handleChange} required className={styles.input} />
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="city" className={styles.label}>City</label>
                    <input name="city" id="city" type="text" value={formData.city} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="address" className={styles.label}>Address</label>
                    <input name="address" id="address" type="text" value={formData.address} onChange={handleChange} className={styles.input} />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="phone" className={styles.label}>Phone</label>
                    <input name="phone" id="phone" type="text" value={formData.phone} onChange={handleChange} className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="website" className={styles.label}>Website</label>
                    <input name="website" id="website" type="url" value={formData.website} onChange={handleChange} className={styles.input} />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="kashrus" className={styles.label}>Kashrus</label>
                  <input name="kashrus" id="kashrus" type="text" value={formData.kashrus} onChange={handleChange} className={styles.input} />
                </div>

                <div className={styles.field}>
                  <label htmlFor="details" className={styles.label}>Additional Details</label>
                  <textarea name="details" id="details" rows="5" value={formData.details} onChange={handleChange} className={styles.textarea} />
                </div>
              </>
            )}

            {/* Image Upload Section */}
            <div className={styles.imageUploadSection}>
              <label className={styles.imageUploadLabel}>Add Images (Optional)</label>
              <div className={styles.imageUploadButtons}>
                <button
                  type="button"
                  onClick={() => document.getElementById('fileInput').click()}
                  className={styles.uploadButton}
                >
                  📁 Choose from PC
                </button>
                <button
                  type="button"
                  onClick={captureImage}
                  className={styles.uploadButton}
                >
                  📷 Take Photo
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center', marginTop: '0.5rem' }}>
                {window.location.protocol === 'https:' || window.location.hostname === 'localhost' 
                  ? '✅ Camera access available' 
                  : '⚠️ Camera requires HTTPS connection'}
              </div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              
              {/* Image Previews */}
              {images.length > 0 && (
                <div className={styles.imagePreviews}>
                  {images.map((imageObj) => (
                    <div key={imageObj.id} className={styles.imagePreview}>
                      <img src={imageObj.preview} alt="Preview" className={styles.previewImage} />
                      <button
                        type="button"
                        onClick={() => removeImage(imageObj.id)}
                        className={styles.removeImageButton}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <button type="submit" disabled={loading} className={styles.sendButton}>
                {loading ? 'Sending…' : 'Send'}
              </button>
            </div>
            {success && <p className={styles.success}>{success}</p>}
            {error && <p className={styles.error}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
