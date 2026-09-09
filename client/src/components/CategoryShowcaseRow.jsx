import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, PackageOpen } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';

export const CategoryShowcaseRow = ({ category, products = [], onSeeAll }) => {
  const scrollRef = useRef(null);
  const { isPortuguese, t } = useLanguage();

  const displayName = category.id === 'all'
    ? t('allProducts') || 'All Products'
    : isPortuguese && categoryTranslations[category.name]
    ? categoryTranslations[category.name]
    : category.name;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const hasProducts = Array.isArray(products) && products.length > 0;

  return (
    <section className="relative group/section">
      {/* Category Section Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-sky-100/90 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-2 h-5 sm:h-6 bg-gradient-to-b from-cyan-500 to-sky-600 rounded-full" />
          <div className="flex items-center gap-2 sm:gap-2.5">
            <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {displayName}
            </h2>
            {hasProducts && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {products.length} {products.length === 1 ? 'item' : (isPortuguese ? 'itens' : 'items')}
              </span>
            )}
          </div>
        </div>

        {/* See All Button + Arrow navigation */}
        {hasProducts && (
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Scroll Prev/Next for desktop horizontal row */}
            {products.length > 3 && (
              <div className="hidden sm:flex items-center gap-1">
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
            )}

            <button
              type="button"
              onClick={() => onSeeAll(category.id)}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-white bg-cyan-50/80 hover:bg-cyan-100/90 dark:bg-slate-800 dark:hover:bg-slate-700 border border-cyan-200/60 dark:border-slate-700 transition-all duration-200 cursor-pointer group/btn"
            >
              <span>{t('seeAll') || 'See all'}</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Carousel Row of Products or Empty Message */}
      {hasProducts ? (
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-0.5 -mx-1 px-1"
        >
          {products.slice(0, 12).map((product) => (
            <div
              key={product.id}
              className="w-[160px] sm:w-[200px] md:w-[220px] lg:w-[230px] shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-5 px-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2.5 text-center">
          <PackageOpen className="w-4 h-4 text-slate-400 shrink-0" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {isPortuguese
              ? 'Nenhum produto disponível nesta categoria no momento.'
              : 'No products available in this category yet.'}
          </p>
        </div>
      )}
    </section>
  );
};
