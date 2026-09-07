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

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-sky-100/80 shadow-xs transition-all">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3.5 gap-4">
          {/* Logo, Store Title, Moto & NIPC */}
          <div className="flex items-center gap-3.5 shrink-0">
            <img
              src="/logo.png"
              alt="Smart Buy Logo"
              className="w-12 h-12 object-contain hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-sky-950 to-cyan-900 bg-clip-text text-transparent">
                  {t('storeTitle')}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 tracking-wide shadow-xs shadow-cyan-400/30 border border-cyan-300/40">
                  NIPC 518263606
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-sky-600/90 tracking-widest uppercase">
                {t('motto')}
              </span>
            </div>
          </div>

          {/* Search Bar & Language Selector */}
          <div className="flex items-center gap-3 flex-1 justify-end max-w-xl">
            <div className="relative group flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400 group-focus-within:text-cyan-500 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-9 py-2.5 bg-sky-50/70 hover:bg-sky-50/90 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-2xl border border-sky-200/70 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 transition-all outline-none shadow-inner shadow-sky-100/50"
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

        {/* Category Filter Pills Ribbon */}
        <div className="py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2 border-t border-sky-100/60">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
              selectedCategoryId === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400/40'
                : 'bg-white/80 hover:bg-sky-50 text-slate-600 hover:text-sky-700 border border-sky-200/60 shadow-xs'
            }`}
          >
            <span>{t('allProducts')}</span>
          </button>

          {categories.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400/40'
                    : 'bg-white/80 hover:bg-sky-50 text-slate-600 hover:text-sky-700 border border-sky-200/60 shadow-xs'
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
      </div>
    </header>
  );
};
