import React from 'react';
import { ProductCard } from './ProductCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

/**
 * Wrapper around ProductCard that adds staggered scroll-triggered entrance animation.
 * Uses IntersectionObserver via useScrollAnimation to trigger once when the card
 * enters the viewport, with a computed delay based on its index for cascading reveals.
 */
export const AnimatedProductCard = ({ product, index = 0, onSelectProduct }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  // Compute stagger delay: max 600ms, steps of 75ms per card position within a row
  // Use modulo to reset delay per visual row (assume ~5 cards per row on desktop)
  const delayMs = (index % 5) * 75;

  return (
    <div
      ref={ref}
      className="animate-on-scroll"
      style={
        isVisible
          ? {
              opacity: 1,
              animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms forwards`,
            }
          : undefined
      }
    >
      <ProductCard product={product} onSelectProduct={onSelectProduct} />
    </div>
  );
};
