import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Flame,
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

const categoryBadgeGradients = {
  'All Products': 'from-rose-500 via-orange-500 to-amber-500 shadow-orange-500/25',
  'Bakery': 'from-amber-500 to-orange-600 shadow-amber-500/30',
  'Dairy': 'from-blue-500 to-indigo-600 shadow-blue-500/30',
  'Electronics': 'from-purple-500 to-indigo-600 shadow-purple-500/30',
  'Drinks': 'from-rose-500 to-pink-600 shadow-rose-500/30',
  'Beverages': 'from-rose-500 to-pink-600 shadow-rose-500/30',
  'Fruits': 'from-emerald-500 to-teal-600 shadow-emerald-500/30',
  'Snacks': 'from-amber-500 to-yellow-600 shadow-amber-500/30',
  'Vegetables': 'from-green-500 to-emerald-600 shadow-green-500/30',
  'Seafood': 'from-teal-500 to-cyan-600 shadow-teal-500/30',
  'Meat': 'from-red-500 to-rose-600 shadow-red-500/30',
  'Meat & Seafood': 'from-teal-500 to-cyan-600 shadow-teal-500/30',
  'Personal Care': 'from-fuchsia-500 to-pink-600 shadow-fuchsia-500/30',
  'Household': 'from-indigo-500 to-violet-600 shadow-indigo-500/30',
  'Other': 'from-slate-600 to-slate-800 shadow-slate-500/30',
};

/**
 * Featured Products Section with inline category filter tabs.
 * Replaces the old "All Products" showcase row with a richer layout.
 */
export const FeaturedProductsSection = ({
  categories = [],
  products = [],
  activeCategory = 'all',
  onSeeAll,
}) => {
  const activeTab = activeCategory;
  const scrollRef = useRef(null);
  const { isPortuguese, t } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.08 });

  // Filter products based on active category
  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter((p) => p.categoryId === activeTab);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
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

  const currentCategoryObj = categories.find((c) => c.id === activeTab);
  const currentCategoryName = activeTab === 'all'
    ? (isPortuguese ? 'Todos os Produtos' : 'All Products')
    : currentCategoryObj
    ? getCategoryDisplayName(currentCategoryObj)
    : (t('categoryProducts') || 'Category');

  const IconComponent = activeTab === 'all'
    ? LayoutGrid
    : categoryIconMap[currentCategoryObj?.name] || Package;

  const badgeGradient = activeTab === 'all'
    ? 'from-cyan-500 to-blue-600 shadow-cyan-500/25'
    : categoryBadgeGradients[currentCategoryObj?.name] || 'from-cyan-500 to-blue-600 shadow-cyan-500/25';

  return (
    <section
      ref={sectionRef}
      className={`animate-on-scroll ${isVisible ? 'animate-fade-in-up' : ''}`}
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border border-sky-100/90 dark:border-slate-800 shadow-xs hover:shadow-soft dark:hover:shadow-slate-950/30 transition-all">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2.5 mb-3 sm:mb-4">
          {/* Title & Icon */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${badgeGradient} text-white flex items-center justify-center shadow-md shrink-0 transition-all duration-300`}>
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                {currentCategoryName}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                {activeTab === 'all'
                  ? (isPortuguese ? 'Selecionados especialmente para si' : 'Handpicked selection across all categories')
                  : (isPortuguese ? `Destaques de ${currentCategoryName}` : `Top items in ${currentCategoryName}`)}
              </p>
            </div>
          </div>

          {/* Desktop scroll arrows + See all button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-all active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-all active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onSeeAll(activeTab === 'all' ? 'all-catalog' : activeTab)}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-white bg-cyan-50/80 hover:bg-cyan-100/90 dark:bg-slate-800 dark:hover:bg-slate-700 border border-cyan-200/60 dark:border-slate-700 transition-all duration-200 cursor-pointer group/btn shrink-0 whitespace-nowrap shadow-2xs"
            >
              <span>{t('seeAll') || 'See all'}</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* 8 Scrolling Products + See More Interactive Card */}
        {filteredProducts.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-0.5 -mx-1 px-1 items-stretch"
          >
            {/* Up to 8 Products */}
            {filteredProducts.slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="w-[160px] sm:w-[200px] md:w-[220px] lg:w-[230px] shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}

            {/* "See More" Interactive Card at end of scroll list */}
            <div className="w-[150px] sm:w-[180px] md:w-[200px] shrink-0 flex">
              <button
                type="button"
                onClick={() => onSeeAll(activeTab === 'all' ? 'all-catalog' : activeTab)}
                className="w-full h-full min-h-[220px] rounded-2xl border-2 border-dashed border-sky-300/80 dark:border-slate-700 bg-gradient-to-b from-sky-50/60 to-white/90 dark:from-slate-800/40 dark:to-slate-900/80 hover:bg-sky-100/70 dark:hover:bg-slate-800/80 hover:border-cyan-400 dark:hover:border-cyan-400 flex flex-col items-center justify-center p-4 text-center group cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-2xs hover:shadow-md"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/25 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 mb-2.5">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {t('seeAll') || 'See More'}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-tight line-clamp-2">
                  {isPortuguese
                    ? `Ver todos de ${currentCategoryName}`
                    : `Explore all in ${currentCategoryName}`}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {isPortuguese
                ? 'Nenhum produto disponível nesta categoria.'
                : 'No products available in this category.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
