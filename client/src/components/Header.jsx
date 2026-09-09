import React from 'react';
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
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-sky-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-slate-950/40 transition-colors duration-200">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 sm:py-3.5 gap-2.5 sm:gap-4">
          {/* Top row on Mobile: Brand on Left, ONLY Theme Toggle on Right Corner */}
          <div className="flex items-center justify-between gap-2 min-w-0 w-full md:w-auto">
            {/* Clickable Brand Logo, Store Title, NIPC & Motto */}
            <a
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2 sm:gap-3.5 shrink-0 group cursor-pointer select-none transition-transform active:scale-98 min-w-0"
              title="Smart Buy - Back to Top"
            >
              <img
                src="/logo.png"
                alt="Smart Buy Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
              />
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-sky-950 to-cyan-900 dark:from-white dark:via-sky-100 dark:to-cyan-200 bg-clip-text text-transparent group-hover:from-cyan-600 group-hover:to-sky-700 dark:group-hover:from-cyan-400 dark:group-hover:to-sky-400 transition-colors">
                    {t('storeTitle')}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8.5px] sm:text-[10px] md:text-xs font-black bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 tracking-wide shadow-xs shadow-cyan-400/30 border border-cyan-300/40 shrink-0">
                    NIPC 518263606
                  </span>
                </div>
                <span className="text-[8.5px] sm:text-xs md:text-sm font-extrabold text-sky-600/90 dark:text-cyan-400 tracking-wider sm:tracking-widest uppercase truncate mt-0.5">
                  {t('motto')}
                </span>
              </div>
            </a>

            {/* Right corner ABOVE on Mobile: Light & Dark Mode button ONLY */}
            <div className="flex md:hidden items-center shrink-0">
              <ThemeToggle size="sm" />
            </div>
          </div>

          {/* Search Bar + Controls (On Mobile: Search + Language below; On Laptop: Search + Theme + Language in one cohesive row) */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto flex-1 justify-end max-w-full md:max-w-xl min-w-0">
            <div className="relative group flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400 dark:text-sky-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-9 py-2 sm:py-2.5 bg-sky-50/70 hover:bg-sky-50/90 focus:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:focus:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl sm:rounded-2xl border border-sky-200/80 dark:border-slate-700/80 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/15 transition-all outline-none shadow-inner shadow-sky-100/50 dark:shadow-none"
              />
              {Boolean(searchQuery) && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-sky-600 dark:hover:text-cyan-400 transition-colors"
                  title={t('clearSearch')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Desktop-only Theme Toggle (kept together with search & language on laptop) */}
            <div className="hidden md:flex items-center shrink-0">
              <ThemeToggle />
            </div>

            {/* Language Switcher (Visible on both: in lower row on mobile, in same row on laptop) */}
            <div className="shrink-0">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
