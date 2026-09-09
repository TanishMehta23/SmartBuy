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
    <div className="my-6 sm:my-10 relative overflow-hidden rounded-3xl border border-sky-100/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-5 sm:p-7 lg:p-9 shadow-soft dark:shadow-slate-950/40 backdrop-blur-md">
      {/* Subtle Ambient Decorative Gradient */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Column: Store Story & Contact Badges */}
        <div className="lg:col-span-6 space-y-3.5 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60">
            <Store className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">
              {isPortuguese ? details.badgeTextPt || details.badgeTextEn : details.badgeTextEn}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Address */}
            <a
              href={details.mapUrl || "https://www.google.com/maps"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 hover:border-cyan-400 transition-all group/item cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-cyan-100/70 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isPortuguese ? 'Morada' : 'Address'}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate block">
                  {details.address}
                </span>
              </div>
            </a>

            {/* Opening Hours */}
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80">
              <div className="w-7 h-7 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isPortuguese ? 'Horário' : 'Hours'}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate block">
                  {isPortuguese ? details.hoursPt || details.hoursEn : details.hoursEn}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <a
              href={details.mapUrl || "https://www.google.com/maps"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white text-xs font-bold shadow-sm shadow-cyan-500/25 transition-all cursor-pointer group active:scale-97"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isPortuguese ? 'Ver Localização no Mapa' : 'View Store on Google Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>

            {details.phone && (
              <a
                href={`tel:${details.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{details.phone}</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Photo Gallery Display */}
        <div className="lg:col-span-6 flex flex-col gap-2.5">
          {/* Main Selected Image Showcase */}
          {activeItem && (
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-md border border-slate-200/80 dark:border-slate-800 group">
              <img
                src={activeItem.url}
                alt={isPortuguese ? activeItem.captionPt || activeItem.captionEn : activeItem.captionEn}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
              {/* Tag Badge */}
              {(activeItem.tagEn || activeItem.tagPt) && (
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur-md shadow-xs border border-white/20">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    {isPortuguese ? activeItem.tagPt || activeItem.tagEn : activeItem.tagEn}
                  </span>
                </div>
              )}
              {/* Bottom Caption Overlay */}
              {(activeItem.captionEn || activeItem.captionPt) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3.5 sm:p-4 text-white">
                  <p className="text-xs font-medium drop-shadow-sm">
                    {isPortuguese ? activeItem.captionPt || activeItem.captionEn : activeItem.captionEn}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Interactive Thumbnails Ribbon */}
          {photos.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {photos.map((photo, index) => {
                const isSelected = index === activePhoto;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActivePhoto(index)}
                    className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-500 ring-2 ring-cyan-400/30 shadow-xs scale-101'
                        : 'border-transparent opacity-65 hover:opacity-100'
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
