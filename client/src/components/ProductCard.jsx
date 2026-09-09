import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';

/**
 * Product Card Component (STRICTLY NON-CLICKABLE)
 * Displays product image, category badge, and name with premium visual polish
 * Supports Dynamic Portuguese translation & Dark mode
 */
export const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { language, translateDynamic, isPortuguese, t } = useLanguage();
  const [displayName, setDisplayName] = useState(product.name);

  useEffect(() => {
    let isMounted = true;
    if (isPortuguese) {
      translateDynamic(product.name, 'pt').then((translated) => {
        if (isMounted) setDisplayName(translated);
      });
    } else {
      setDisplayName(product.name);
    }
    return () => {
      isMounted = false;
    };
  }, [product.name, isPortuguese, language]);

  const categoryName = product.category?.name;
  const displayCategory = isPortuguese && categoryName && categoryTranslations[categoryName]
    ? categoryTranslations[categoryName]
    : categoryName;

  return (
    <div className="group relative flex flex-col h-full bg-white dark:bg-slate-900/95 rounded-2xl sm:rounded-3xl border border-sky-100/90 dark:border-slate-800/90 shadow-soft hover:shadow-card-hover dark:hover:shadow-cyan-950/40 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-cyan-300/80 dark:hover:border-cyan-500/60">
      {/* Product Image Area with Rich Ambient Backdrop */}
      <div className="relative aspect-square w-full bg-gradient-to-b from-slate-50/90 via-sky-50/30 to-slate-50/70 dark:from-slate-800/60 dark:via-slate-900/80 dark:to-slate-800/40 overflow-hidden flex items-center justify-center">
        {/* Placeholder Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-sky-100/70 dark:bg-slate-800/70 animate-pulse" />
        )}

        {/* Fallback image if error occurs */}
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center bg-sky-50/80 dark:bg-slate-800/80 text-sky-400 dark:text-sky-500 p-4 text-center">
            <span className="text-xs font-semibold">{t('imageUnavailable')}</span>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={displayName}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Frosted Category Pill Tag */}
        {displayCategory && (
          <div className="absolute top-2.5 left-2.5 pointer-events-none z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-slate-950/90 backdrop-blur-md text-slate-800 dark:text-cyan-300 shadow-2xs border border-white/80 dark:border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              {displayCategory}
            </span>
          </div>
        )}

        {/* Subtle Ambient Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Product Information Ribbon */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-center text-center bg-white dark:bg-slate-900 border-t border-sky-50 dark:border-slate-800/70 transition-colors">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-400 leading-snug tracking-tight">
          {displayName}
        </h3>
      </div>
    </div>
  );
};
