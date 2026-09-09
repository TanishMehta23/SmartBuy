import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 8000, // 8-second timeout to prevent indefinite pending requests
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token if stored in sessionStorage (as fallback for cross-origin)
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('admin_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // If backend returned specific validation errors (e.g. from Zod)
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
      message = error.response.data.errors.map((e) => e.message || `${e.field}: invalid`).join(', ');
    }

    return Promise.reject({
      ...error,
      userFriendlyMessage: message,
    });
  }
);

export default api;
