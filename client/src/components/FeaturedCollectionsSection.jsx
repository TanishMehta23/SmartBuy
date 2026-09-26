import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Wheat, Apple, Milk, Coffee, Award, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const FeaturedCollectionsSection = ({ onSelectCategory }) => {
  const navigate = useNavigate();
  const { t, isPortuguese } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const collections = [
    {
      id: 'farm-fresh',
      titleEn: 'Fresh From the Farm',
      titlePt: 'Frescos da Horta',
      descEn: 'Crisp seasonal vegetables, organic greens & orchard fruits harvested with care',
      descPt: 'Legumes da época, hortaliças e frutas colhidas com rigor e frescura',
      image: '/promo_local.jpg',
      target: 'produce',
      tagEn: '100% Fresh Daily',
      tagPt: '100% Fresco Diário',
      icon: Apple,
      accent: 'from-emerald-500/20 to-teal-500/10 border-emerald-400/30 text-emerald-300',
    },
    {
      id: 'bakery-collection',
      titleEn: 'The Bakery Collection',
      titlePt: 'A Coleção de Padaria',
      descEn: 'Artisan sourdough, traditional baguettes, sweet pastéis & morning treats',
      descPt: 'Pão de fermentação natural, baguetes, pastéis de nata e doçaria tradicional',
      image: '/store_bakery.jpg',
      target: 'bakery',
      tagEn: 'Artisan & Oven Warm',
      tagPt: 'Artesanal & Quentinho',
      icon: Wheat,
      accent: 'from-amber-500/20 to-orange-500/10 border-amber-400/30 text-amber-300',
    },
    {
      id: 'everyday-essentials',
      titleEn: 'Everyday Essentials',
      titlePt: 'Essenciais do Dia a Dia',
      descEn: 'Pantry staples, organic milks, breakfast cereals & pure cooking oils',
      descPt: 'Despensa completa, leites biológicos, cereais de pequeno-almoço e azeites',
      image: '/promo_essentials.jpg',
      target: 'all-catalog',
      tagEn: 'Top Smart Value',
      tagPt: 'Melhor Escolha',
      icon: Milk,
      accent: 'from-blue-500/20 to-cyan-500/10 border-cyan-400/30 text-cyan-300',
    },
    {
      id: 'premium-cellar',
      titleEn: 'Cellar & Beverages',
      titlePt: 'Garrafeira & Bebidas',
      descEn: 'Regional Portuguese wines, refreshing sparkling drinks & fresh fruit juices',
      descPt: 'Vinhos de regiões demarcadas, bebidas refrescantes e sumos naturais',
      image: '/store_cellar.jpg',
      target: 'drinks',
      tagEn: 'Handpicked Selection',
      tagPt: 'Seleção Criteriosa',
      icon: Coffee,
      accent: 'from-purple-500/20 to-rose-500/10 border-rose-400/30 text-rose-300',
    },
  ];

  const handleCollectionClick = (target) => {
    if (onSelectCategory) {
      onSelectCategory(target);
    } else {
      navigate('/catalog');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="my-0">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
            {t('featuredCollectionsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {t('featuredCollectionsSubtitle')}
          </p>
        </div>
      </div>

      {/* 4-in-a-Row Collections Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
        {collections.map((col, idx) => {
          const Icon = col.icon;
          const delayMs = idx * 100;
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => handleCollectionClick(col.target)}
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 text-left text-white shadow-md shadow-slate-900/10 dark:shadow-slate-950/40 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] group min-h-[165px] sm:min-h-[185px] md:min-h-[200px] flex flex-col justify-between border border-sky-100/80 dark:border-slate-800 animate-on-scroll ${
                isVisible ? 'animate-fade-in-up' : ''
              }`}
              style={isVisible ? { animationDelay: `${delayMs}ms` } : undefined}
            >
              {/* Background Photography */}
              <img
                src={col.image}
                alt={isPortuguese ? col.titlePt : col.titleEn}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Dynamic Gradient Contrast Overlay — Clean, Rich & Light-Mode Friendly */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20 group-hover:opacity-90 transition-opacity" />

              {/* Top Tag Pill with Modern Frosted Glass Look */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-white/25 dark:bg-black/40 backdrop-blur-md border border-white/30 text-white shadow-xs">
                  <Icon className="w-3 h-3 text-white shrink-0" />
                  <span>{isPortuguese ? col.tagPt : col.tagEn}</span>
                </span>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 mt-3 sm:mt-4 max-w-md">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-normal mb-1 leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                  {isPortuguese ? col.titlePt : col.titleEn}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-100/90 font-medium mb-2.5 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2 hidden xs:block">
                  {isPortuguese ? col.descPt : col.descEn}
                </p>

                <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-cyan-300 group-hover:text-white transition-colors drop-shadow-xs">
                  <span>{t('exploreCollection')}</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
