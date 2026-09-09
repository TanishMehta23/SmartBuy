import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { categoryTranslations } from '../utils/translations';

export const Header = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { t, isPortuguese } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (onSelectCategory) onSelectCategory('all');
    if (onSearchChange) onSearchChange('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b transition-all duration-300 ${
        isScrolled
          ? 'border-sky-200/80 dark:border-slate-800 shadow-md shadow-sky-950/5 dark:shadow-slate-950/40 py-2 sm:py-2.5'
          : 'border-sky-100/80 dark:border-slate-800/80 py-2.5 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-4">
          {/* Brand Logo & Store Info */}
          <div className="flex items-center justify-between gap-3 min-w-0 w-full md:w-auto">
            <a
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 sm:gap-3 shrink-0 group cursor-pointer select-none transition-transform active:scale-98 min-w-0"
              title="Smart Buy - Home Catalog"
            >
              <img
                src="/logo.png"
                alt="Smart Buy Logo"
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform duration-300 shrink-0 drop-shadow-xs"
              />
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {t('storeTitle')}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60 shrink-0">
                    NIPC 518263606
                  </span>
                </div>
                <span className="text-[9px] sm:text-[11px] font-extrabold text-cyan-700 dark:text-cyan-400 tracking-wider uppercase truncate">
                  {t('motto')}
                </span>
              </div>
            </a>

            {/* Mobile-only theme toggle */}
            <div className="flex md:hidden items-center shrink-0">
              <ThemeToggle size="sm" />
            </div>
          </div>

          {/* Search Bar + Controls */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto flex-1 justify-end max-w-full md:max-w-xl min-w-0">
            <div className="relative group flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-9 py-2 sm:py-2.5 bg-slate-50/80 hover:bg-slate-100/70 focus:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:focus:bg-slate-900 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl sm:rounded-2xl border border-sky-200/80 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-3 focus:ring-cyan-500/15 transition-all outline-none"
              />
              {Boolean(searchQuery) && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title={t('clearSearch')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Desktop Theme Toggle */}
            <div className="hidden md:flex items-center shrink-0">
              <ThemeToggle />
            </div>

            {/* Language Selector */}
            <div className="shrink-0">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
