import api from './api';

const DEFAULT_STORE_DETAILS = {
  badgeTextEn: 'Visit Our Flagship Store in Cascais',
  badgeTextPt: 'Visite a Nossa Loja em Cascais',
  headlineEn: 'Your Smart, Premium & Fresh Supermarket',
  headlinePt: 'A Sua Experiência de Compras Inteligente & Fresca',
  descriptionEn: 'Located in the heart of Cascais, Smart Buy brings you handpicked essentials, artisanal bakery, farm-fresh produce, and daily lifestyle items with an unmatched in-store experience.',
  descriptionPt: 'Localizado no coração de Cascais, o Smart Buy oferece uma seleção rigorosa de produtos de alta qualidade, padaria artesanal, itens essenciais do dia a dia e atendimento dedicado.',
  address: 'Rua de Santa Margarida N.º 8, 2750-112 Cascais, Portugal',
  hoursEn: 'Open Daily • Closes 8:00 PM',
  hoursPt: 'Aberto Todos os Dias até às 20h00',
  phone: '+351 21 484 3122',
  mapUrl: 'https://www.google.com/maps/place/Smart+Buy+Supermercado/@38.7029,-9.4215,17z',
  photos: [
    {
      url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
      tagEn: 'Modern Aisles',
      tagPt: 'Corredores Modernos',
      captionEn: 'Spacious and organized supermarket aisles',
      captionPt: 'Corredores espaçosos e organizados',
    },
    {
      url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80',
      tagEn: 'Fresh Produce',
      tagPt: 'Hortifruti Fresco',
      captionEn: 'Daily farm-fresh fruits & organic greens',
      captionPt: 'Frutas e vegetais frescos todos os dias',
    },
    {
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      tagEn: 'Artisan Bakery',
      tagPt: 'Padaria & Confeitaria',
      captionEn: 'Fresh artisan breads and traditional pastries',
      captionPt: 'Pães quentes e pastelaria tradicional',
    },
    {
      url: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=1200&q=80',
      tagEn: 'Beverages & Cellar',
      tagPt: 'Garrafeira & Bebidas',
      captionEn: 'Fine selection of regional wines & drinks',
      captionPt: 'Grande seleção de vinhos e bebidas',
    },
  ],
};

const STORAGE_KEY = 'smartbuy_store_details';

export const storeSettingsService = {
  getStoreDetails: async () => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }
    } catch (e) {}
    return { success: true, data: DEFAULT_STORE_DETAILS };
  },

  updateStoreDetails: async (details) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
      // Dispatch storage event for live sync across open tabs
      window.dispatchEvent(new Event('store_details_updated'));
      return { success: true, data: details };
    } catch (e) {
      throw new Error('Failed to save store details locally');
    }
  },

  resetStoreDetails: async () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('store_details_updated'));
    return { success: true, data: DEFAULT_STORE_DETAILS };
  },
};
