// Utility functions for image upload functionality

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Upload a single image file to the server
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The uploaded image URL
 */
export async function uploadImage(file) {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file');
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('Image file must be smaller than 5MB');
  }

  // Create FormData for multipart upload
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE}/upload/image`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
}

/**
 * Create a preview URL for an image file
 * @param {File} file - The image file
 * @returns {string} - The preview URL
 */
export function createImagePreview(file) {
  return URL.createObjectURL(file);
}

/**
 * Revoke a preview URL to free up memory
 * @param {string} url - The preview URL to revoke
 */
export function revokeImagePreview(url) {
  URL.revokeObjectURL(url);
}

/**
 * Validate multiple image files
 * @param {FileList} files - The files to validate
 * @returns {File[]} - Array of valid files
 */
export function validateImageFiles(files) {
  const validFiles = [];
  const maxSize = 5 * 1024 * 1024; // 5MB

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (!file.type.startsWith('image/')) {
      console.warn(`File ${file.name} is not an image, skipping`);
      continue;
    }

    if (file.size > maxSize) {
      console.warn(`File ${file.name} is too large, skipping`);
      continue;
    }

    validFiles.push(file);
  }

  return validFiles;
}
