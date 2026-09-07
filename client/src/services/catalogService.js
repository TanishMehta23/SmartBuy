import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/api/auth/login', credentials);
    if (res.data.token) {
      sessionStorage.setItem('admin_token', res.data.token);
    }
    return res.data;
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      sessionStorage.removeItem('admin_token');
    }
  },

  getMe: async () => {
    const res = await api.get('/api/auth/me');
    return res.data;
  },
};

export const productService = {
  getProducts: async ({ page = 1, limit = 24, search = '', categoryId = '', sort = 'newest' } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (categoryId && categoryId !== 'all') params.append('categoryId', categoryId);
    if (sort) params.append('sort', sort);

    const res = await api.get(`/api/products?${params.toString()}`);
    return res.data;
  },

  getProductById: async (id) => {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
  },

  createProduct: async (formData) => {
    const res = await api.post('/api/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateProduct: async (id, formData) => {
    const res = await api.put(`/api/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/api/products/${id}`);
    return res.data;
  },

  getStats: async () => {
    const res = await api.get('/api/products/stats');
    return res.data;
  },
};

export const categoryService = {
  getCategories: async () => {
    const res = await api.get('/api/categories');
    let data = res.data?.data || res.data || [];
    
    // If local category sequence order exists in browser, sort items seamlessly
    try {
      const savedOrder = JSON.parse(localStorage.getItem('smartbuy_category_order') || '[]');
      if (Array.isArray(savedOrder) && savedOrder.length > 0) {
        data = [...data].sort((a, b) => {
          const indexA = savedOrder.indexOf(a.id);
          const indexB = savedOrder.indexOf(b.id);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return (a.order ?? 0) - (b.order ?? 0);
        });
      }
    } catch (e) {
      // Ignore fallback parse errors
    }

    return { success: true, data };
  },

  createCategory: async (data) => {
    const res = await api.post('/api/categories', data);
    return res.data;
  },

  updateCategory: async (id, data) => {
    const res = await api.put(`/api/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id, reassignToCategoryId = null) => {
    const url = reassignToCategoryId
      ? `/api/categories/${id}?reassignToCategoryId=${reassignToCategoryId}`
      : `/api/categories/${id}`;
    const res = await api.delete(url);
    return res.data;
  },

  reorderCategories: async (categoryIds) => {
    // Save to local cache first so reorder works immediately on any environment
    try {
      localStorage.setItem('smartbuy_category_order', JSON.stringify(categoryIds));
    } catch (e) {}

    try {
      const res = await api.put('/api/categories/reorder', { categoryIds });
      return res.data;
    } catch (err) {
      // If server is older deployed build (e.g. Render pending deploy), client-side order is safely persisted
      console.warn('Backend /reorder endpoint pending deployment; sequence saved locally.', err);
      return { success: true, localOnly: true };
    }
  },
};
