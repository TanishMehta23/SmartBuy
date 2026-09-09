import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Zap, Store } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FeatureBadgesStrip = () => {
  const { t, isPortuguese } = useLanguage();

  const features = [
    {
      icon: Sparkles,
      title: isPortuguese ? 'Qualidade Selecionada' : 'Curated Quality',
      subtitle: isPortuguese ? 'Produtos frescos e premium' : 'Fresh & premium essentials',
      color: 'from-amber-400 to-orange-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-200/60 dark:border-amber-800/40',
    },
    {
      icon: Store,
      title: isPortuguese ? 'Loja em Cascais' : 'Cascais Supermarket',
      subtitle: isPortuguese ? 'Aberto todos os dias até 20h' : 'Open daily until 8:00 PM',
      color: 'from-cyan-400 to-sky-500',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-sky-50 dark:bg-sky-950/40',
      borderColor: 'border-sky-200/60 dark:border-sky-800/40',
    },
    {
      icon: Zap,
      title: isPortuguese ? 'Variedade Semanal' : 'Weekly Variety',
      subtitle: isPortuguese ? 'Novidades em todas as categorias' : 'Fresh arrivals across catalog',
      color: 'from-emerald-400 to-teal-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200/60 dark:border-emerald-800/40',
    },
    {
      icon: ShieldCheck,
      title: isPortuguese ? 'Preço Inteligente' : 'Smart Value',
      subtitle: isPortuguese ? 'As melhores marcas para você' : 'Top brands & everyday value',
      color: 'from-indigo-400 to-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      borderColor: 'border-purple-200/60 dark:border-purple-800/40',
    },
  ];

  return (
    <div className="my-6 sm:my-8">
      {/* 4-Column Feature Highlights Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-sky-100/80 dark:border-slate-800 shadow-soft dark:shadow-slate-950/30 hover:shadow-card transition-all duration-300 group"
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${item.bgColor} ${item.borderColor} border flex items-center justify-center ${item.textColor} shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-inner`}
              >
                <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10.5px] sm:text-xs text-sky-700/70 dark:text-slate-400 font-medium truncate mt-0.5">
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
