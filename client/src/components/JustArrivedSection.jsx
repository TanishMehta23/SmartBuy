import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const JustArrivedSection = ({ products = [], onSelectProduct, onSeeAll }) => {
  const scrollRef = useRef(null);
  const { t, isPortuguese } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Sort by newest and take top 10 products
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 10);

  if (recentProducts.length === 0) return null;

  return (
    <section ref={ref} className="my-6 sm:my-10">
      <div className="bg-gradient-to-br from-white/95 via-sky-50/40 to-white/95 dark:from-slate-900/95 dark:via-slate-900/60 dark:to-slate-900/95 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-xs">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60 mb-1">
              <Sparkles className="w-3 h-3 text-rose-500" />
              <span>{t('justArrivedTitle')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('justArrivedTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
              {t('justArrivedSubtitle')}
            </p>
          </div>

          {/* Controls & See All */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-cyan-600 transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-cyan-600 transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onSeeAll?.('all-catalog')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50/80 hover:bg-cyan-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-cyan-200/60 dark:border-slate-700 transition-all cursor-pointer group shrink-0"
            >
              <span>{t('seeAll')}</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Carousel of Recently Added Cards */}
        <div
          ref={scrollRef}
          className="flex gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1 -mx-1 px-1 items-stretch"
        >
          {recentProducts.map((product) => (
            <div
              key={product.id}
              className="w-[160px] sm:w-[200px] md:w-[215px] shrink-0 relative"
            >
              {/* Shimmering 'New Arrival' ribbon tag */}
              <div className="absolute top-2 left-2 z-30 pointer-events-none">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t('newArrival')}
                </span>
              </div>
              <ProductCard product={product} onSelectProduct={onSelectProduct} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
