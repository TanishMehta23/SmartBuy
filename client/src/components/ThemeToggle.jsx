import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export const ThemeToggle = ({ className = '', size = 'md' }) => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const tooltipText = isDark ? t('switchToLightMode') : t('switchToDarkMode');

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-10 h-10 sm:w-11 sm:h-11',
  }[size] || 'w-9 h-9 sm:w-10 sm:h-10';

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4 sm:w-5 sm:h-5',
    lg: 'w-5 h-5',
  }[size] || 'w-4 h-4 sm:w-5 sm:h-5';

  return (
    <div className="relative group inline-flex items-center justify-center">
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-cyan-500/40 ${sizeClasses} ${
          isDark
            ? 'bg-slate-800/90 hover:bg-slate-700/90 text-amber-400 border border-slate-700 shadow-md shadow-slate-950/40 hover:scale-105 active:scale-95'
            : 'bg-white/85 hover:bg-sky-50/90 text-slate-700 hover:text-sky-800 border border-sky-200/80 shadow-xs hover:scale-105 active:scale-95'
        } ${className}`}
        aria-label={tooltipText}
      >
        {isDark ? (
          <Sun className={`${iconSizes} text-amber-400 animate-in spin-in-90 duration-300 stroke-[2.2]`} />
        ) : (
          <Moon className={`${iconSizes} text-slate-700 dark:text-slate-200 animate-in zoom-in-75 duration-300 stroke-[2]`} />
        )}
      </button>

      {/* Floating Hover Tooltip matching user screenshot */}
      <div className="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap shadow-xl">
        <div className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-900/95 text-white border border-slate-700 shadow-lg backdrop-blur-md">
          {tooltipText}
        </div>
      </div>
    </div>
  );
};
