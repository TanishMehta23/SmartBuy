import React from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { categoryTranslations } from '../utils/translations';

export const Header = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { t, isPortuguese } = useLanguage();

  const getCategoryDisplayName = (name) => {
    if (isPortuguese && categoryTranslations[name]) {
      return categoryTranslations[name];
    }
    return name;
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (onSelectCategory) onSelectCategory('all');
    if (onSearchChange) onSearchChange('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sky-200/80 shadow-sm transition-all">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 sm:py-3.5 gap-2 sm:gap-4">
          {/* Clickable Brand Logo, Store Title, NIPC & Motto */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 sm:gap-4 shrink-0 group cursor-pointer select-none transition-transform active:scale-98 min-w-0"
            title="Smart Buy - Back to Top"
          >
            <img
              src="/logo.png"
              alt="Smart Buy Logo"
              className="w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-sky-950 to-cyan-900 bg-clip-text text-transparent group-hover:from-cyan-600 group-hover:to-sky-700 transition-colors">
                  {t('storeTitle')}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[11px] md:text-xs font-black bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 tracking-wide shadow-xs shadow-cyan-400/30 border border-cyan-300/40 shrink-0">
                  NIPC 518263606
                </span>
              </div>
              <span className="text-[9px] sm:text-xs md:text-sm font-extrabold text-sky-600/90 tracking-wider sm:tracking-widest uppercase truncate mt-0.5">
                {t('motto')}
              </span>
            </div>
          </a>

          {/* Search Bar & Language Switcher in one cohesive row */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end max-w-full md:max-w-xl min-w-0">
            <div className="relative group flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400 group-focus-within:text-cyan-500 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-9 py-2 sm:py-2.5 bg-sky-50/70 hover:bg-sky-50/90 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 rounded-xl sm:rounded-2xl border border-sky-200/80 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition-all outline-none shadow-inner shadow-sky-100/50"
              />
              {Boolean(searchQuery) && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-sky-600 transition-colors"
                  title={t('clearSearch')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Language Switcher */}
            <div className="shrink-0">
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Category Filter Pills Ribbon with Visual Scroll Indicator & Arrows */}
        <div className="relative border-t border-sky-100/80 py-2 group/ribbon">
          {/* Scrollable Container */}
          <div
            id="category-ribbon"
            className="overflow-x-auto no-scrollbar flex items-center gap-2 scroll-smooth px-1"
          >
            {/* All Products Pill */}
            {(() => {
              const totalAllProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
              const isSelected = selectedCategoryId === 'all';
              return (
                <button
                  onClick={() => onSelectCategory('all')}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400/40'
                      : 'bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-sky-200/80 shadow-xs'
                  }`}
                >
                  <span>{t('allProducts')}</span>
                  {totalAllProducts > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                        isSelected
                          ? 'bg-sky-900/30 text-white border border-white/20'
                          : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      {totalAllProducts}
                    </span>
                  )}
                </button>
              );
            })()}

            {categories.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400/40'
                      : 'bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-sky-200/80 shadow-xs'
                  }`}
                >
                  <span>{getCategoryDisplayName(category.name)}</span>
                  {category.productCount !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                        isSelected
                          ? 'bg-sky-900/30 text-white border border-white/20'
                          : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      {category.productCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Gradient Fade to signify more items on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none flex items-center justify-end pr-1" />
        </div>
      </div>
    </header>
  );
};
