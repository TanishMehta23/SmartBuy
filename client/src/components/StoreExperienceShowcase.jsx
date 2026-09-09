import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Store,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { storeSettingsService } from '../services/storeSettingsService';

export const StoreExperienceShowcase = () => {
  const { isPortuguese } = useLanguage();
  const [activePhoto, setActivePhoto] = useState(0);
  const [details, setDetails] = useState(null);

  const loadData = async () => {
    const res = await storeSettingsService.getStoreDetails();
    if (res.success) {
      setDetails(res.data);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('store_details_updated', loadData);
    return () => window.removeEventListener('store_details_updated', loadData);
  }, []);

  if (!details) return null;

  const photos = details.photos || [];
  const activeItem = photos[activePhoto] || photos[0];

  return (
    <div className="my-8 sm:my-12 relative overflow-hidden rounded-3xl sm:rounded-4xl border border-sky-100/90 dark:border-slate-800 bg-gradient-to-br from-white via-sky-50/40 to-cyan-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 p-5 sm:p-8 lg:p-10 shadow-soft dark:shadow-slate-950/50 backdrop-blur-md">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left Column: Store Story & Essential Contact Badges */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-cyan-100/80 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60 shadow-2xs">
            <Store className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">
              {isPortuguese ? details.badgeTextPt || details.badgeTextEn : details.badgeTextEn}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {isPortuguese ? (
              details.headlinePt || details.headlineEn
            ) : (
              details.headlineEn
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {isPortuguese ? details.descriptionPt || details.descriptionEn : details.descriptionEn}
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
            {/* Address */}
            <a
              href={details.mapUrl || "https://www.google.com/maps"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/80 hover:border-cyan-400 transition-all group/item shadow-2xs cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isPortuguese ? 'Morada' : 'Address'}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate block">
                  {details.address}
                </span>
              </div>
            </a>

            {/* Opening Hours */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/80 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isPortuguese ? 'Horário' : 'Hours'}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate block">
                  {isPortuguese ? details.hoursPt || details.hoursEn : details.hoursEn}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={details.mapUrl || "https://www.google.com/maps"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-600 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-extrabold shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer group active:scale-97"
            >
              <MapPin className="w-4 h-4" />
              <span>{isPortuguese ? 'Ver Localização no Mapa' : 'View Store on Google Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>

            {details.phone && (
              <a
                href={`tel:${details.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-sky-200/80 dark:border-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{details.phone}</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Photo Gallery Display */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          {/* Main Selected Image Showcase */}
          {activeItem && (
            <div className="relative aspect-[16/10] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-sky-100 dark:border-slate-700/80 group">
              <img
                src={activeItem.url}
                alt={isPortuguese ? activeItem.captionPt || activeItem.captionEn : activeItem.captionEn}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Tag Badge */}
              {(activeItem.tagEn || activeItem.tagPt) && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md shadow-md border border-white/20">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    {isPortuguese ? activeItem.tagPt || activeItem.tagEn : activeItem.tagEn}
                  </span>
                </div>
              )}
              {/* Bottom Caption Overlay */}
              {(activeItem.captionEn || activeItem.captionPt) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-5 text-white">
                  <p className="text-xs sm:text-sm font-semibold drop-shadow-sm">
                    {isPortuguese ? activeItem.captionPt || activeItem.captionEn : activeItem.captionEn}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Interactive Thumbnails Ribbon */}
          {photos.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {photos.map((photo, index) => {
                const isSelected = index === activePhoto;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActivePhoto(index)}
                    className={`relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-500 ring-2 ring-cyan-400/40 shadow-md scale-102'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.tagEn || 'Photo'}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
