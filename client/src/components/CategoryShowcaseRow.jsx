import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';

export const CategoryShowcaseRow = ({ category, products = [], onSeeAll }) => {
  const scrollRef = useRef(null);
  const { isPortuguese, t } = useLanguage();

  const displayName = isPortuguese && categoryTranslations[category.name]
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
      <div className="flex items-center justify-between mb-4 sm:mb-5 pb-3 border-b border-sky-100/90 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-2.5 h-6 sm:h-7 bg-gradient-to-b from-cyan-500 to-sky-600 rounded-full shadow-xs" />
          <div className="flex items-center gap-2 sm:gap-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {displayName}
            </h2>
            {hasProducts && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-cyan-300 border border-sky-200/60 dark:border-slate-700/60">
                {products.length} {products.length === 1 ? (isPortuguese ? 'item' : 'item') : (isPortuguese ? 'itens' : 'items')}
              </span>
            )}
          </div>
        </div>

        {/* See All Button + Arrow navigation */}
        {hasProducts && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Scroll Prev/Next for desktop horizontal row */}
            {products.length > 3 && (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-sky-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-400 hover:bg-sky-50/50 shadow-xs cursor-pointer transition-all duration-200 active:scale-95"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-sky-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-400 hover:bg-sky-50/50 shadow-xs cursor-pointer transition-all duration-200 active:scale-95"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => onSeeAll(category.id)}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-extrabold text-cyan-700 dark:text-cyan-300 hover:text-white bg-sky-50 dark:bg-slate-800/90 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-sky-600 border border-sky-200/80 dark:border-slate-700/80 hover:border-transparent transition-all duration-200 cursor-pointer group/btn shadow-xs hover:shadow-md hover:shadow-cyan-500/20 active:scale-95"
            >
              <span>{t('seeAll') || 'See all'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Carousel Row of Products or Empty Message */}
      {hasProducts ? (
        <div
          ref={scrollRef}
          className="flex gap-3.5 sm:gap-4.5 overflow-x-auto no-scrollbar scroll-smooth pb-3 pt-1 -mx-2 px-2"
        >
          {products.slice(0, 12).map((product) => (
            <div
              key={product.id}
              className="w-[170px] sm:w-[220px] md:w-[235px] lg:w-[245px] shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 px-4 rounded-2xl bg-sky-50/40 dark:bg-slate-800/30 border border-dashed border-sky-200/60 dark:border-slate-800 text-center">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            {isPortuguese
              ? 'Nenhum produto disponível nesta categoria no momento.'
              : 'No items in this category yet.'}
          </p>
        </div>
      )}
    </section>
  );
};
