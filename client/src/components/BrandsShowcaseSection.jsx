import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Sparkles, Play, Pause } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Brand Data with Custom Embedded Vector SVG Logos for 100% Reliable Rendering
const BRANDS = [
  {
    name: 'Mimosa',
    categoryEn: 'Dairy & Fresh Milk',
    categoryPt: 'Laticínios & Leite',
    origin: 'Portugal',
    bg: '#005baa',
    renderLogo: () => (
      <svg viewBox="0 0 160 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="50" rx="8" fill="#005BAA" />
        <path d="M22 36V16h4.5l5.5 12.5L37.5 16H42v20h-3.8V22.2L33.2 34h-2.4L25.8 22.2V36H22zm26 0V16h4v20h-4zm9 0V16h4.2l5.2 12.5L71.6 16H76v20h-3.8V22.2L67.2 34h-2.4L59.8 22.2V36H57zm29 0.4c-6 0-10.5-4.5-10.5-10.4s4.5-10.4 10.5-10.4 10.5 4.5 10.5 10.4-4.5 10.4-10.5 10.4zm0-3.8c3.8 0 6.5-3 6.5-6.6s-2.7-6.6-6.5-6.6-6.5 3-6.5 6.6 2.7 6.6 6.5 6.6zm22.5 3.8c-5.5 0-9-3-9-7.2h4c0 2.2 2.2 3.6 5 3.6s4.8-1.2 4.8-3.2c0-1.8-1.5-2.6-4.5-3.3-4.5-1-8.5-2.2-8.5-6.8 0-4 3.5-6.9 8.2-6.9s8.2 2.8 8.2 6.8h-4c0-2-1.8-3.2-4.2-3.2s-4.2 1.2-4.2 3.1c0 1.8 1.4 2.5 4.5 3.2 4.6 1 8.5 2.2 8.5 6.8 0 4.2-3.6 7.1-8.8 7.1zm19.5-0.4l-2.2-6.2h-9.6l-2.2 6.2h-4.2L132 16h4.5l7.5 20h-4.5zm-7-16.5l-3.6 10h7.2l-3.6-10z" fill="#FFFFFF" />
        <circle cx="148" cy="18" r="3.5" fill="#FFCC00" />
      </svg>
    ),
  },
  {
    name: 'Compal',
    categoryEn: 'Natural Juices & Nectars',
    categoryPt: 'Sumos & Néctares Naturais',
    origin: 'Portugal',
    bg: '#e85d04',
    renderLogo: () => (
      <svg viewBox="0 0 160 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="50" rx="8" fill="#E85D04" />
        <path d="M34 36.4c-6.8 0-12-5.2-12-12s5.2-12 12-12c4.8 0 8.8 2.6 10.8 6.6l-3.8 2.2c-1.4-2.8-4-4.6-7-4.6-4.4 0-7.8 3.6-7.8 7.8s3.4 7.8 7.8 7.8c3 0 5.6-1.8 7-4.6l3.8 2.2c-2 4-6 6.6-10.8 6.6zm22.5 0c-6.6 0-11.5-5-11.5-11.8s4.9-11.8 11.5-11.8 11.5 5 11.5 11.8-4.9 11.8-11.5 11.8zm0-4.2c4 0 7.2-3.4 7.2-7.6s-3.2-7.6-7.2-7.6-7.2 3.4-7.2 7.6 3.2 7.6 7.2 7.6zm19.5 3.8V13h4.2l5.6 12.8L91.4 13h4.2v23h-4V20.2L86 31.8h-2.4L78 20.2V36h-4zm24.5 0V13h9c4.8 0 8.2 3.2 8.2 7.8 0 4.6-3.4 7.8-8.2 7.8h-5v7.4h-4zm4-11.2h4.8c2.4 0 4.2-1.6 4.2-4s-1.8-4-4.2-4h-4.8v8zm25.5 11.2l-2-5.8h-9.8l-2 5.8h-4.2L125 13h4.5l8 23h-4.5zm-6.9-16.2l-3.6 10.4h7.2l-3.6-10.4zm16.4 16.2V13h4v19.4h8.5V36h-12.5z" fill="#FFFFFF" />
        <path d="M148 10c-3 0-5.5 2.5-5.5 5.5 3 0 5.5-2.5 5.5-5.5z" fill="#80B918" />
      </svg>
    ),
  },
  {
    name: 'Delta Cafés',
    categoryEn: 'Coffee & Whole Roasts',
    categoryPt: 'Cafés & Torras Selecionadas',
    origin: 'Portugal',
    bg: '#6f1d1b',
    renderLogo: () => (
      <svg viewBox="0 0 170 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="170" height="50" rx="8" fill="#540B0E" />
        <path d="M22 14h9c7 0 12 4.5 12 11s-5 11-12 11h-9V14zm4.5 18h4.5c4.5 0 7.5-2.8 7.5-7s-3-7-7.5-7h-4.5v14zm24.5 4V14h15v4h-10.5v5h9.5v4h-9.5v5h11v4H51zm19 0V14h4.5v18h10.5v4H70zm18.5 0V18h-6v-4h16.5v4h-6v18h-4.5zm23.5 0l-2-5.5h-9.5l-2 5.5h-4.5L122 14h5l8.5 22h-4.5zm-6.8-15.5l-3.5 10h7l-3.5-10z" fill="#F4E9CD" />
        <path d="M142 22l4-8 4 8h-8z" fill="#E09F3E" />
        <text x="136" y="34" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#F4E9CD">CAFÉS</text>
      </svg>
    ),
  },
  {
    name: 'Gallo',
    categoryEn: 'Olive Oils & Vinegars',
    categoryPt: 'Azeites & Vinagres',
    origin: 'Portugal',
    bg: '#1b4332',
    renderLogo: () => (
      <svg viewBox="0 0 160 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="50" rx="8" fill="#1B4332" />
        {/* Stylized Portuguese Rooster silhouette */}
        <circle cx="28" cy="22" r="7" fill="#D8F3DC" />
        <path d="M28 15c-2-3-1-6 2-7 0 3 2 4 4 4-1 2-2 3-6 3z" fill="#D00000" />
        <path d="M48 36.4c-6.8 0-12-5.2-12-12s5.2-12 12-12c4.8 0 8.6 2.4 10.6 6.4l-3.8 2.2c-1.4-2.6-3.8-4.4-6.8-4.4-4.4 0-7.8 3.6-7.8 7.8s3.4 7.8 7.8 7.8c3.2 0 5.6-1.8 6.8-4.2h-6.8v-4h11v11.8c-2.4 2.8-6.4 4.6-11 4.6zm23.5-0.4l-2-5.8h-9.8l-2 5.8h-4.2L61 13h4.5l8 23h-4.5zm-6.9-16.2l-3.6 10.4h7.2l-3.6-10.4zm16.4 16.2V13h4v19.4h8.5V36H81zm15 0V13h4v19.4h8.5V36H96zm22.5 0.4c-6.6 0-11.5-5-11.5-11.8s4.9-11.8 11.5-11.8 11.5 5 11.5 11.8-4.9 11.8-11.5 11.8zm0-4.2c4 0 7.2-3.4 7.2-7.6s-3.2-7.6-7.2-7.6-7.2 3.4-7.2 7.6 3.2 7.6 7.2 7.6z" fill="#D8F3DC" />
      </svg>
    ),
  },
  {
    name: 'Nestlé',
    categoryEn: 'Breakfast & Pantry',
    categoryPt: 'Pequeno-Almoço & Despensa',
    origin: 'Switzerland',
    bg: '#005f73',
    renderLogo: () => (
      <svg viewBox="0 0 160 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="50" rx="8" fill="#005F73" />
        <text x="20" y="34" fontFamily="Impact, Arial Black, sans-serif" fontSize="28" fontStyle="italic" fill="#FFFFFF" letterSpacing="1">
          Nestlé
        </text>
        <path d="M19 14h42v3H19z" fill="#E63946" />
      </svg>
    ),
  },
  {
    name: 'Danone',
    categoryEn: 'Fresh Yogurts & Bio',
    categoryPt: 'Iogurtes & Bio',
    origin: 'France',
    bg: '#0077b6',
    renderLogo: () => (
      <svg viewBox="0 0 160 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="50" rx="8" fill="#0077B6" />
        <text x="24" y="32" fontFamily="Arial, Helvetica, sans-serif" fontSize="24" fontWeight="900" fill="#FFFFFF" letterSpacing="1">
          DANONE
        </text>
        <path d="M30 38c30 6 70 6 100 0" stroke="#E63946" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Milka',
    categoryEn: 'Alpine Chocolates',
    categoryPt: 'Chocolates Alpinos',
    origin: 'Switzerland',
    bg: '#5e503f',
    renderLogo: () => (
      <svg viewBox="0 0 160 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="50" rx="8" fill="#6B5B95" />
        <text x="32" y="35" fontFamily="'Brush Script MT', cursive, sans-serif" fontSize="34" fontStyle="italic" fontWeight="bold" fill="#FFFFFF">
          Milka
        </text>
        <circle cx="134" cy="22" r="3" fill="#FFFFFF" opacity="0.8" />
      </svg>
    ),
  },
  {
    name: 'Lipton',
    categoryEn: 'Herbal Teas & Infusions',
    categoryPt: 'Chás & Infusões',
    origin: 'Global',
    bg: '#ffb703',
    renderLogo: () => (
      <svg viewBox="0 0 160 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="50" rx="8" fill="#FB8500" />
        <circle cx="80" cy="25" r="21" fill="#FFB703" />
        <rect x="25" y="16" width="110" height="18" rx="4" fill="#D00000" />
        <text x="44" y="30" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fontStyle="italic" fill="#FFFFFF">
          Lipton
        </text>
      </svg>
    ),
  },
  {
    name: 'Nobre',
    categoryEn: 'Traditional Charcuterie',
    categoryPt: 'Charcutaria Tradicional',
    origin: 'Portugal',
    bg: '#9b2226',
    renderLogo: () => (
      <svg viewBox="0 0 160 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="50" rx="8" fill="#9B2226" />
        <path d="M80 8l4 6h-8l4-6zm-10 6l3 4h-6l3-4zm20 0l3 4h-6l3-4z" fill="#E9D8A6" />
        <text x="36" y="36" fontFamily="Georgia, serif" fontSize="24" fontWeight="bold" fill="#FFFFFF" letterSpacing="2">
          NOBRE
        </text>
      </svg>
    ),
  },
  {
    name: 'Super Bock',
    categoryEn: 'Beer & Beverages',
    categoryPt: 'Cervejas & Bebidas',
    origin: 'Portugal',
    bg: '#b7094c',
    renderLogo: () => (
      <svg viewBox="0 0 170 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="170" height="50" rx="8" fill="#89023E" />
        <circle cx="28" cy="25" r="14" fill="#CC0000" stroke="#FFD166" strokeWidth="2" />
        <path d="M28 17l2 4.5 4.8.4-3.6 3.2 1 4.8-4.2-2.5-4.2 2.5 1-4.8-3.6-3.2 4.8-.4z" fill="#FFD166" />
        <text x="48" y="26" fontFamily="Arial Black, sans-serif" fontSize="12" fontWeight="900" fill="#FFFFFF">
          SUPER
        </text>
        <text x="48" y="38" fontFamily="Arial Black, sans-serif" fontSize="12" fontWeight="900" fill="#FFD166">
          BOCK
        </text>
      </svg>
    ),
  },
  {
    name: 'Sumol',
    categoryEn: 'Fruit Sodas',
    categoryPt: 'Refrigerantes de Fruta',
    origin: 'Portugal',
    bg: '#2d6a4f',
    renderLogo: () => (
      <svg viewBox="0 0 160 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="50" rx="8" fill="#2D6A4F" />
        <circle cx="34" cy="25" r="12" fill="#F77F00" />
        <circle cx="34" cy="25" r="8" fill="#FCBF49" />
        <text x="56" y="33" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="bold" fontStyle="italic" fill="#FFFFFF">
          SUMOL
        </text>
      </svg>
    ),
  },
  {
    name: 'Barilla',
    categoryEn: 'Artisan Pasta & Sauces',
    categoryPt: 'Massas & Molhos Italianos',
    origin: 'Italy',
    bg: '#003049',
    renderLogo: () => (
      <svg viewBox="0 0 160 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="50" rx="8" fill="#003049" />
        <ellipse cx="80" cy="25" rx="55" ry="18" fill="#D62828" />
        <text x="44" y="32" fontFamily="Times New Roman, serif" fontSize="24" fontWeight="bold" fontStyle="italic" fill="#FFFFFF">
          Barilla
        </text>
      </svg>
    ),
  },
  {
    name: 'Nutella',
    categoryEn: 'Hazelnut Spreads',
    categoryPt: 'Cremes de Avelã',
    origin: 'Italy',
    bg: '#3d0c02',
    renderLogo: () => (
      <svg viewBox="0 0 160 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="50" rx="8" fill="#F8F9FA" stroke="#E9ECEF" strokeWidth="1" />
        <text x="24" y="34" fontFamily="Arial Black, Helvetica, sans-serif" fontSize="26" fontWeight="900" fill="#212529">
          n<tspan fill="#D90429">utella</tspan>
        </text>
      </svg>
    ),
  },
  {
    name: 'Oliveira da Serra',
    categoryEn: 'Extra Virgin Olive Oils',
    categoryPt: 'Azeite Virgem Extra',
    origin: 'Portugal',
    bg: '#132a13',
    renderLogo: () => (
      <svg viewBox="0 0 180 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="180" height="50" rx="8" fill="#132A13" />
        <path d="M22 25c0-6 5-11 11-11s11 5 11 11-5 11-11 11-11-5-11-11z" fill="#31572C" />
        <circle cx="33" cy="25" r="5" fill="#ECF39E" />
        <text x="50" y="24" fontFamily="Georgia, serif" fontSize="11" fontWeight="bold" fill="#ECF39E">
          OLIVEIRA
        </text>
        <text x="50" y="37" fontFamily="Georgia, serif" fontSize="10" fill="#FFFFFF">
          DA SERRA
        </text>
      </svg>
    ),
  },
  {
    name: 'Heinz',
    categoryEn: 'Sauces & Condiments',
    categoryPt: 'Molhos & Condimentos',
    origin: 'Global',
    bg: '#9e2a2b',
    renderLogo: () => (
      <svg viewBox="0 0 160 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="50" rx="8" fill="#9E2A2B" />
        <polygon points="40,10 120,10 130,25 120,40 40,40 30,25" fill="#540B0E" stroke="#FFD166" strokeWidth="1.5" />
        <text x="54" y="31" fontFamily="Georgia, serif" fontSize="18" fontWeight="bold" fill="#FFFFFF" letterSpacing="1">
          HEINZ
        </text>
      </svg>
    ),
  },
  {
    name: 'Oreo',
    categoryEn: 'Cookies & Treats',
    categoryPt: 'Bolachas & Biscoitos',
    origin: 'Global',
    bg: '#001845',
    renderLogo: () => (
      <svg viewBox="0 0 160 50" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="50" rx="8" fill="#001845" />
        <text x="36" y="35" fontFamily="Arial Black, Impact, sans-serif" fontSize="28" fontWeight="900" fontStyle="italic" fill="#00B4D8" stroke="#FFFFFF" strokeWidth="1.5">
          OREO
        </text>
      </svg>
    ),
  },
];

export const BrandsShowcaseSection = () => {
  const navigate = useNavigate();
  const { t, isPortuguese } = useLanguage();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [isPaused, setIsPaused] = useState(false);

  const handleBrandClick = (brandName) => {
    navigate(`/catalog?search=${encodeURIComponent(brandName)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Duplicate for smooth seamless infinite loop
  const marqueeList = [...BRANDS, ...BRANDS];

  return (
    <section ref={ref} className="my-6 sm:my-10">
      <div className="relative overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-sky-100 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
        {/* Ambient Subtle Cyan Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-cyan-400/10 via-sky-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Section Top Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60 mb-1.5">
              <Award className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              <span>{t('brandsBadge')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('brandsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {t('brandsSubtitle')}
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-1 sm:pt-0 shrink-0">
            {/* Play / Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-2xs"
              title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3 text-emerald-600" />
                  <span>{isPortuguese ? 'Reproduzir' : 'Play'}</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-slate-500" />
                  <span>{isPortuguese ? 'Pausar' : 'Pause'}</span>
                </>
              )}
            </button>

            {/* Explore All Brands */}
            <button
              type="button"
              onClick={() => {
                navigate('/catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50/90 hover:bg-cyan-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-cyan-200/60 dark:border-slate-700 transition-all cursor-pointer group shadow-2xs whitespace-nowrap active:scale-95"
            >
              <span>{t('allBrands')}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* ─── Gentle Infinite Auto-Scrolling Brand Ticker ─── */}
        <div className="relative z-10 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-50 via-sky-50/40 to-slate-50 dark:from-slate-800/40 dark:via-slate-800/20 dark:to-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 py-2.5 sm:py-4 pause-on-hover">
          {/* Smooth Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-16 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-16 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

          <div
            className="animate-marquee gap-2.5 sm:gap-4 items-center"
            style={isPaused ? { animationPlayState: 'paused' } : undefined}
          >
            {marqueeList.map((brand, idx) => (
              <button
                key={`marquee-${brand.name}-${idx}`}
                type="button"
                onClick={() => handleBrandClick(brand.name)}
                className="inline-flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800/95 hover:bg-cyan-50/90 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-400 transition-all cursor-pointer shadow-2xs hover:shadow-md group shrink-0 active:scale-95"
                title={t('exploreBrand', { name: brand.name })}
              >
                {/* Brand Custom Vector Logo Container */}
                <div className="flex items-center justify-center rounded-lg sm:rounded-xl overflow-hidden shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  {brand.renderLogo()}
                </div>

                {/* Brand Details */}
                <div className="text-left min-w-[80px] sm:min-w-[110px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 block leading-tight">
                      {brand.name}
                    </span>
                    <span className="text-[8px] sm:text-[8.5px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                      {brand.origin}
                    </span>
                  </div>
                  <span className="text-[9.5px] sm:text-[10px] text-slate-400 dark:text-slate-400 font-medium block mt-0.5">
                    {isPortuguese ? brand.categoryPt : brand.categoryEn}
                  </span>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* ─── Quality Guarantee Badges ─── */}
        <div className="relative z-10 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 text-[10.5px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{isPortuguese ? 'Produtos 100% Originais de Fornecedores Oficiais' : '100% Genuine Direct Store Suppliers'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{isPortuguese ? 'Garantia de Qualidade & Frescura' : 'Certified Freshness & Quality Guaranteed'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
