import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';

/**
 * Product Card Component (STRICTLY NON-CLICKABLE)
 * Displays ONLY product image and product name
 * Supports Dynamic Portuguese translation
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
    <div className="group relative flex flex-col bg-white/90 backdrop-blur-md rounded-2xl border border-sky-100/90 shadow-soft overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 hover:border-sky-300/80">
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-sky-50/80 via-white to-sky-100/50 overflow-hidden">
        {/* Placeholder Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-sky-100 animate-pulse" />
        )}

        {/* Fallback image if error occurs */}
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center bg-sky-50/80 text-sky-400 p-4 text-center">
            <span className="text-xs font-medium">{t('imageUnavailable')}</span>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={displayName}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-108 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Subtle Category Badge Tag on Image with Glass effect */}
        {displayCategory && (
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-white/90 backdrop-blur-md text-sky-800 shadow-sm border border-sky-200/80">
              {displayCategory}
            </span>
          </div>
        )}

        {/* Subtle hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-sky-950/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Product Info: Name Only */}
      <div className="p-4 flex-1 flex items-center justify-center text-center bg-white/60">
        <h3 className="text-sm md:text-base font-bold text-slate-800 line-clamp-2 transition-colors group-hover:text-sky-600">
          {displayName}
        </h3>
      </div>
    </div>
  );
};
