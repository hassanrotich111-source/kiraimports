// API Service for KIRA IMPORTS Backend

const API_URL = import.meta.env.VITE_API_URL || 'https://kira-imports-backend.onrender.com/api';

// Wake up the Render backend (free tier sleeps after 15 min of inactivity)
// This sends a quick ping and waits for the backend to respond
export async function wakeUpBackend(): Promise<boolean> {
  try {
    // Try multiple times with short timeout each - Render usually wakes in 5-15 seconds
    for (let attempt = 1; attempt <= 3; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds per try
      
      try {
        const response = await fetch(`${API_URL}/ping`, {
          method: 'GET',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          console.log('Backend awake on attempt', attempt);
          return true;
        }
      } catch {
        clearTimeout(timeoutId);
        console.log('Wake-up attempt', attempt, 'failed, retrying...');
      }
    }
    return false;
  } catch {
    return false;
  }
}

// Helper for API calls with timeout
async function fetchAPI(endpoint: string, options: RequestInit = {}, timeoutMs = 30000) {
  const url = `${API_URL}${endpoint}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Auth
export const loginAdmin = (username: string, password: string) =>
  fetchAPI('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

// Cloudinary config for direct browser upload
const CLOUDINARY_CLOUD_NAME = 'dc71005wj';
const CLOUDINARY_UPLOAD_PRESET = 'kira_imports'; // unsigned upload preset

// Upload video directly to Cloudinary (fast - bypasses Render backend)
export const uploadVideo = async (file: File): Promise<{ url: string; public_id: string }> => {
  const cloudForm = new FormData();
  cloudForm.append('file', file);
  cloudForm.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes for large videos
  
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, {
      method: 'POST',
      body: cloudForm,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Cloudinary: ${data.error.message}. Check preset "kira_imports" is UNSIGNED.`);
    }
    
    if (data.secure_url) {
      return { url: data.secure_url, public_id: data.public_id };
    }
    
    throw new Error('Upload failed - no URL returned');
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Upload timed out. Video may be too large. Try under 50MB.');
    }
    throw err;
  }
};

// Images
export const getImages = () => fetchAPI('/images');

// Upload image directly to Cloudinary (fast - bypasses Render backend)
export const uploadImage = async (key: string, file: File, token: string) => {
  const cloudForm = new FormData();
  cloudForm.append('file', file);
  cloudForm.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes for large images on slow connections
  
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: cloudForm,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Cloudinary: ${data.error.message}. Check preset "kira_imports" is UNSIGNED.`);
    }
    
    if (data.secure_url) {
      // Save URL to backend (non-critical)
      fetch(`${API_URL}/images/${key}/save`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.secure_url, public_id: data.public_id }),
      }).catch(() => {});
      
      return { url: data.secure_url, public_id: data.public_id };
    }
    
    throw new Error('Upload failed - no URL returned');
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Upload timed out. Your internet may be slow or the image is too large. Try an image under 2MB.');
    }
    throw err;
  }
};

// Products
export const getProducts = () => fetchAPI('/products');

export const getProduct = (id: number) => fetchAPI(`/products/${id}`);

export const createProduct = async (data: FormData, token: string) => {
  console.log('Creating product...');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes
  
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: data,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `Failed: ${response.status}`);
    }
    return result;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out - backend may be sleeping. Try again.');
    }
    throw err;
  }
};

export const updateProduct = async (id: number, data: FormData, token: string) => {
  console.log('Updating product:', id);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes
  
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: data,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `Failed: ${response.status}`);
    }
    return result;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out - backend may be sleeping. Try again.');
    }
    throw err;
  }
};

export const deleteProduct = async (id: number, token: string) => {
  console.log('Deleting product:', id);
  
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const result = await response.json();
    console.log('Delete product response:', result);
    
    if (!response.ok) {
      throw new Error(result.error || `Failed: ${response.status}`);
    }
    
    return result;
  } catch (err) {
    console.error('Delete product error:', err);
    throw err;
  }
};

// Categories
export const getCategories = () => fetchAPI('/categories');

// Background Settings
export const getBackgroundSettings = () => fetchAPI('/background', {}, 30000);

export const saveBackgroundSettings = async (settings: any, token: string) => {
  const url = `${API_URL}/background`;
  
  console.log('Saving background settings:', settings);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
    
    const data = await response.json();
    console.log('Save background response:', data);
    
    if (!response.ok) {
      throw new Error(data.error || `Failed: ${response.status}`);
    }
    
    return data;
  } catch (err: any) {
    console.error('Save background error:', err);
    throw err;
  }
};

// Testimonials (public - no auth needed)
export const getTestimonials = () => fetchAPI('/testimonials');

export const saveTestimonials = async (testimonials: any[], token: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  
  try {
    const response = await fetch(`${API_URL}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ testimonials }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Failed: ${response.status}`);
    }
    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Try again.');
    }
    throw err;
  }
};

// Health check
export const checkHealth = () => fetchAPI('/health');
