import React from 'react';
import { ShoppingBasket, Leaf, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

/**
 * Three promotional/informational cards at the bottom of the homepage.
 * No shopping CTAs — just informational with "Browse catalog" style links.
 */
export const PromotionalCardsRow = ({ categories = [], onSelectCategory, onBrowseCatalog }) => {
  const { isPortuguese } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  // Find relevant categories dynamically
  const fruitsCategory = categories.find((c) => /fruit|fruta/i.test(c.name));
  const vegCategory = categories.find((c) => /veg|legume|hortali/i.test(c.name));
  const freshCategory = fruitsCategory || vegCategory || categories[0];

  const handleCardClick = (type) => {
    if (type === 'produce') {
      onSelectCategory?.('fruits-vegetables');
    } else if (type === 'deals' || type === 'brands') {
      onSelectCategory?.('all-catalog');
    } else {
      onBrowseCatalog?.();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cards = [
    {
      id: 'deals',
      icon: ShoppingBasket,
      title: isPortuguese ? 'Essenciais Semanais' : 'Weekly Essentials',
      subtitle: isPortuguese ? 'Até 30% de desconto em itens selecionados' : 'Up to 30% Off Selected Items',
      cta: isPortuguese ? 'Ver Ofertas' : 'Browse Deals',
      image: '/promo_essentials.jpg',
      gradient: 'from-sky-950/90 via-cyan-900/75 to-blue-900/40',
      accentColor: 'text-cyan-300',
      badgeBg: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30',
      actionType: 'deals',
    },
    {
      id: 'produce',
      icon: Leaf,
      title: isPortuguese ? 'Frutas & Legumes Frescos' : 'Fresh Fruits & Vegetables',
      subtitle: isPortuguese ? 'Origem local • Qualidade e frescura diária garantida' : 'Locally sourced • Daily fresh produce guaranteed',
      cta: isPortuguese ? 'Ver Frutas & Legumes' : 'Browse Fruits & Veg',
      image: '/promo_local.jpg',
      gradient: 'from-emerald-950/90 via-teal-900/75 to-emerald-900/40',
      accentColor: 'text-emerald-300',
      badgeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
      actionType: 'produce',
    },
    {
      id: 'brands',
      icon: Award,
      title: isPortuguese ? 'Marcas Premium' : 'Premium Brands',
      subtitle: isPortuguese ? 'Grande Seleção • Melhores Preços' : 'Great Selection • Best Prices',
      cta: isPortuguese ? 'Explorar Catálogo' : 'Explore Catalog',
      image: '/promo_premium.jpg',
      gradient: 'from-slate-950/92 via-purple-950/80 to-indigo-950/45',
      accentColor: 'text-purple-300',
      badgeBg: 'bg-purple-500/20 text-purple-200 border-purple-400/30',
      actionType: 'brands',
    },
  ];

  return (
    <div ref={ref} className="my-6 sm:my-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4.5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const delayMs = idx * 120;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleCardClick(card.actionType)}
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-left text-white shadow-lg shadow-slate-900/10 dark:shadow-slate-950/50 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] group min-h-[170px] sm:min-h-[190px] flex flex-col justify-between border border-white/20 dark:border-slate-800/80 animate-on-scroll ${
                isVisible ? 'animate-fade-in-up' : ''
              }`}
              style={isVisible ? { animationDelay: `${delayMs}ms` } : undefined}
            >
              {/* High-res Photographic Background with smooth hover zoom */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Dynamic Gradient Overlay with glassmorphic depth */}
              <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} transition-opacity duration-300 group-hover:opacity-90`} />

              {/* Top Row: Icon Badge */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${card.badgeBg} backdrop-blur-md border flex items-center justify-center shadow-md shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 mt-4">
                <h3 className="text-base sm:text-lg font-black tracking-tight mb-1 text-white drop-shadow-md leading-tight">
                  {card.title}
                </h3>
                <p className="text-[11px] sm:text-xs font-medium text-slate-100/90 mb-3 drop-shadow-sm leading-relaxed">
                  {card.subtitle}
                </p>

                {/* Interactive CTA button link */}
                <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold ${card.accentColor} group-hover:text-white transition-colors`}>
                  <span>{card.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
