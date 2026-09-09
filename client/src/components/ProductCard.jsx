import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';

/**
 * Product Card Component (Pure Product Catalog Item - Strictly Non-Clickable)
 * Displays product image, category badge, and name with modern visual polish
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
    <div className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-card-hover dark:hover:shadow-slate-950/60 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-400/60 dark:hover:border-cyan-500/50">
      {/* Product Image Area with Clean Subtle Backdrop */}
      <div className="relative aspect-square w-full bg-slate-50/80 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center p-2.5">
        {/* Placeholder Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse" />
        )}

        {/* Fallback image if error occurs */}
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 p-3 text-center">
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
            className={`h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Subtle Category Pill Tag */}
        {displayCategory && (
          <div className="absolute top-2 left-2 pointer-events-none z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-slate-700 dark:text-cyan-300 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              {displayCategory}
            </span>
          </div>
        )}
      </div>

      {/* Product Name Ribbon */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-center text-center bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
        <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 line-clamp-2 transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-400 leading-snug tracking-tight">
          {displayName}
        </h3>
      </div>
    </div>
  );
};
