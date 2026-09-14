import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that detects when an element enters the viewport using IntersectionObserver.
 * Returns a ref to attach to the target element and a boolean `isVisible`.
 *
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (0-1). Default: 0.1
 * @param {string} options.rootMargin - Root margin. Default: '0px 0px -40px 0px'
 * @param {boolean} options.triggerOnce - Only trigger once. Default: true
 * @returns {{ ref: React.RefObject, isVisible: boolean }}
 */
export const useScrollAnimation = ({
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  triggerOnce = true,
} = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check prefers-reduced-motion — if so, just show immediately
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};
