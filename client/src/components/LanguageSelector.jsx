import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSelector = ({ variant = 'light' }) => {
  const { language, setLanguage } = useLanguage();

  const isLight = variant === 'light';

  return (
    <div
      className={`inline-flex items-center p-1 rounded-2xl border transition-all ${
        isLight
          ? 'bg-white/80 backdrop-blur-md border-sky-200/80 shadow-xs'
          : 'bg-slate-800/90 border-slate-700/80'
      }`}
    >
      <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-sky-600">
        <Globe className="w-3.5 h-3.5 text-cyan-500" />
      </div>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
          language === 'en'
            ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-xs shadow-cyan-500/20'
            : isLight
            ? 'text-slate-600 hover:text-sky-800 hover:bg-sky-50'
            : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
        title="English"
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('pt')}
        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
          language === 'pt'
            ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-xs shadow-cyan-500/20'
            : isLight
            ? 'text-slate-600 hover:text-sky-800 hover:bg-sky-50'
            : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
        title="Português"
      >
        <span>🇵🇹</span>
        <span>PT</span>
      </button>
    </div>
  );
};
