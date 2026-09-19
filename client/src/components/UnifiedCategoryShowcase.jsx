import React, { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  LayoutGrid,
  Apple,
  Wheat,
  Milk,
  Wine,
  Cookie,
  Snowflake,
  Fish,
  ShoppingBasket,
  Sparkles,
  Home,
  Package,
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const categoryIconMap = {
  'All Products': LayoutGrid,
  'Fruits': Apple,
  'Vegetables': ShoppingBasket,
  'Bakery': Wheat,
  'Dairy': Milk,
  'Beverages': Wine,
  'Drinks': Wine,
  'Snacks': Cookie,
  'Frozen': Snowflake,
  'Meat': Fish,
  'Seafood': Fish,
  'Meat & Seafood': Fish,
  'Pantry': ShoppingBasket,
  'Groceries': ShoppingBasket,
  'Personal Care': Sparkles,
  'Beauty': Sparkles,
  'Health': Sparkles,
  'Household': Home,
  'Electronics': Package,
  'Clothing': Package,
  'Toys': Package,
  'Other': Package,
};

const categoryColorMap = {
  'All Products': {
    activeGrad: 'from-cyan-500 to-blue-600 shadow-cyan-500/30 text-white ring-cyan-400/40',
    idleBg: 'bg-gradient-to-br from-cyan-50 to-blue-50/80 dark:from-cyan-950/40 dark:to-blue-950/30 border-cyan-200/80 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-md group-hover:shadow-cyan-500/15',
    activeText: 'text-cyan-700 dark:text-cyan-300 font-extrabold',
    activePill: 'bg-cyan-50/90 dark:bg-cyan-950/50 ring-1 ring-cyan-200 dark:ring-cyan-800',
  },
  'Bakery': {
    activeGrad: 'from-amber-500 to-orange-600 shadow-amber-500/30 text-white ring-amber-400/40',
    idleBg: 'bg-gradient-to-br from-amber-50 to-orange-50/80 dark:from-amber-950/40 dark:to-orange-950/30 border-amber-200/80 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 group-hover:border-amber-400 group-hover:shadow-md group-hover:shadow-amber-500/15',
    activeText: 'text-amber-700 dark:text-amber-300 font-extrabold',
    activePill: 'bg-amber-50/90 dark:bg-amber-950/50 ring-1 ring-amber-200 dark:ring-amber-800',
  },
  'Dairy': {
    activeGrad: 'from-blue-500 to-indigo-600 shadow-blue-500/30 text-white ring-blue-400/40',
    idleBg: 'bg-gradient-to-br from-blue-50 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/30 border-blue-200/80 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 group-hover:border-blue-400 group-hover:shadow-md group-hover:shadow-blue-500/15',
    activeText: 'text-blue-700 dark:text-blue-300 font-extrabold',
    activePill: 'bg-blue-50/90 dark:bg-blue-950/50 ring-1 ring-blue-200 dark:ring-blue-800',
  },
  'Electronics': {
    activeGrad: 'from-purple-500 to-indigo-600 shadow-purple-500/30 text-white ring-purple-400/40',
    idleBg: 'bg-gradient-to-br from-purple-50 to-indigo-50/80 dark:from-purple-950/40 dark:to-indigo-950/30 border-purple-200/80 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 group-hover:border-purple-400 group-hover:shadow-md group-hover:shadow-purple-500/15',
    activeText: 'text-purple-700 dark:text-purple-300 font-extrabold',
    activePill: 'bg-purple-50/90 dark:bg-purple-950/50 ring-1 ring-purple-200 dark:ring-purple-800',
  },
  'Drinks': {
    activeGrad: 'from-rose-500 to-pink-600 shadow-rose-500/30 text-white ring-rose-400/40',
    idleBg: 'bg-gradient-to-br from-rose-50 to-pink-50/80 dark:from-rose-950/40 dark:to-pink-950/30 border-rose-200/80 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 group-hover:border-rose-400 group-hover:shadow-md group-hover:shadow-rose-500/15',
    activeText: 'text-rose-700 dark:text-rose-300 font-extrabold',
    activePill: 'bg-rose-50/90 dark:bg-rose-950/50 ring-1 ring-rose-200 dark:ring-rose-800',
  },
  'Beverages': {
    activeGrad: 'from-rose-500 to-pink-600 shadow-rose-500/30 text-white ring-rose-400/40',
    idleBg: 'bg-gradient-to-br from-rose-50 to-pink-50/80 dark:from-rose-950/40 dark:to-pink-950/30 border-rose-200/80 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 group-hover:border-rose-400 group-hover:shadow-md group-hover:shadow-rose-500/15',
    activeText: 'text-rose-700 dark:text-rose-300 font-extrabold',
    activePill: 'bg-rose-50/90 dark:bg-rose-950/50 ring-1 ring-rose-200 dark:ring-rose-800',
  },
  'Fruits': {
    activeGrad: 'from-emerald-500 to-teal-600 shadow-emerald-500/30 text-white ring-emerald-400/40',
    idleBg: 'bg-gradient-to-br from-emerald-50 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/30 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 group-hover:border-emerald-400 group-hover:shadow-md group-hover:shadow-emerald-500/15',
    activeText: 'text-emerald-700 dark:text-emerald-300 font-extrabold',
    activePill: 'bg-emerald-50/90 dark:bg-emerald-950/50 ring-1 ring-emerald-200 dark:ring-emerald-800',
  },
  'Snacks': {
    activeGrad: 'from-amber-500 to-yellow-600 shadow-amber-500/30 text-white ring-amber-400/40',
    idleBg: 'bg-gradient-to-br from-amber-50 to-yellow-50/80 dark:from-amber-950/40 dark:to-yellow-950/30 border-amber-200/80 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 group-hover:border-amber-400 group-hover:shadow-md group-hover:shadow-amber-500/15',
    activeText: 'text-amber-700 dark:text-amber-300 font-extrabold',
    activePill: 'bg-amber-50/90 dark:bg-amber-950/50 ring-1 ring-amber-200 dark:ring-amber-800',
  },
  'Vegetables': {
    activeGrad: 'from-green-500 to-emerald-600 shadow-green-500/30 text-white ring-green-400/40',
    idleBg: 'bg-gradient-to-br from-green-50 to-emerald-50/80 dark:from-green-950/40 dark:to-emerald-950/30 border-green-200/80 dark:border-green-800/60 text-green-600 dark:text-green-400 group-hover:border-green-400 group-hover:shadow-md group-hover:shadow-green-500/15',
    activeText: 'text-green-700 dark:text-green-300 font-extrabold',
    activePill: 'bg-green-50/90 dark:bg-green-950/50 ring-1 ring-green-200 dark:ring-green-800',
  },
  'Seafood': {
    activeGrad: 'from-teal-500 to-cyan-600 shadow-teal-500/30 text-white ring-teal-400/40',
    idleBg: 'bg-gradient-to-br from-teal-50 to-cyan-50/80 dark:from-teal-950/40 dark:to-cyan-950/30 border-teal-200/80 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 group-hover:border-teal-400 group-hover:shadow-md group-hover:shadow-teal-500/15',
    activeText: 'text-teal-700 dark:text-teal-300 font-extrabold',
    activePill: 'bg-teal-50/90 dark:bg-teal-950/50 ring-1 ring-teal-200 dark:ring-teal-800',
  },
  'Meat': {
    activeGrad: 'from-red-500 to-rose-600 shadow-red-500/30 text-white ring-red-400/40',
    idleBg: 'bg-gradient-to-br from-red-50 to-rose-50/80 dark:from-red-950/40 dark:to-rose-950/30 border-red-200/80 dark:border-red-800/60 text-red-600 dark:text-red-400 group-hover:border-red-400 group-hover:shadow-md group-hover:shadow-red-500/15',
    activeText: 'text-red-700 dark:text-red-300 font-extrabold',
    activePill: 'bg-red-50/90 dark:bg-red-950/50 ring-1 ring-red-200 dark:ring-red-800',
  },
  'Personal Care': {
    activeGrad: 'from-fuchsia-500 to-pink-600 shadow-fuchsia-500/30 text-white ring-fuchsia-400/40',
    idleBg: 'bg-gradient-to-br from-fuchsia-50 to-pink-50/80 dark:from-fuchsia-950/40 dark:to-pink-950/30 border-fuchsia-200/80 dark:border-fuchsia-800/60 text-fuchsia-600 dark:text-fuchsia-400 group-hover:border-fuchsia-400 group-hover:shadow-md group-hover:shadow-fuchsia-500/15',
    activeText: 'text-fuchsia-700 dark:text-fuchsia-300 font-extrabold',
    activePill: 'bg-fuchsia-50/90 dark:bg-fuchsia-950/50 ring-1 ring-fuchsia-200 dark:ring-fuchsia-800',
  },
  'Household': {
    activeGrad: 'from-indigo-500 to-violet-600 shadow-indigo-500/30 text-white ring-indigo-400/40',
    idleBg: 'bg-gradient-to-br from-indigo-50 to-violet-50/80 dark:from-indigo-950/40 dark:to-violet-950/30 border-indigo-200/80 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 group-hover:border-indigo-400 group-hover:shadow-md group-hover:shadow-indigo-500/15',
    activeText: 'text-indigo-700 dark:text-indigo-300 font-extrabold',
    activePill: 'bg-indigo-50/90 dark:bg-indigo-950/50 ring-1 ring-indigo-200 dark:ring-indigo-800',
  },
  'Other': {
    activeGrad: 'from-slate-600 to-slate-800 shadow-slate-500/30 text-white ring-slate-400/40',
    idleBg: 'bg-gradient-to-br from-slate-100 to-slate-200/80 dark:from-slate-800 dark:to-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 group-hover:border-slate-400 group-hover:shadow-md',
    activeText: 'text-slate-800 dark:text-slate-200 font-extrabold',
    activePill: 'bg-slate-100 dark:bg-slate-800',
  },
};

const defaultColor = {
  activeGrad: 'from-cyan-500 to-blue-600 shadow-cyan-500/30 text-white ring-cyan-400/40',
  idleBg: 'bg-gradient-to-br from-cyan-50 to-sky-50/80 dark:from-cyan-950/40 dark:to-sky-950/30 border-cyan-200/80 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-md',
  activeText: 'text-cyan-700 dark:text-cyan-300 font-extrabold',
  activePill: 'bg-cyan-50/90 dark:bg-cyan-950/50 ring-1 ring-cyan-200 dark:ring-cyan-800',
};

const getCategoryColors = (name) => {
  return categoryColorMap[name] || defaultColor;
};

const getCategoryIcon = (name) => {
  return categoryIconMap[name] || Package;
};

/**
 * Unified and Merged Category Showcase Component
 * Seamlessly integrates the Category Icons Filter Navigation Bar with the
 * Live Featured Products Carousel into one unified, elegant, and interactive card.
 */
export const UnifiedCategoryShowcase = ({
  categories = [],
  products = [],
  selectedCategoryId = 'all',
  onSelectCategory,
  onSeeAll,
  onSelectProduct,
}) => {
  const categoryScrollRef = useRef(null);
  const productScrollRef = useRef(null);
  const { isPortuguese, t } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.08 });

  const activeCategory = selectedCategoryId;

  // Filter products based on active category
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.categoryId === activeCategory);

  const handleCategoryScroll = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 220;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleProductScroll = (direction) => {
    if (productScrollRef.current) {
      const scrollAmount = productScrollRef.current.clientWidth * 0.75;
      productScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getCategoryDisplayName = (cat) => {
    return isPortuguese && categoryTranslations[cat.name]
      ? categoryTranslations[cat.name]
      : cat.name;
  };

  const allItem = { id: 'all', name: 'All Products' };
  const items = [allItem, ...categories];

  const currentCategoryObj = categories.find((c) => c.id === activeCategory);
  const currentCategoryName = activeCategory === 'all'
    ? (isPortuguese ? 'Todos os Produtos' : 'All Products')
    : currentCategoryObj
      ? getCategoryDisplayName(currentCategoryObj)
      : (t('categoryProducts') || 'Category');

  const ActiveIcon = activeCategory === 'all'
    ? LayoutGrid
    : getCategoryIcon(currentCategoryObj?.name);

  const activeColors = getCategoryColors(currentCategoryObj?.name || 'All Products');

  return (
    <section
      ref={sectionRef}
      className={`w-full animate-on-scroll ${isVisible ? 'animate-fade-in-up' : ''}`}
    >
      {/* Merged, Unified Container with Clean Visual Hierarchy */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sky-100/90 dark:border-slate-800 shadow-md shadow-sky-950/5 dark:shadow-slate-950/40 overflow-hidden transition-all">
        
        {/* ========================================================= */}
        {/* UPPER TIER: Interactive Category Icon Filter Carousel */}
        {/* ========================================================= */}
        <div className="relative py-4 px-2 sm:px-4 border-b border-sky-100/80 dark:border-slate-800/80 bg-gradient-to-b from-sky-50/30 to-white/50 dark:from-slate-800/20 dark:to-slate-900/50">
          {/* Scroll Navigation Arrows */}
          <button
            type="button"
            onClick={() => handleCategoryScroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-all hover:scale-110 active:scale-95 hidden sm:flex"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            type="button"
            onClick={() => handleCategoryScroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-all hover:scale-110 active:scale-95 hidden sm:flex"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Scrollable Category Icons Track */}
          <div
            ref={categoryScrollRef}
            className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth px-2 sm:px-10 py-1"
          >
            {items.map((category) => {
              const isAll = category.id === 'all';
              const isActive = isAll
                ? activeCategory === 'all'
                : activeCategory === category.id;

              const Icon = getCategoryIcon(category.name);
              const colors = getCategoryColors(category.name);

              const displayName = isAll
                ? (t('allProducts') || 'All')
                : isPortuguese && categoryTranslations[category.name]
                  ? categoryTranslations[category.name]
                  : category.name;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelectCategory?.(category.id)}
                  className="flex flex-col items-center gap-1.5 min-w-[70px] sm:min-w-[80px] py-1.5 px-2 rounded-2xl cursor-pointer transition-all duration-200 group shrink-0 relative"
                >
                  {/* Category Circle Icon */}
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-br ${colors.activeGrad} shadow-lg ring-3 sm:ring-4 scale-105`
                        : `${colors.idleBg} border group-hover:scale-105 group-hover:shadow-sm`
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                  </div>

                  {/* Category Label */}
                  <span
                    className={`text-[11px] sm:text-xs font-bold text-center leading-tight truncate max-w-[72px] sm:max-w-[80px] transition-colors ${
                      isActive
                        ? colors.activeText
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100'
                    }`}
                  >
                    {displayName}
                  </span>

                  {/* Active Indicator Underline Bar */}
                  {isActive && (
                    <span className="w-5 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 animate-fade-in" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* LOWER TIER: Live Dynamic Product Showcase Carousel */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-6 lg:p-7">
          {/* Sub-Header: Active Category Title + Controls */}
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
            {/* Title & Active Category Icon Badge */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${activeColors.activeGrad} text-white flex items-center justify-center shadow-md shrink-0 transition-all duration-300`}
              >
                <ActiveIcon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                    {currentCategoryName}
                  </h2>
                  <span className="hidden md:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60">
                    {t('itemsCount', { count: filteredProducts.length })}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                  {activeCategory === 'all'
                    ? (isPortuguese ? 'Selecionados especialmente para si em todas as categorias' : 'Handpicked selection across all categories')
                    : (isPortuguese ? `Destaques frescos da categoria ${currentCategoryName}` : `Top items available in ${currentCategoryName}`)}
                </p>
              </div>
            </div>

            {/* Carousel Arrows + See All Action */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleProductScroll('left')}
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-cyan-600 transition-all cursor-pointer shadow-xs active:scale-95"
                  aria-label="Scroll products left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleProductScroll('right')}
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-cyan-600 transition-all cursor-pointer shadow-xs active:scale-95"
                  aria-label="Scroll products right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onSeeAll?.(activeCategory === 'all' ? 'all-catalog' : activeCategory)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-white bg-cyan-50/90 hover:bg-cyan-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-cyan-200/70 dark:border-slate-700 transition-all cursor-pointer group shrink-0 whitespace-nowrap shadow-2xs"
              >
                <span>{t('seeAll') || 'See all'}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Product Cards Row */}
          {filteredProducts.length > 0 ? (
            <div
              ref={productScrollRef}
              className="flex gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-0.5 -mx-1 px-1 items-stretch"
            >
              {/* Up to 8 Products */}
              {filteredProducts.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  className="w-[160px] sm:w-[195px] md:w-[215px] lg:w-[225px] shrink-0"
                >
                  <ProductCard product={product} onSelectProduct={onSelectProduct} />
                </div>
              ))}

              {/* Interactive "See More in Category" Card */}
              <div className="w-[145px] sm:w-[175px] md:w-[190px] shrink-0 flex">
                <button
                  type="button"
                  onClick={() => onSeeAll?.(activeCategory === 'all' ? 'all-catalog' : activeCategory)}
                  className="w-full h-full min-h-[220px] rounded-2xl border-2 border-dashed border-sky-300/80 dark:border-slate-700 bg-gradient-to-b from-sky-50/60 to-white/90 dark:from-slate-800/40 dark:to-slate-900/80 hover:bg-sky-100/70 dark:hover:bg-slate-800/80 hover:border-cyan-400 dark:hover:border-cyan-400 flex flex-col items-center justify-center p-4 text-center group cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-2xs hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/25 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 mb-2.5">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {t('seeAll') || 'See More'}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-tight line-clamp-2">
                    {isPortuguese
                      ? `Ver todos de ${currentCategoryName}`
                      : `Explore all in ${currentCategoryName}`}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                {isPortuguese
                  ? 'Nenhum produto disponível nesta categoria no momento.'
                  : 'No products available in this category at the moment.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
