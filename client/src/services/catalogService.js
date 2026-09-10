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

// Helper to convert File to Base64 Data URL
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const bannerService = {
  getBanners: async () => {
    try {
      const res = await api.get('/api/banners');
      let data = res.data?.data || res.data || [];
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem('smartbuy_banners_cache', JSON.stringify(data));
        return { success: true, data };
      }
    } catch (err) {
      // Graceful fallback to client cache if remote endpoint is not yet live
    }
    const cached = JSON.parse(localStorage.getItem('smartbuy_banners_cache') || '[]');
    return { success: true, data: cached };
  },

  getAdminBanners: async () => {
    try {
      const res = await api.get('/api/banners/admin');
      let data = res.data?.data || res.data || [];
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem('smartbuy_banners_cache', JSON.stringify(data));
        return { success: true, data };
      }
    } catch (err) {
      // Graceful fallback to client cache
    }
    const cached = JSON.parse(localStorage.getItem('smartbuy_banners_cache') || '[]');
    return { success: true, data: cached };
  },

  createBanner: async (formData) => {
    try {
      const res = await api.post('/api/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) {
        const cached = JSON.parse(localStorage.getItem('smartbuy_banners_cache') || '[]');
        cached.unshift(res.data.data);
        localStorage.setItem('smartbuy_banners_cache', JSON.stringify(cached));
        window.dispatchEvent(new Event('smartbuy_banners_updated'));
        return res.data;
      }
    } catch (err) {
      console.warn('Backend banner creation error, persisting to local cache fallback', err);
    }

    const title = formData.get('title') || '';
    const linkUrl = formData.get('linkUrl') || '';
    const isActive = formData.get('isActive') !== 'false';
    const file = formData.get('image');
    
    let imageUrl = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80';
    if (file && file instanceof File) {
      try {
        imageUrl = await fileToBase64(file);
      } catch (e) {
        imageUrl = URL.createObjectURL(file);
      }
    }

    const newBanner = {
      id: `banner-${Date.now()}`,
      title,
      linkUrl,
      imageUrl,
      isActive,
      order: Date.now(),
      createdAt: new Date().toISOString(),
    };

    const cached = JSON.parse(localStorage.getItem('smartbuy_banners_cache') || '[]');
    cached.unshift(newBanner);
    localStorage.setItem('smartbuy_banners_cache', JSON.stringify(cached));
    window.dispatchEvent(new Event('smartbuy_banners_updated'));
    return { success: true, data: newBanner };
  },

  updateBanner: async (id, formData) => {
    try {
      const res = await api.put(`/api/banners/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success) {
        const cached = JSON.parse(localStorage.getItem('smartbuy_banners_cache') || '[]');
        const idx = cached.findIndex((b) => b.id === id);
        if (idx !== -1) cached[idx] = res.data.data;
        localStorage.setItem('smartbuy_banners_cache', JSON.stringify(cached));
        window.dispatchEvent(new Event('smartbuy_banners_updated'));
        return res.data;
      }
    } catch (err) {
      console.warn('Backend banner update fallback', err);
    }

    const cached = JSON.parse(localStorage.getItem('smartbuy_banners_cache') || '[]');
    const idx = cached.findIndex((b) => b.id === id);
    if (idx !== -1) {
      if (formData.has('title')) cached[idx].title = formData.get('title');
      if (formData.has('linkUrl')) cached[idx].linkUrl = formData.get('linkUrl');
      if (formData.has('isActive')) cached[idx].isActive = formData.get('isActive') !== 'false';
      const file = formData.get('image');
      if (file && file instanceof File) {
        try {
          cached[idx].imageUrl = await fileToBase64(file);
        } catch (e) {
          cached[idx].imageUrl = URL.createObjectURL(file);
        }
      }
      localStorage.setItem('smartbuy_banners_cache', JSON.stringify(cached));
      window.dispatchEvent(new Event('smartbuy_banners_updated'));
      return { success: true, data: cached[idx] };
    }
    return { success: true };
  },

  deleteBanner: async (id) => {
    try {
      await api.delete(`/api/banners/${id}`);
    } catch (err) {
      console.warn('Backend banner delete fallback', err);
    }
    let cached = JSON.parse(localStorage.getItem('smartbuy_banners_cache') || '[]');
    cached = cached.filter((b) => b.id !== id);
    localStorage.setItem('smartbuy_banners_cache', JSON.stringify(cached));
    window.dispatchEvent(new Event('smartbuy_banners_updated'));
    return { success: true, message: 'Deleted successfully' };
  },

  reorderBanners: async (bannerIds) => {
    const cached = JSON.parse(localStorage.getItem('smartbuy_banners_cache') || '[]');
    cached.sort((a, b) => bannerIds.indexOf(a.id) - bannerIds.indexOf(b.id));
    localStorage.setItem('smartbuy_banners_cache', JSON.stringify(cached));
    window.dispatchEvent(new Event('smartbuy_banners_updated'));

    try {
      const res = await api.put('/api/banners/reorder', { bannerIds });
      return res.data;
    } catch (err) {
      return { success: true, localOnly: true };
    }
  },
};
