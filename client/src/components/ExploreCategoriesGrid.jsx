import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Apple, Wheat, Milk, Wine, Cookie, Sparkles, Home, ArrowRight, ShoppingBasket, Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const categoryVisuals = {
  'Eatables & Pantry': {
    icon: ShoppingBasket,
    image: '/store_aisles.jpg',
    gradient: 'from-amber-900/90 via-yellow-900/75 to-amber-950/95',
    descEn: 'Pantry essentials, artisanal pasta, premium olive oils & grains',
    descPt: 'Essenciais de despensa, massas artesanais, azeites e cereais',
    accent: 'text-amber-300',
  },
  'Bathroom & Hygiene': {
    icon: Sparkles,
    image: '/promo_premium.jpg',
    gradient: 'from-teal-900/90 via-cyan-900/75 to-teal-950/95',
    descEn: 'Personal hygiene, luxury body care, soaps & bathroom essentials',
    descPt: 'Higiene pessoal, cuidados corporais, sabonetes e essenciais de banho',
    accent: 'text-cyan-300',
  },
  'Makeup & Beauty': {
    icon: Sparkles,
    image: '/promo_premium.jpg',
    gradient: 'from-fuchsia-900/90 via-pink-900/75 to-fuchsia-950/95',
    descEn: 'Cosmetics, skincare serums, lipsticks & beauty accessories',
    descPt: 'Cosméticos, séruns para a pele, batons e acessórios de beleza',
    accent: 'text-fuchsia-300',
  },
  'Fresh Fruits': {
    icon: Apple,
    image: '/promo_local.jpg',
    gradient: 'from-emerald-900/90 via-teal-900/75 to-emerald-950/95',
    descEn: 'Daily handpicked farm-fresh fruits & sweet seasonal picks',
    descPt: 'Frutas frescas da época e seleção biológica diária',
    accent: 'text-emerald-300',
  },
  'Fresh Vegetables': {
    icon: ShoppingBasket,
    image: '/store_produce.jpg',
    gradient: 'from-green-900/90 via-emerald-900/75 to-green-950/95',
    descEn: 'Crisp seasonal vegetables, roots, fresh greens & herbs',
    descPt: 'Legumes crocantes, tubérculos, saladas e ervas aromáticas',
    accent: 'text-green-300',
  },
  'Artisan Bakery': {
    icon: Wheat,
    image: '/store_bakery.jpg',
    gradient: 'from-amber-900/90 via-orange-900/75 to-amber-950/95',
    descEn: 'Fresh artisan sourdough breads, pastries & Portuguese treats',
    descPt: 'Pão quente artesanal, pastelaria tradicional e broas',
    accent: 'text-amber-300',
  },
  'Dairy & Eggs': {
    icon: Milk,
    image: '/promo_essentials.jpg',
    gradient: 'from-blue-900/90 via-indigo-900/75 to-blue-950/95',
    descEn: 'Regional farm milks, artisanal cheeses, yogurts & fresh eggs',
    descPt: 'Leites regionais, queijos artesanais, iogurtes e ovos frescos',
    accent: 'text-blue-300',
  },
  'Drinks & Beverages': {
    icon: Wine,
    image: '/store_cellar.jpg',
    gradient: 'from-rose-900/90 via-pink-900/75 to-rose-950/95',
    descEn: 'Portuguese fine wines, cold brews, natural juices & sparkling waters',
    descPt: 'Vinhos portugueses selecionados, sumos naturais e águas',
    accent: 'text-rose-300',
  },
  'Snacks & Sweets': {
    icon: Cookie,
    image: '/promo_essentials.jpg',
    gradient: 'from-amber-900/90 via-yellow-900/75 to-amber-950/95',
    descEn: 'Roasted nuts, dark chocolates, artisanal biscuits & crunchy chips',
    descPt: 'Frutos secos, chocolates negros, bolachas artesanais e aperitivos',
    accent: 'text-amber-300',
  },
  'Household & Cleaning': {
    icon: Home,
    image: '/store_aisles.jpg',
    gradient: 'from-indigo-900/90 via-violet-900/75 to-indigo-950/95',
    descEn: 'Eco-friendly cleaning supplies, fragrances & home care essentials',
    descPt: 'Produtos de limpeza ecológicos, ambientadores e utilidades',
    accent: 'text-indigo-300',
  },
  Fruits: {
    icon: Apple,
    image: '/promo_local.jpg',
    gradient: 'from-emerald-900/90 via-teal-900/75 to-emerald-950/95',
    descEn: 'Daily handpicked farm-fresh fruits & organic greens',
    descPt: 'Frutas frescas da época e produtos hortícolas selecionados',
    accent: 'text-emerald-300',
  },
  Vegetables: {
    icon: ShoppingBasket,
    image: '/store_produce.jpg',
    gradient: 'from-green-900/90 via-emerald-900/75 to-green-950/95',
    descEn: 'Crisp seasonal vegetables, roots, salads & fresh herbs',
    descPt: 'Legumes crocantes, tubérculos, saladas e ervas aromáticas',
    accent: 'text-green-300',
  },
  Bakery: {
    icon: Wheat,
    image: '/store_bakery.jpg',
    gradient: 'from-amber-900/90 via-orange-900/75 to-amber-950/95',
    descEn: 'Fresh artisan breads, morning pastries & Portuguese sweets',
    descPt: 'Pão quente artesanal, pastelaria tradicional e broas',
    accent: 'text-amber-300',
  },
  Dairy: {
    icon: Milk,
    image: '/promo_essentials.jpg',
    gradient: 'from-blue-900/90 via-indigo-900/75 to-blue-950/95',
    descEn: 'Regional milks, artisanal cheeses, yogurts & farm eggs',
    descPt: 'Leites regionais, queijos artesanais, iogurtes e ovos frescos',
    accent: 'text-blue-300',
  },
  Drinks: {
    icon: Wine,
    image: '/store_cellar.jpg',
    gradient: 'from-rose-900/90 via-pink-900/75 to-rose-950/95',
    descEn: 'Fine Portuguese wines, craft beers, juices & refreshments',
    descPt: 'Vinhos portugueses selecionados, sumos naturais e bebidas',
    accent: 'text-rose-300',
  },
  Beverages: {
    icon: Wine,
    image: '/store_cellar.jpg',
    gradient: 'from-rose-900/90 via-pink-900/75 to-rose-950/95',
    descEn: 'Fine Portuguese wines, craft beers, juices & refreshments',
    descPt: 'Vinhos portugueses selecionados, sumos naturais e bebidas',
    accent: 'text-rose-300',
  },
  Snacks: {
    icon: Cookie,
    image: '/promo_essentials.jpg',
    gradient: 'from-amber-900/90 via-yellow-900/75 to-amber-950/95',
    descEn: 'Artisan biscuits, dried fruits, savory crisps & chocolates',
    descPt: 'Bolachas artesanais, frutos secos, aperitivos e chocolates',
    accent: 'text-amber-300',
  },
  'Personal Care': {
    icon: Sparkles,
    image: '/promo_premium.jpg',
    gradient: 'from-fuchsia-900/90 via-purple-900/75 to-fuchsia-950/95',
    descEn: 'Gentle soaps, premium hair care, beauty & skin wellness',
    descPt: 'Higiene pessoal, cuidados capilares e bem-estar',
    accent: 'text-fuchsia-300',
  },
  Household: {
    icon: Home,
    image: '/store_aisles.jpg',
    gradient: 'from-indigo-900/90 via-violet-900/75 to-indigo-950/95',
    descEn: 'Eco-friendly cleaning, kitchen supplies & everyday home items',
    descPt: 'Produtos de limpeza, utilidades domésticas e cozinha',
    accent: 'text-indigo-300',
  },
};

