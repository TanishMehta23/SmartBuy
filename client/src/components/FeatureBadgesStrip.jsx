import React from 'react';
import { Sparkles, ShieldCheck, Zap, Store } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FeatureBadgesStrip = () => {
  const { isPortuguese } = useLanguage();

  const features = [
    {
      icon: Sparkles,
      title: isPortuguese ? 'Qualidade Selecionada' : 'Curated Quality',
      subtitle: isPortuguese ? 'Frescos e selecionados diariamente' : 'Fresh & handpicked daily',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10 dark:bg-amber-400/10',
      borderColor: 'border-amber-200/50 dark:border-amber-800/40',
    },
    {
      icon: Store,
      title: isPortuguese ? 'Loja em Cascais' : 'Cascais Supermarket',
      subtitle: isPortuguese ? 'Aberto todos os dias até às 20h' : 'Open daily until 8:00 PM',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-500/10 dark:bg-cyan-400/10',
      borderColor: 'border-cyan-200/50 dark:border-cyan-800/40',
    },
    {
      icon: Zap,
      title: isPortuguese ? 'Variedade Semanal' : 'Weekly Variety',
      subtitle: isPortuguese ? 'Novidades em todo o catálogo' : 'Fresh arrivals across catalog',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-400/10',
      borderColor: 'border-emerald-200/50 dark:border-emerald-800/40',
    },
    {
      icon: ShieldCheck,
      title: isPortuguese ? 'Melhor Valor' : 'Smart Value',
      subtitle: isPortuguese ? 'Marcas de topo com confiança' : 'Top brands you can trust',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-500/10 dark:bg-indigo-400/10',
      borderColor: 'border-indigo-200/50 dark:border-indigo-800/40',
    },
  ];

  return (
    <div className="my-5 sm:my-7">
      {/* 4-Column Feature Highlights Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-sky-100/90 dark:border-slate-800 shadow-xs hover:shadow-soft dark:hover:shadow-slate-950/40 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.bgColor} ${item.borderColor} border flex items-center justify-center ${item.textColor} shrink-0 group-hover:scale-105 transition-transform duration-200`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
