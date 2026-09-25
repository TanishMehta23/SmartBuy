import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { getCategoryIcon, getCategoryColors } from '../utils/categoryIcons';

export const CategoryIconsBar = ({ categories = [], selectedCategoryId, onSelectCategory }) => {
  const scrollRef = useRef(null);
  const { isPortuguese, t } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Build the full list: "All" + dynamic categories
  const allItem = { id: 'all', name: 'All Products' };
  const items = [allItem, ...categories];

  return (
    <div
      ref={sectionRef}
      className={`relative my-4 sm:my-6 animate-on-scroll ${isVisible ? 'animate-fade-in-up' : ''}`}
    >
      <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-sky-100/90 dark:border-slate-800 shadow-xs p-3 sm:p-4">
        {/* Scroll arrows for desktop */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-all hover:scale-105 active:scale-95 hidden sm:flex"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-all hover:scale-105 active:scale-95 hidden sm:flex"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Scrollable icons row */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth px-1 sm:px-8"
        >
          {items.map((category, idx) => {
            const isAll = category.id === 'all';
            const isActive = isAll
              ? selectedCategoryId === 'all'
              : selectedCategoryId === category.id;

            const Icon = getCategoryIcon(category.name);
            const colors = getCategoryColors(category.name);

            const displayName = isAll
              ? (t('allProducts') || 'All')
              : isPortuguese && categoryTranslations[category.name]
                ? categoryTranslations[category.name]
                : category.name;

            // Stagger delay for entrance
            const delayMs = idx * 60;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  if (isAll) {
                    onSelectCategory('all');
                  } else {
                    onSelectCategory(category.id);
                  }
                }}
                className={`flex flex-col items-center gap-1.5 min-w-[64px] sm:min-w-[72px] py-2 px-1.5 rounded-2xl cursor-pointer transition-all duration-300 group shrink-0 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                  } ${isActive
                    ? colors.activePill
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                style={isVisible ? { animationDelay: `${delayMs}ms` } : undefined}
              >
                {/* Circular icon container */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                      ? `bg-gradient-to-br ${colors.activeGrad} shadow-lg ring-3 scale-110`
                      : `${colors.idleBg} border group-hover:scale-110`
                    }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] sm:text-xs font-bold text-center leading-tight truncate max-w-[64px] sm:max-w-[72px] transition-colors ${isActive
                      ? colors.activeText
                      : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100'
                    }`}
                >
                  {displayName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