const defaultVisual = {
  icon: Package,
  image: '/store_aisles.jpg',
  gradient: 'from-slate-900/90 via-cyan-950/80 to-slate-950/95',
  descEn: 'Quality supermarket products across all departments',
  descPt: 'Produtos de supermercado de qualidade em todos os departamentos',
  accent: 'text-cyan-300',
};

const slugify = (text) =>
  text
    ? text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    : '';

export const ExploreCategoriesGrid = ({ categories = [], onSelectCategory }) => {
  const navigate = useNavigate();
  const { t, isPortuguese } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const handleCardClick = (cat) => {
    const slug = slugify(cat.name);
    if (onSelectCategory) {
      onSelectCategory(cat.id);
    } else {
      navigate(`/category/${slug}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!categories || categories.length === 0) return null;

  // Display top 4 prominent categories in a balanced 2x2 grid
  const displayCategories = categories.slice(0, 4);

  return (
    <section ref={ref} className="my-0">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
            {t('exploreCategoriesTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {t('exploreCategoriesSubtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            navigate('/catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50/80 hover:bg-cyan-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-cyan-200/60 dark:border-slate-700 transition-all cursor-pointer group shrink-0"
        >
          <span>{t('allProducts')}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* 4-in-a-Row Categories Visual Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
        {displayCategories.map((cat, idx) => {
          const visual = categoryVisuals[cat.name] || defaultVisual;
          const Icon = visual.icon;
          const displayName = isPortuguese && categoryTranslations[cat.name]
            ? categoryTranslations[cat.name]
            : cat.name;
          const desc = isPortuguese ? visual.descPt : visual.descEn;
          const delayMs = idx * 90;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCardClick(cat)}
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 text-left text-white shadow-lg shadow-slate-900/10 dark:shadow-slate-950/40 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] group min-h-[160px] sm:min-h-[185px] md:min-h-[195px] flex flex-col justify-between border border-white/15 dark:border-slate-800 animate-on-scroll ${
                isVisible ? 'animate-fade-in-up' : ''
              }`}
              style={isVisible ? { animationDelay: `${delayMs}ms` } : undefined}
            >
              {/* Background Photographic Image */}
              <img
                src={visual.image}
                alt={displayName}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Dynamic Rich Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-tr ${visual.gradient} transition-opacity duration-300 group-hover:opacity-90`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

              {/* Top Row: Icon Badge */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                {cat._count?.products > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-xs">
                    {t('itemsCount', { count: cat._count.products })}
                  </span>
                )}
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 mt-3 sm:mt-4">
                <h3 className="text-sm sm:text-lg font-black tracking-tight text-white mb-0.5 sm:mb-1 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {displayName}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-100 font-medium mb-2.5 sm:mb-3 line-clamp-2 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] hidden xs:block">
                  {desc}
                </p>

                <span
                  className={`inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold ${visual.accent} group-hover:text-white transition-colors drop-shadow-xs`}
                >
                  <span>{t('exploreCollection')}</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
