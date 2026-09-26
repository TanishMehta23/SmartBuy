import React, { useState, useRef } from 'react';
import { Apple, ShoppingBasket, ArrowRight, Sparkles, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const FreshProduceSection = ({ products = [], categories = [], onSelectCategory, onSelectProduct }) => {
  const { t, isPortuguese } = useLanguage();
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState('both'); // 'both' | 'fruits' | 'vegetables'
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

  // Filter fruits and vegetables from products
  const produceProducts = products.filter((p) => {
    const catName = p.category?.name || '';
    return /fruit|fruta|veg|legume|hortali/i.test(catName);
  });

  const filteredItems = produceProducts.filter((p) => {
    const catName = (p.category?.name || '').toLowerCase();
    if (activeTab === 'fruits') return /fruit|fruta/i.test(catName);
    if (activeTab === 'vegetables') return /veg|legume|hortali/i.test(catName);
    return true;
  });

  if (produceProducts.length === 0) return null;

  return (
    <section ref={ref} className="my-0">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/90 via-teal-950/80 to-slate-900/95 text-white p-5 sm:p-7 border border-emerald-500/20 shadow-xl">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Top Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5 sm:mb-6">
          {/* Title & Badge Group */}
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              {t('freshProduceTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-medium mt-1">
              {t('freshProduceSubtitle')}
            </p>
          </div>

          {/* Subcategory Switcher + Controls Row */}
          <div className="flex items-center justify-between md:justify-end gap-2 pt-2.5 md:pt-0 border-t md:border-t-0 border-emerald-500/20 w-full md:w-auto shrink-0">
            {/* Filter Switcher */}
            <div className="inline-flex p-0.5 sm:p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('both')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'both'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                {isPortuguese ? 'Todos' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('fruits')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'fruits'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                {t('allFruits')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('vegetables')}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'vegetables'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                {t('allVegetables')}
              </button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Carousel Arrows (Hidden on mobile touch screens, visible sm+) */}
              <div className="hidden sm:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95 shadow-xs"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95 shadow-xs"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Explore CTA */}
              <button
                type="button"
                onClick={() => onSelectCategory?.('produce')}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold bg-white text-emerald-950 hover:bg-emerald-50 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400 dark:shadow-emerald-500/25 border border-transparent dark:border-emerald-400/30 transition-all cursor-pointer group shrink-0 shadow-md whitespace-nowrap active:scale-95"
              >
                <span className="hidden sm:inline">{t('exploreProduce')}</span>
                <span className="sm:hidden">{isPortuguese ? 'Ver tudo' : 'See all'}</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Single-Line Scrollable Product Carousel */}
        <div
          ref={scrollRef}
          className="relative z-10 flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1 -mx-1 px-1 items-stretch"
        >
          {filteredItems.map((product) => (
            <div
              key={product.id}
              className="w-[160px] sm:w-[195px] md:w-[215px] lg:w-[225px] shrink-0"
            >
              <ProductCard product={product} onSelectProduct={onSelectProduct} />
            </div>
          ))}

          {/* End "Explore Collection" Card */}
          <div className="w-[145px] sm:w-[175px] shrink-0 flex">
            <button
              type="button"
              onClick={() => onSelectCategory?.('produce')}
              className="w-full h-full min-h-[220px] rounded-2xl border-2 border-dashed border-emerald-400/40 bg-white/5 hover:bg-white/10 hover:border-emerald-400 flex flex-col items-center justify-center p-4 text-center group cursor-pointer transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-110 transition-transform mb-2">
                <ArrowRight className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                {t('exploreProduce')}
              </span>
              <span className="text-[10px] text-emerald-200/70 font-medium mt-1">
                {isPortuguese ? 'Ver tudo' : 'See all items'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
