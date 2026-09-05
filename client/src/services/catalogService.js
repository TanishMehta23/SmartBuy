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
    return res.data;
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
};
