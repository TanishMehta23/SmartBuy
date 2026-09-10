import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 30000, // 30-second timeout to gracefully handle server cold starts (Render/Neon free tier)
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

// Response interceptor with 1 automatic retry on network/timeout error for idempotent GET requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Retry once for GET requests on timeout or network error
    if (
      config &&
      config.method === 'get' &&
      !config._retry &&
      (error.code === 'ECONNABORTED' || !error.response || error.response.status >= 500)
    ) {
      config._retry = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return await api(config);
      } catch (retryError) {
        error = retryError;
      }
    }

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
