import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Store,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { storeSettingsService } from '../services/storeSettingsService';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const StoreExperienceShowcase = () => {
  const { isPortuguese, translateDynamic } = useLanguage();
  const [activePhoto, setActivePhoto] = useState(0);
  const [translatedHours, setTranslatedHours] = useState('');
  const [translatedCaption, setTranslatedCaption] = useState('');
  const [translatedTag, setTranslatedTag] = useState('');
  const [details, setDetails] = useState({
    badgeTextEn: 'Visit Our Store in Cascais',
    badgeTextPt: 'Visite a Nossa Loja em Cascais',
    headlineEn: 'Your Smart, Premium & Fresh Supermarket',
    headlinePt: 'A Sua Experiência de Compras Inteligente & Fresca',
    descriptionEn: 'Located in the heart of Cascais, Smart Buy brings you handpicked essentials, artisanal bakery, farm-fresh produce, and daily lifestyle items with an unmatched in-store experience.',
    descriptionPt: 'Localizado no coração de Cascais, o Smart Buy oferece uma seleção rigorosa de produtos de alta qualidade, padaria artesanal, itens essenciais do dia a dia e atendimento dedicado.',
    address: 'Rua de Santa Margarida N.º 8, 2750-112 Cascais, Portugal',
    hoursEn: 'Open Daily • Closes 8:00 PM',
    hoursPt: 'Aberto Todos os Dias até às 20h00',
    phone: '+351 21 484 3122',
    mapUrl: 'https://maps.app.goo.gl/88x5p8bFx5cojFvv7',
    photos: [
      {
        url: '/store_aisles.jpg',
        tagEn: 'Modern Aisles',
        tagPt: 'Corredores Modernos',
        captionEn: 'Spacious and organized supermarket aisles',
        captionPt: 'Corredores espaçosos e organizados',
      },
      {
        url: '/store_produce.jpg',
        tagEn: 'Fresh Produce',
        tagPt: 'Hortifruti Fresco',
        captionEn: 'Daily farm-fresh fruits & organic greens',
        captionPt: 'Frutas e vegetais frescos todos os dias',
      },
      {
        url: '/store_bakery.jpg',
        tagEn: 'Artisan Bakery',
        tagPt: 'Padaria & Confeitaria',
        captionEn: 'Fresh artisan breads and traditional pastries',
        captionPt: 'Pães quentes e pastelaria tradicional',
      },
      {
        url: '/store_cellar.jpg',
        tagEn: 'Beverages & Cellar',
        tagPt: 'Garrafeira & Bebidas',
        captionEn: 'Fine selection of regional wines & drinks',
        captionPt: 'Grande seleção de vinhos e bebidas',
      },
    ],
  });
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const loadData = async () => {
    const res = await storeSettingsService.getStoreDetails();
    if (res.success && res.data) {
      setDetails(res.data);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('store_details_updated', loadData);
    return () => window.removeEventListener('store_details_updated', loadData);
  }, []);

  const photos = details.photos || [];
  const activeItem = photos[activePhoto] || photos[0];

  // Dynamic automatic translation to Portuguese when language is set to PT
  useEffect(() => {
    let isMounted = true;
    if (isPortuguese) {
      if (details.hoursEn) {
        translateDynamic(details.hoursEn, 'pt').then((t) => {
          if (isMounted) setTranslatedHours(t);
        });
      }
      if (activeItem?.captionEn) {
        translateDynamic(activeItem.captionEn, 'pt').then((t) => {
          if (isMounted) setTranslatedCaption(t);
        });
      }
      if (activeItem?.tagEn) {
        translateDynamic(activeItem.tagEn, 'pt').then((t) => {
          if (isMounted) setTranslatedTag(t);
        });
      }
    } else {
      setTranslatedHours('');
      setTranslatedCaption('');
      setTranslatedTag('');
    }
    return () => {
      isMounted = false;
    };
  }, [isPortuguese, details.hoursEn, activeItem?.captionEn, activeItem?.tagEn, translateDynamic]);

  if (!details) return null;

  return (
    <section
      ref={sectionRef}
      className={`w-full my-0 animate-on-scroll ${isVisible ? 'animate-fade-in-up' : ''}`}
      aria-label={isPortuguese ? 'Informações da Loja e Localização' : 'Store Information and Location'}
    >
      <div className="w-full rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 lg:p-7 shadow-xs transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ========================================================================= */}
          {/* LEFT / MAIN COLUMN: Store Info, Hours, Address & CTA Buttons              */}
          {/* Mobile: Header on top, then Gallery (via order), then Info & CTAs below   */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-center gap-3 sm:gap-3.5 order-1 lg:order-1 min-w-0">
            {/* Header Block: Title & Description */}
            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl lg:text-[1.5rem] font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                {isPortuguese ? (
                  details.headlinePt || details.headlineEn
                ) : (
                  details.headlineEn
                )}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                {isPortuguese ? details.descriptionPt || details.descriptionEn : details.descriptionEn}
              </p>
            </div>

            {/* Quick Info Grid: Address & Opening Hours Cards (Equal Height) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 order-3 lg:order-2">
              {/* Address Card */}
              <a
                href={details.mapUrl || "https://www.google.com/maps"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-cyan-400 dark:hover:border-cyan-500/60 hover:bg-slate-100/70 dark:hover:bg-slate-800/90 transition-all duration-200 group/addr cursor-pointer h-full"
                aria-label={`${isPortuguese ? 'Abrir no Google Maps' : 'Open in Google Maps'}: ${details.address}`}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-100/90 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 group-hover/addr:scale-105 transition-transform">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-0.5">
                    {isPortuguese ? 'Morada' : 'Address'}
                  </span>
                  <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-snug block">
                    {details.address}
                  </span>
                </div>
              </a>

              {/* Opening Hours Card */}
              <div className="flex items-start gap-2.5 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 h-full">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-0.5">
                    {isPortuguese ? 'Horário' : 'Hours'}
                  </span>
                  <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-snug block">
                    {isPortuguese
                      ? translatedHours || details.hoursPt || details.hoursEn
                      : details.hoursEn}
                  </span>
                  <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                    {isPortuguese ? 'Aberto todos os dias' : 'Open 7 days a week'}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons: Google Maps (Primary) & Phone (Secondary) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 order-4 lg:order-3">
              <a
                href={details.mapUrl || "https://www.google.com/maps"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white text-xs sm:text-[13px] font-bold shadow-xs transition-all duration-200 cursor-pointer group active:scale-[0.99] text-center whitespace-nowrap min-h-[38px] sm:min-h-[40px]"
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{isPortuguese ? 'Ver no Google Maps' : 'View on Google Maps'}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </a>

              {details.phone && (
                <a
                  href={`tel:${details.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer text-center hover:border-cyan-400/60 dark:hover:border-cyan-500/50 active:scale-[0.99] whitespace-nowrap min-h-[38px] sm:min-h-[40px]"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span className="truncate">{details.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Premium Supermarket Photo Gallery Showcase                  */}
          {/* Mobile: Sits directly below heading/description before address cards      */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-3 order-2 lg:order-2 w-full min-w-0">
            {/* Main Featured Photo Display */}
            {activeItem && (
              <div className="relative aspect-[16/10] sm:aspect-[16/9.5] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-slate-900 group shadow-xs">
                <img
                  src={activeItem.url}
                  alt={isPortuguese ? translatedCaption || activeItem.captionPt || activeItem.captionEn : activeItem.captionEn}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                />

                {/* Subtle, Tasteful Image Tag Overlay */}
                {(activeItem.tagEn || activeItem.tagPt) && (
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/20 shadow-xs">
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                      <span>
                        {isPortuguese
                          ? translatedTag || activeItem.tagPt || activeItem.tagEn
                          : activeItem.tagEn}
                      </span>
                    </span>
                  </div>
                )}

                {/* Subtle Image Bottom Caption Overlay */}
                {(activeItem.captionEn || activeItem.captionPt) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-3 sm:p-3.5 text-white pointer-events-none">
                    <p className="text-xs font-medium text-slate-100 drop-shadow-sm truncate">
                      {isPortuguese
                        ? translatedCaption || activeItem.captionPt || activeItem.captionEn
                        : activeItem.captionEn}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Thumbnail Navigation Strip */}
            {photos.length > 1 && (
              <div
                className="grid grid-cols-4 gap-2 sm:gap-2.5 w-full"
                role="tablist"
                aria-label={isPortuguese ? 'Fotos da loja' : 'Store photo gallery'}
              >
                {photos.map((photo, index) => {
                  const isSelected = index === activePhoto;
                  const photoTag = isPortuguese
                    ? photo.tagPt || photo.tagEn
                    : photo.tagEn;

                  return (
                    <button
                      key={index}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      aria-label={`${isPortuguese ? 'Ver foto' : 'View photo'} ${index + 1}: ${photoTag || 'Supermarket'}`}
                      onClick={() => setActivePhoto(index)}
                      className={`relative aspect-[16/10] rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                        isSelected
                          ? 'border-cyan-500 shadow-sm opacity-100 ring-2 ring-cyan-400/20'
                          : 'border-slate-200/80 dark:border-slate-700/80 opacity-70 hover:opacity-100 hover:scale-[1.03] hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photoTag || 'Supermarket Photo'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
