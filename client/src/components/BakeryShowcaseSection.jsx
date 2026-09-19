import React, { useRef } from 'react';
import { Wheat, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const BakeryShowcaseSection = ({ products = [], categories = [], onSelectCategory, onSelectProduct }) => {
  const { t, isPortuguese } = useLanguage();
  const scrollRef = useRef(null);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const bakeryCategory = categories.find((c) => /bakery|padaria|pão/i.test(c.name));

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Filter bakery products
  const bakeryProducts = products.filter((p) => {
    const catName = p.category?.name || '';
    return /bakery|padaria|bread|pão|cake|bolo|pastry/i.test(catName);
  });

  if (bakeryProducts.length === 0) return null;

  return (
    <section ref={ref} className="my-6 sm:my-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/90 via-orange-950/80 to-slate-900/95 text-white p-5 sm:p-7 border border-amber-500/20 shadow-xl">
        {/* Background Ambient Warm Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Top Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2">
              <Wheat className="w-3.5 h-3.5 text-amber-400" />
              <span>{isPortuguese ? 'Fornos Tradicionais' : 'Oven Fresh Daily'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
              {t('bakeryTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/80 font-medium mt-1">
              {t('bakerySubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Carousel Arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (bakeryCategory) {
                  onSelectCategory?.(bakeryCategory.id);
                } else {
                  onSelectCategory?.('all-catalog');
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-amber-400 text-amber-950 hover:bg-amber-300 transition-all cursor-pointer group shrink-0 shadow-md whitespace-nowrap"
            >
              <span>{t('exploreBakery')}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Bakery Products Single-Line Carousel */}
        <div
          ref={scrollRef}
          className="relative z-10 flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1 -mx-1 px-1 items-stretch"
        >
          {bakeryProducts.map((product) => (
            <div
              key={product.id}
              className="w-[160px] sm:w-[195px] md:w-[215px] lg:w-[225px] shrink-0"
            >
              <ProductCard product={product} onSelectProduct={onSelectProduct} />
            </div>
          ))}

          {/* End Explore Card */}
          <div className="w-[145px] sm:w-[175px] shrink-0 flex">
            <button
              type="button"
              onClick={() => {
                if (bakeryCategory) {
                  onSelectCategory?.(bakeryCategory.id);
                } else {
                  onSelectCategory?.('all-catalog');
                }
              }}
              className="w-full h-full min-h-[220px] rounded-2xl border-2 border-dashed border-amber-400/40 bg-white/5 hover:bg-white/10 hover:border-amber-400 flex flex-col items-center justify-center p-4 text-center group cursor-pointer transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-110 transition-transform mb-2">
                <ArrowRight className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                {t('exploreBakery')}
              </span>
              <span className="text-[10px] text-amber-200/70 font-medium mt-1">
                {isPortuguese ? 'Ver tudo' : 'See all items'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
