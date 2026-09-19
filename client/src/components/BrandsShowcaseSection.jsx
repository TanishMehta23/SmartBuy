import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const BrandsShowcaseSection = () => {
  const navigate = useNavigate();
  const { t, isPortuguese } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const featuredBrands = [
    { name: 'Mimosa', categoryEn: 'Dairy & Milk', categoryPt: 'Laticínios', color: 'from-blue-500 to-indigo-600' },
    { name: 'Compal', categoryEn: 'Natural Juices', categoryPt: 'Sumos Naturais', color: 'from-amber-500 to-orange-600' },
    { name: 'Delta Cafés', categoryEn: 'Coffee & Roasts', categoryPt: 'Cafés & Grãos', color: 'from-amber-700 to-yellow-800' },
    { name: 'Gallo', categoryEn: 'Olive Oils', categoryPt: 'Azeites', color: 'from-emerald-600 to-green-700' },
    { name: 'Nestlé', categoryEn: 'Breakfast & Pantry', categoryPt: 'Pequeno-Almoço', color: 'from-sky-500 to-blue-600' },
    { name: 'Danone', categoryEn: 'Fresh Yogurts', categoryPt: 'Iogurtes', color: 'from-blue-400 to-cyan-500' },
    { name: 'Milka', categoryEn: 'Chocolates', categoryPt: 'Chocolates', color: 'from-purple-500 to-violet-600' },
    { name: 'Lipton', categoryEn: 'Teas & Infusions', categoryPt: 'Chás', color: 'from-yellow-500 to-amber-600' },
    { name: 'Nobre', categoryEn: 'Delicatessen', categoryPt: 'Charcutaria', color: 'from-rose-600 to-red-700' },
  ];

  const handleBrandClick = (brandName) => {
    navigate(`/catalog?search=${encodeURIComponent(brandName)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="my-6 sm:my-10">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-sky-100 dark:border-slate-800 p-4 sm:p-7 shadow-xs">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60 mb-1">
              <Award className="w-3 h-3" />
              <span>{t('brandsTitle')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('brandsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {t('brandsSubtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              navigate('/catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50/80 hover:bg-cyan-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-cyan-200/60 dark:border-slate-700 transition-all cursor-pointer group shrink-0"
          >
            <span>{t('allBrands')}</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* 3x3 Brands Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {featuredBrands.map((brand, idx) => {
            const delayMs = idx * 50;
            return (
              <button
                key={brand.name}
                type="button"
                onClick={() => handleBrandClick(brand.name)}
                className={`p-2.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-cyan-50/80 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/80 hover:border-cyan-300 dark:hover:border-cyan-500 transition-all text-center flex flex-col items-center justify-center gap-1.5 sm:gap-2 group cursor-pointer hover:shadow-md active:scale-95 animate-on-scroll ${
                  isVisible ? 'animate-fade-in-up' : ''
                }`}
                style={isVisible ? { animationDelay: `${delayMs}ms` } : undefined}
                title={t('exploreBrand', { name: brand.name })}
              >
                {/* Brand Initial Badge */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${brand.color} text-white font-black text-sm sm:text-base flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}
                >
                  {brand.name.substring(0, 2).toUpperCase()}
                </div>

                {/* Brand Name & Tag */}
                <div className="min-w-0 w-full">
                  <h4 className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-100 truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                    {brand.name}
                  </h4>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate block">
                    {isPortuguese ? brand.categoryPt : brand.categoryEn}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
