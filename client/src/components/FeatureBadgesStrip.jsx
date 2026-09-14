import React from 'react';
import { Sparkles, ShieldCheck, Zap, Store } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const FeatureBadgesStrip = () => {
  const { isPortuguese } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  const features = [
    {
      icon: Sparkles,
      title: isPortuguese ? 'Qualidade Selecionada' : 'Curated Quality',
      subtitle: isPortuguese ? 'Frescos e selecionados diariamente' : 'Fresh & handpicked daily',
      badge: isPortuguese ? '100% Fresco' : '100% Fresh',
      color: 'amber',
      iconBg: 'bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20',
      badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-500/20',
      glowClass: 'group-hover:from-amber-500/10 group-hover:to-orange-500/5',
    },
    {
      icon: Store,
      title: isPortuguese ? 'Loja em Cascais' : 'Cascais Supermarket',
      subtitle: isPortuguese ? 'Aberto todos os dias até às 20h' : 'Open daily until 8:00 PM',
      badge: isPortuguese ? 'Visite-nos' : 'Visit Store',
      color: 'cyan',
      iconBg: 'bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 border-cyan-200/60 dark:border-cyan-500/20',
      badgeClass: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200/50 dark:border-cyan-500/20',
      glowClass: 'group-hover:from-cyan-500/10 group-hover:to-blue-500/5',
    },
    {
      icon: Zap,
      title: isPortuguese ? 'Variedade Semanal' : 'Weekly Variety',
      subtitle: isPortuguese ? 'Novidades em todo o catálogo' : 'Fresh arrivals across catalog',
      badge: isPortuguese ? 'Novidades' : 'New In',
      color: 'emerald',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20',
      badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-500/20',
      glowClass: 'group-hover:from-emerald-500/10 group-hover:to-teal-500/5',
    },
    {
      icon: ShieldCheck,
      title: isPortuguese ? 'Melhor Valor' : 'Smart Value',
      subtitle: isPortuguese ? 'Marcas de topo com confiança' : 'Top brands you can trust',
      badge: isPortuguese ? 'Garantido' : 'Guaranteed',
      color: 'indigo',
      iconBg: 'bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-500/20',
      badgeClass: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-500/20',
      glowClass: 'group-hover:from-indigo-500/10 group-hover:to-purple-500/5',
    },
  ];

  return (
    <div ref={ref} className="my-5 sm:my-7">
      {/* 2x2 on Mobile, 4-Column on Desktop Feature Highlights Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {features.map((item, idx) => {
          const Icon = item.icon;
          // Staggered delay: each badge enters 100ms after the previous
          const delayMs = idx * 100;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden flex items-center gap-2 sm:gap-3.5 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/70 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-cyan-500/5 dark:hover:shadow-cyan-950/40 hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group animate-on-scroll ${
                isVisible ? 'animate-fade-in-up' : ''
              }`}
              style={isVisible ? { animationDelay: `${delayMs}ms` } : undefined}
            >
              {/* Subtle dynamic background gradient on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent ${item.glowClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              {/* Icon Container with subtle pulse & glow */}
              <div
                className={`w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl ${item.iconBg} border flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* Text content */}
              <div className="min-w-0 flex-1 relative z-10">
                <div className="flex items-center justify-between gap-1.5 mb-0.5">
                  <h3 className="text-[11px] sm:text-[13px] font-black text-slate-900 dark:text-white tracking-tight truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <span
                    className={`hidden xl:inline-flex text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${item.badgeClass} shrink-0 uppercase tracking-wider`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
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
