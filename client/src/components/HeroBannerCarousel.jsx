import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HeroBannerCarousel = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);
  const { t } = useLanguage();

  const activeBanners = banners.filter((b) => b.isActive !== false);

  // Auto-play interval
  useEffect(() => {
    if (activeBanners.length <= 1 || !isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4000); // 4 seconds auto-advance

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeBanners.length, isPlaying, isHovered, currentIndex]);

  if (!activeBanners || activeBanners.length === 0) {
    return null;
  }

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handleDotClick = (index, e) => {
    e?.stopPropagation();
    setCurrentIndex(index);
  };

  const togglePlayPause = (e) => {
    e?.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handleBannerClick = () => {
    if (currentBanner.linkUrl) {
      if (currentBanner.linkUrl.startsWith('http://') || currentBanner.linkUrl.startsWith('https://')) {
        window.open(currentBanner.linkUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = currentBanner.linkUrl;
      }
    }
  };

  return (
    <div
      className="relative w-full mb-6 sm:mb-8 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Banner Card Container with Rounded Borders & Shadow */}
      <div
        onClick={handleBannerClick}
        className={`relative w-full aspect-[21/9] sm:aspect-[24/9] md:aspect-[28/9] max-h-[340px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-sky-100 dark:border-slate-800 transition-all duration-300 ${
          currentBanner.linkUrl ? 'cursor-pointer hover:shadow-xl hover:scale-[1.005]' : ''
        }`}
      >
        {/* Slides Track */}
        {activeBanners.map((banner, index) => {
          const isCurrent = index === currentIndex;
          return (
            <div
              key={banner.id || index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Banner Image */}
              <img
                src={banner.imageUrl}
                alt={banner.title || 'Promotional Banner'}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* Gradient overlay for readability if title exists */}
              {banner.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4 sm:p-6 md:p-8">
                  <div className="max-w-xl text-white">
                    <h2 className="text-base sm:text-xl md:text-2xl font-black drop-shadow-md tracking-tight line-clamp-2">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="text-xs sm:text-sm font-medium text-slate-200 drop-shadow-sm mt-1 line-clamp-2 hidden sm:block">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Navigation Arrows (Dark rounded buttons matching the reference image) */}
        {activeBanners.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-xs flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer group-hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-xs flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer group-hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom Control Pill (Play/Pause + Dots) exactly like reference UI */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-sm border border-white/10 shadow-md transition-colors">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause banner slideshow' : 'Play banner slideshow'}
              className="text-white hover:text-cyan-300 transition-colors cursor-pointer p-0.5"
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            </button>

            <div className="w-[1px] h-3 bg-white/30 mx-0.5" />

            {/* Indicator Dots */}
            <div className="flex items-center gap-1.5">
              {activeBanners.map((_, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => handleDotClick(index, e)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive
                        ? 'w-4 sm:w-5 h-1.5 sm:h-2 bg-white shadow-xs'
                        : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
