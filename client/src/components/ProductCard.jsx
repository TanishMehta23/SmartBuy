import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWishlist } from '../context/WishlistContext';
import { categoryTranslations } from '../utils/translations';

/**
 * Product Card Component (Pure Product Catalog Item - Interactive Category & Wishlist)
 * Displays product image, category badge, wishlist heart, and name
 * Supports Dynamic Portuguese translation & Dark mode
 * Includes shimmer sweep on hover and scale-in image reveal
 */
export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = React.useRef(null);
  const { language, translateDynamic, isPortuguese, t } = useLanguage();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [displayName, setDisplayName] = useState(product?.name || '');
  const [heartAnimating, setHeartAnimating] = useState(false);

  const wishlisted = product?.id ? isWishlisted(product.id) : false;

  // Reset state when product changes and check if image is already cached/complete
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);

    if (imgRef.current) {
      if (imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        setImageLoaded(true);
      }
    }
  }, [product?.id, product?.imageUrl]);

  useEffect(() => {
    let isMounted = true;
    if (isPortuguese && product?.name) {
      translateDynamic(product.name, 'pt').then((translated) => {
        if (isMounted) setDisplayName(translated);
      });
    } else {
      setDisplayName(product?.name || '');
    }
    return () => {
      isMounted = false;
    };
  }, [product?.name, isPortuguese, language]);

  const categoryName = product?.category?.name;
  const displayCategory = isPortuguese && categoryName && categoryTranslations[categoryName]
    ? categoryTranslations[categoryName]
    : categoryName;

  const hasValidImage = Boolean(product?.imageUrl && !imageError);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (product?.id) {
      toggleWishlist(product.id);
      setHeartAnimating(true);
      setTimeout(() => setHeartAnimating(false), 400);
    }
  };

  return (
    <div className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-card-hover dark:hover:shadow-slate-950/60 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-400/60 dark:hover:border-cyan-500/50">
      {/* Product Image Area with Clean Subtle Backdrop */}
      <div className="relative aspect-square w-full bg-slate-50/80 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center p-2.5 shimmer-sweep">
        {/* Placeholder Skeleton behind image */}
        {!imageLoaded && hasValidImage && (
          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse" />
        )}

        {/* Fallback image if error occurs or no imageUrl */}
        {!hasValidImage ? (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 p-3 text-center">
            <span className="text-xs font-semibold">{t('imageUnavailable')}</span>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={product.imageUrl}
            alt={displayName}
            loading="lazy"
            decoding="async"
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            className={`relative z-1 h-full w-full object-contain object-center transition-all duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100 animate-scale-in' : 'opacity-0'
            }`}
          />
        )}

        {/* Category Pill Tag — bottom-left */}
        {displayCategory && (
          <div className="absolute bottom-2 left-2 z-10">
            {product?.category?.name || product?.categoryId || product?.category?.id ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const slug = product?.category?.name
                    ? product.category.name.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                    : product.categoryId || product.category.id;
                  navigate(`/category/${slug}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider bg-white/95 hover:bg-cyan-600 hover:text-white dark:bg-slate-900/95 dark:hover:bg-cyan-500 backdrop-blur-xs text-sky-700 dark:text-cyan-300 border border-sky-100 hover:border-cyan-600 dark:border-slate-700 shadow-2xs cursor-pointer transition-all duration-200 active:scale-95"
                title={`View ${displayCategory} category`}
              >
                {displayCategory}
              </button>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-sky-700 dark:text-cyan-300 border border-sky-100 dark:border-slate-700 shadow-2xs">
                {displayCategory}
              </span>
            )}
          </div>
        )}

        {/* Wishlist Heart Button — top-right */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
            wishlisted
              ? 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-800/60 shadow-sm'
              : 'bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700 shadow-xs opacity-0 group-hover:opacity-100'
          } ${wishlisted ? 'opacity-100' : ''} hover:scale-110 active:scale-90`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 ${
              wishlisted
                ? 'text-rose-500 fill-rose-500'
                : 'text-slate-400 dark:text-slate-500 hover:text-rose-400'
            } ${heartAnimating ? 'scale-125' : 'scale-100'}`}
          />
        </button>
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
