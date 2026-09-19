import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, Apple, Wheat, Milk, Wine, Cookie, Snowflake, Fish, ShoppingBasket, Sparkles, Home, Package, Percent } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

/**
 * Map category names to lucide-react icons.
 * Falls back to Package icon for unknown categories.
 */
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

/**
 * Vibrant, modern curated color styling for each category.
 */
const categoryColorMap = {
  'All Products': {
    activeGrad: 'from-cyan-500 to-blue-600 shadow-cyan-500/30 text-white ring-cyan-400/40',
    idleBg: 'bg-gradient-to-br from-cyan-50 to-blue-50/80 dark:from-cyan-950/40 dark:to-blue-950/30 border-cyan-200/80 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-md group-hover:shadow-cyan-500/15',
    activeText: 'text-cyan-700 dark:text-cyan-300',
    activePill: 'bg-cyan-50 dark:bg-cyan-950/40',
  },
  'Bakery': {
    activeGrad: 'from-amber-500 to-orange-600 shadow-amber-500/30 text-white ring-amber-400/40',
    idleBg: 'bg-gradient-to-br from-amber-50 to-orange-50/80 dark:from-amber-950/40 dark:to-orange-950/30 border-amber-200/80 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 group-hover:border-amber-400 group-hover:shadow-md group-hover:shadow-amber-500/15',
    activeText: 'text-amber-700 dark:text-amber-300',
    activePill: 'bg-amber-50 dark:bg-amber-950/40',
  },
  'Dairy': {
    activeGrad: 'from-blue-500 to-indigo-600 shadow-blue-500/30 text-white ring-blue-400/40',
    idleBg: 'bg-gradient-to-br from-blue-50 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/30 border-blue-200/80 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 group-hover:border-blue-400 group-hover:shadow-md group-hover:shadow-blue-500/15',
    activeText: 'text-blue-700 dark:text-blue-300',
    activePill: 'bg-blue-50 dark:bg-blue-950/40',
  },
  'Electronics': {
    activeGrad: 'from-purple-500 to-indigo-600 shadow-purple-500/30 text-white ring-purple-400/40',
    idleBg: 'bg-gradient-to-br from-purple-50 to-indigo-50/80 dark:from-purple-950/40 dark:to-indigo-950/30 border-purple-200/80 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 group-hover:border-purple-400 group-hover:shadow-md group-hover:shadow-purple-500/15',
    activeText: 'text-purple-700 dark:text-purple-300',
    activePill: 'bg-purple-50 dark:bg-purple-950/40',
  },
  'Drinks': {
    activeGrad: 'from-rose-500 to-pink-600 shadow-rose-500/30 text-white ring-rose-400/40',
    idleBg: 'bg-gradient-to-br from-rose-50 to-pink-50/80 dark:from-rose-950/40 dark:to-pink-950/30 border-rose-200/80 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 group-hover:border-rose-400 group-hover:shadow-md group-hover:shadow-rose-500/15',
    activeText: 'text-rose-700 dark:text-rose-300',
    activePill: 'bg-rose-50 dark:bg-rose-950/40',
  },
  'Beverages': {
    activeGrad: 'from-rose-500 to-pink-600 shadow-rose-500/30 text-white ring-rose-400/40',
    idleBg: 'bg-gradient-to-br from-rose-50 to-pink-50/80 dark:from-rose-950/40 dark:to-pink-950/30 border-rose-200/80 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 group-hover:border-rose-400 group-hover:shadow-md group-hover:shadow-rose-500/15',
    activeText: 'text-rose-700 dark:text-rose-300',
    activePill: 'bg-rose-50 dark:bg-rose-950/40',
  },
  'Fruits': {
    activeGrad: 'from-emerald-500 to-teal-600 shadow-emerald-500/30 text-white ring-emerald-400/40',
    idleBg: 'bg-gradient-to-br from-emerald-50 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/30 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 group-hover:border-emerald-400 group-hover:shadow-md group-hover:shadow-emerald-500/15',
    activeText: 'text-emerald-700 dark:text-emerald-300',
    activePill: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  'Snacks': {
    activeGrad: 'from-amber-500 to-yellow-600 shadow-amber-500/30 text-white ring-amber-400/40',
    idleBg: 'bg-gradient-to-br from-amber-50 to-yellow-50/80 dark:from-amber-950/40 dark:to-yellow-950/30 border-amber-200/80 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 group-hover:border-amber-400 group-hover:shadow-md group-hover:shadow-amber-500/15',
    activeText: 'text-amber-700 dark:text-amber-300',
    activePill: 'bg-amber-50 dark:bg-amber-950/40',
  },
  'Vegetables': {
    activeGrad: 'from-green-500 to-emerald-600 shadow-green-500/30 text-white ring-green-400/40',
    idleBg: 'bg-gradient-to-br from-green-50 to-emerald-50/80 dark:from-green-950/40 dark:to-emerald-950/30 border-green-200/80 dark:border-green-800/60 text-green-600 dark:text-green-400 group-hover:border-green-400 group-hover:shadow-md group-hover:shadow-green-500/15',
    activeText: 'text-green-700 dark:text-green-300',
    activePill: 'bg-green-50 dark:bg-green-950/40',
  },
  'Seafood': {
    activeGrad: 'from-teal-500 to-cyan-600 shadow-teal-500/30 text-white ring-teal-400/40',
    idleBg: 'bg-gradient-to-br from-teal-50 to-cyan-50/80 dark:from-teal-950/40 dark:to-cyan-950/30 border-teal-200/80 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 group-hover:border-teal-400 group-hover:shadow-md group-hover:shadow-teal-500/15',
    activeText: 'text-teal-700 dark:text-teal-300',
    activePill: 'bg-teal-50 dark:bg-teal-950/40',
  },
  'Meat': {
    activeGrad: 'from-red-500 to-rose-600 shadow-red-500/30 text-white ring-red-400/40',
    idleBg: 'bg-gradient-to-br from-red-50 to-rose-50/80 dark:from-red-950/40 dark:to-rose-950/30 border-red-200/80 dark:border-red-800/60 text-red-600 dark:text-red-400 group-hover:border-red-400 group-hover:shadow-md group-hover:shadow-red-500/15',
    activeText: 'text-red-700 dark:text-red-300',
    activePill: 'bg-red-50 dark:bg-red-950/40',
  },
  'Personal Care': {
    activeGrad: 'from-fuchsia-500 to-pink-600 shadow-fuchsia-500/30 text-white ring-fuchsia-400/40',
    idleBg: 'bg-gradient-to-br from-fuchsia-50 to-pink-50/80 dark:from-fuchsia-950/40 dark:to-pink-950/30 border-fuchsia-200/80 dark:border-fuchsia-800/60 text-fuchsia-600 dark:text-fuchsia-400 group-hover:border-fuchsia-400 group-hover:shadow-md group-hover:shadow-fuchsia-500/15',
    activeText: 'text-fuchsia-700 dark:text-fuchsia-300',
    activePill: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
  },
  'Household': {
    activeGrad: 'from-indigo-500 to-violet-600 shadow-indigo-500/30 text-white ring-indigo-400/40',
    idleBg: 'bg-gradient-to-br from-indigo-50 to-violet-50/80 dark:from-indigo-950/40 dark:to-violet-950/30 border-indigo-200/80 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 group-hover:border-indigo-400 group-hover:shadow-md group-hover:shadow-indigo-500/15',
    activeText: 'text-indigo-700 dark:text-indigo-300',
    activePill: 'bg-indigo-50 dark:bg-indigo-950/40',
  },
  'Other': {
    activeGrad: 'from-slate-600 to-slate-800 shadow-slate-500/30 text-white ring-slate-400/40',
    idleBg: 'bg-gradient-to-br from-slate-100 to-slate-200/80 dark:from-slate-800 dark:to-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 group-hover:border-slate-400 group-hover:shadow-md',
    activeText: 'text-slate-800 dark:text-slate-200',
    activePill: 'bg-slate-100 dark:bg-slate-800',
  },
};

const defaultColor = {
  activeGrad: 'from-cyan-500 to-blue-600 shadow-cyan-500/30 text-white ring-cyan-400/40',
  idleBg: 'bg-gradient-to-br from-cyan-50 to-sky-50/80 dark:from-cyan-950/40 dark:to-sky-950/30 border-cyan-200/80 dark:border-cyan-800/60 text-cyan-600 dark:text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-md',
  activeText: 'text-cyan-700 dark:text-cyan-300',
  activePill: 'bg-cyan-50 dark:bg-cyan-950/40',
};

const getCategoryColors = (name) => {
  return categoryColorMap[name] || defaultColor;
};

const getCategoryIcon = (name) => {
  return categoryIconMap[name] || Package;
};

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
