import React, { useState } from 'react';

/**
 * Product Card Component (STRICTLY NON-CLICKABLE)
 * Displays ONLY product image and product name
 * No buttons, no links, no click handlers
 */
export const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden transition-all duration-300 hover:shadow-card hover:-translate-y-1">
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        {/* Placeholder Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}

        {/* Fallback image if error occurs */}
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <span className="text-xs font-medium">Image unavailable</span>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Subtle Category Badge Tag on Image */}
        {product.category?.name && (
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-white/90 backdrop-blur-md text-slate-700 shadow-sm border border-slate-200/60">
              {product.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Product Info: Name Only */}
      <div className="p-4 flex-1 flex items-center justify-center text-center">
        <h3 className="text-sm md:text-base font-semibold text-slate-800 line-clamp-2 transition-colors">
          {product.name}
        </h3>
      </div>
    </div>
  );
};
