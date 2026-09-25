import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, Sparkles, MapPin, Store, ArrowRight, Package, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWishlist } from '../context/WishlistContext';
import { categoryTranslations } from '../utils/translations';
import { getCategoryIcon } from '../utils/categoryIcons';

export const ProductQuickViewModal = ({
  product,
  isOpen,
  onClose,
  allProducts = [],
  onSelectRelated,
}) => {
  const { t, isPortuguese, translateDynamic } = useLanguage();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [displayName, setDisplayName] = useState(product?.name || '');
  const [activeImage, setActiveImage] = useState(product?.imageUrl || '');

  const wishlisted = product?.id ? isWishlisted(product.id) : false;

  useEffect(() => {
    if (product?.name) {
      if (isPortuguese) {
        translateDynamic(product.name, 'pt').then((res) => setDisplayName(res));
      } else {
        setDisplayName(product.name);
      }
      setActiveImage(product.imageUrl || '');
    }
  }, [product, isPortuguese]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const categoryName = product.category?.name || '';
  const displayCategory = isPortuguese && categoryTranslations[categoryName]
    ? categoryTranslations[categoryName]
    : categoryName;

  const HeaderCategoryIcon = getCategoryIcon(categoryName);

  // Filter 4 related products in same category
  const related = allProducts
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.category?.name === categoryName))
    .slice(0, 4);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 dark:bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-sky-100 dark:border-slate-800 animate-in zoom-in-95 duration-200 relative z-[10000]">
        {/* Modal Header */}
        <div className="px-4 py-2.5 sm:px-6 sm:py-3 border-b border-sky-100 dark:border-slate-800 flex items-center justify-between bg-sky-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <HeaderCategoryIcon className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
              {t('productQuickViewTitle')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Body - compact without scrolling on typical screens */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3.5 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-5 items-center">
            {/* Left: Product Image */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative aspect-square w-full max-w-[200px] sm:max-w-[240px] rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 p-2.5 flex items-center justify-center overflow-hidden group shadow-xs">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={displayName}
                    className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <Package className="w-16 h-16 text-slate-300" />
                )}

                {/* Wishlist button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    wishlisted
                      ? 'bg-rose-50 dark:bg-rose-950/80 border border-rose-300 text-rose-500 shadow-md'
                      : 'bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 text-slate-400 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Right: Product Details & Physical Store Badges */}
            <div className="md:col-span-6 space-y-3.5">
              {displayCategory && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60">
                  {displayCategory}
                </span>
              )}

              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                {displayName}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {t('productOverviewDesc')}
              </p>

              {/* Physical Store Availability Callout */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    {t('inStockCascais')}
                  </h4>
                  <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400 font-medium">
                    Rua de Santa Margarida N.º 8, Cascais
                  </p>
                </div>
              </div>

              {/* Quality Guarantee Tag */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span>{t('guaranteedQuality')}</span>
              </div>
            </div>
          </div>

          {/* Related Products Showcase */}
          {related.length > 0 && (
            <div className="pt-4 border-t border-sky-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {t('relatedProductsTitle')}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {related.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onSelectRelated?.(rel)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-cyan-50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/80 transition-all text-left group cursor-pointer"
                  >
                    <div className="aspect-square w-full rounded-lg bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center p-1.5 mb-1.5">
                      <img
                        src={rel.imageUrl}
                        alt={rel.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 block group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                      {rel.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
