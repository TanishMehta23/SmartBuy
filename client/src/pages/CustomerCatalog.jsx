import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';
import { LoadingScreen } from '../components/LoadingScreen';
import { Footer } from '../components/Footer';
import { CustomSelect } from '../components/CustomSelect';
import { HeroBannerCarousel } from '../components/HeroBannerCarousel';
import { CategoryShowcaseRow } from '../components/CategoryShowcaseRow';
import { FeatureBadgesStrip } from '../components/FeatureBadgesStrip';
import { StoreExperienceShowcase } from '../components/StoreExperienceShowcase';
import { productService, categoryService, bannerService } from '../services/catalogService';
import { useDebounce } from '../hooks/useDebounce';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';
import { ArrowUpDown, Layers, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export const CustomerCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [allProductsForHome, setAllProductsForHome] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  
  // 24 for mobile (perfect 2-col grid), 25 for laptop (perfect 5-col grid)
  const [itemsPerPage, setItemsPerPage] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 24 : 25));

  const [paginationInfo, setPaginationInfo] = useState({
    page: 1,
    limit: 25,
    totalProducts: 0,
    totalPages: 1,
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [error, setError] = useState(null);

  const { t, isPortuguese } = useLanguage();
  const debouncedSearch = useDebounce(searchInput, 400);

  // Responsive page limit detector
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const targetLimit = isMobile ? 24 : 25;
      setItemsPerPage((prev) => (prev !== targetLimit ? targetLimit : prev));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to preload images before dismissing loading screen
  const preloadImages = (urls, timeoutMs = 3000) => {
    if (!urls || urls.length === 0) return Promise.resolve();
    const preloads = Promise.allSettled(
      urls.map(
        (url) =>
          new Promise((resolve) => {
            if (!url) return resolve();
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = url;
          })
      )
    );
    const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs));
    return Promise.race([preloads, timeout]);
  };

  // Initial Load: Categories, Banners, and Products
  // Loading screen will only dismiss after ALL data and initial critical images are fully loaded
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        const [catRes, bannerRes, homeProdRes] = await Promise.allSettled([
          categoryService.getCategories(),
          bannerService.getBanners(),
          productService.getProducts({ page: 1, limit: 100, sort: 'newest' }),
        ]);

        let initialCategories = [];
        let initialBanners = [];
        let initialHomeProducts = [];

        if (catRes.status === 'fulfilled' && catRes.value.success) {
          initialCategories = catRes.value.data || [];
          if (isMounted) setCategories(initialCategories);
        }

        if (bannerRes.status === 'fulfilled' && bannerRes.value.success) {
          initialBanners = bannerRes.value.data || [];
          if (isMounted) setBanners(initialBanners);
        }

        if (homeProdRes.status === 'fulfilled' && homeProdRes.value.success) {
          initialHomeProducts = homeProdRes.value.data || [];
          if (isMounted) {
            setAllProductsForHome(initialHomeProducts);
            setProducts(initialHomeProducts.slice(0, itemsPerPage));
            setPaginationInfo(
              homeProdRes.value.pagination || {
                page: 1,
                limit: itemsPerPage,
                totalProducts: initialHomeProducts.length,
                totalPages: Math.ceil(initialHomeProducts.length / itemsPerPage) || 1,
              }
            );
          }
        } else if (homeProdRes.status === 'rejected') {
          if (isMounted) {
            setError(homeProdRes.reason?.userFriendlyMessage || 'Could not fetch catalog items.');
          }
        }

        // Preload key visible above-the-fold images (banners + top 6 products) with fast timeout
        const imagesToPreload = [
          ...initialBanners.filter((b) => b.isActive !== false).map((b) => b.imageUrl),
          ...initialHomeProducts.slice(0, 6).map((p) => p.imageUrl),
        ].filter(Boolean);

        await preloadImages(imagesToPreload, 1200);
      } catch (err) {
        console.error('Failed to load initial data', err);
      } finally {
        if (isMounted) {
          setHasLoadedOnce(true);
          setIsInitialLoading(false);
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    const handleBannerUpdate = async () => {
      const bannerRes = await bannerService.getBanners();
      if (bannerRes.success) {
        setBanners(bannerRes.data);
      }
    };

    window.addEventListener('smartbuy_banners_updated', handleBannerUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('smartbuy_banners_updated', handleBannerUpdate);
    };
  }, []);

  // Reset to page 1 when search, category, or limit changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategoryId, sortOption, itemsPerPage]);

  // Fetch products when params change (only after initial load has finished)
  useEffect(() => {
    if (!hasLoadedOnce) return;

    // In home view without search, products are already in allProductsForHome
    if (selectedCategoryId === 'all' && !debouncedSearch && sortOption === 'newest') {
      setProducts(allProductsForHome.slice(0, itemsPerPage));
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productService.getProducts({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
          categoryId: selectedCategoryId === 'all-catalog' ? 'all' : selectedCategoryId,
          sort: sortOption,
        });

        if (res.success) {
          setProducts(res.data);
          setPaginationInfo(res.pagination);
        }
      } catch (err) {
        setError(err.userFriendlyMessage || 'Could not fetch catalog items.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [hasLoadedOnce, currentPage, debouncedSearch, selectedCategoryId, sortOption, itemsPerPage]);

  // Show full loading screen on initial catalog load until ALL data and assets are ready
  if (isInitialLoading && !error) {
    return <LoadingScreen />;
  }

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);
  const categoryDisplayName = selectedCategoryId === 'all-catalog'
    ? t('allProducts')
    : selectedCategoryObj
    ? isPortuguese && categoryTranslations[selectedCategoryObj.name]
      ? categoryTranslations[selectedCategoryObj.name]
      : selectedCategoryObj.name
    : t('categoryProducts');

  const isHomeView = selectedCategoryId === 'all' && !debouncedSearch;

  return (
    <div className="min-h-screen flex flex-col bg-theme-bluish relative w-full overflow-x-clip transition-colors duration-200">
      {/* Sticky Header with Search and Brand Controls */}
      <Header
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
        {/* Promotional Hero Banner Carousel (Above all products) */}
        {isHomeView && <HeroBannerCarousel banners={banners} />}

        {/* Feature Highlights Ribbon (Between Banner and Categories) */}
        {isHomeView && <FeatureBadgesStrip />}

        {/* Category Header or Home Showcase */}
        {isHomeView ? (
          /* HOMEPAGE VIEW: Render All Products starting showcase row + each category row */
          <div className="mt-1 space-y-4 sm:space-y-6">
            {/* 1. At Starting: All Products Showcase Row */}
            {allProductsForHome.length > 0 && (
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-sky-100/90 dark:border-slate-800 shadow-xs hover:shadow-soft dark:hover:shadow-slate-950/30 transition-all">
                <CategoryShowcaseRow
                  category={{ id: 'all', name: 'All Products' }}
                  products={allProductsForHome}
                  onSeeAll={() => {
                    setSelectedCategoryId('all-catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}

            {/* 2. Individual Categories Rows */}
            {categories.map((category) => {
              const categoryProducts = allProductsForHome.filter(
                (p) => p.categoryId === category.id
              );

              return (
                <div
                  key={category.id}
                  className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-sky-100/90 dark:border-slate-800 shadow-xs hover:shadow-soft dark:hover:shadow-slate-950/30 transition-all"
                >
                  <CategoryShowcaseRow
                    category={category}
                    products={categoryProducts}
                    onSeeAll={(catId) => {
                      setSelectedCategoryId(catId);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              );
            })}

            {/* Premium Cascais Store Experience & Photo Gallery Section */}
            <StoreExperienceShowcase />
          </div>
        ) : (
          /* CATEGORY / SEARCH DETAIL VIEW: Product Grid with Filter & Pagination */
          <>
            {/* Controls Ribbon */}
            <div className="relative z-30 flex items-center justify-between gap-2.5 sm:gap-4 mb-5 sm:mb-6 pb-3.5 sm:pb-4 border-b border-sky-200/60 dark:border-slate-800/80">
              <div className="min-w-0 flex-1">
                {selectedCategoryId !== 'all' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId('all');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 mb-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/90 hover:bg-sky-50 dark:hover:bg-slate-700/80 border border-sky-200/80 dark:border-slate-700 shadow-xs hover:shadow-sm hover:border-cyan-400 dark:hover:border-cyan-400 text-cyan-600 dark:text-cyan-400 transition-all duration-200 cursor-pointer group active:scale-97"
                  >
                    <div className="w-5 h-5 rounded-lg bg-sky-100/80 dark:bg-slate-900/80 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:-translate-x-0.5 transition-transform duration-200 shadow-2xs">
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </div>
                    <span>{t('backToCatalog') || 'Back to Store Catalog'}</span>
                  </button>
                )}
                <h1 className="font-display text-base sm:text-xl md:text-2xl lg:text-[1.75rem] font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span className="truncate">
                    {debouncedSearch
                      ? `${t('searchResultsFor')} "${debouncedSearch}"`
                      : categoryDisplayName}
                  </span>
                  {loading && <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500 animate-spin shrink-0" />}
                </h1>
                <p className="text-[11px] sm:text-xs md:text-sm text-sky-700/80 dark:text-cyan-400/80 font-medium mt-0.5 leading-tight">
                  {loading && products.length === 0
                    ? t('updatingCatalog')
                    : paginationInfo.totalProducts === 1
                    ? t('matchingProductsCount', { count: paginationInfo.totalProducts })
                    : t('matchingProductsCountPlural', { count: paginationInfo.totalProducts })}
                </p>
              </div>

              {/* Filter / Sort Dropdown */}
              <div className="shrink-0 ml-auto">
                <CustomSelect
                  options={[
                    { value: 'newest', label: t('sortNewest') },
                    { value: 'oldest', label: t('sortOldest') },
                    { value: 'name_asc', label: t('sortNameAsc') },
                    { value: 'name_desc', label: t('sortNameDesc') },
                  ]}
                  value={sortOption}
                  onChange={(val) => setSortOption(val)}
                  icon={ArrowUpDown}
                  label={t('filterLabel')}
                  align="right"
                  placeholder={t('filterLabel')}
                  buttonClassName="py-1.5 px-2.5 sm:py-2 sm:px-3.5 text-[11px] sm:text-xs md:text-sm"
                />
              </div>
            </div>

            {/* Loading State Skeleton */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5 opacity-60 pointer-events-none transition-opacity">
                {Array.from({ length: products.length || 10 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-sky-100 dark:border-slate-800 overflow-hidden shadow-soft animate-pulse"
                  >
                    <div className="aspect-square bg-sky-100/70 dark:bg-slate-800/70" />
                    <div className="p-4 flex flex-col items-center gap-2">
                      <div className="h-4 bg-sky-100 dark:bg-slate-800 rounded-full w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="my-12 p-8 max-w-lg mx-auto text-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-rose-200/80 dark:border-rose-900/50 shadow-soft">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">{t('failedToLoadCatalog')}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{error}</p>
                <button
                  onClick={() => {
                    setLoading(true);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  {t('tryAgain')}
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="my-16 py-12 px-6 max-w-md mx-auto text-center bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-3xl border border-dashed border-sky-200 dark:border-slate-800 shadow-soft">
                <div className="w-14 h-14 bg-sky-50 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 mx-auto mb-4 shadow-inner">
                  <Layers className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white">{t('noProductsFound')}</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-6">
                  {debouncedSearch
                    ? t('noProductsSearchHint', { query: debouncedSearch })
                    : t('noProductsCategoryHint')}
                </p>
                <button
                  onClick={() => {
                    setSearchInput('');
                    setSelectedCategoryId('all');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/25 transition-all cursor-pointer"
                >
                  {t('clearFilters')}
                </button>
              </div>
            )}

            {/* Product Grid for specific Category */}
            {!loading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                <Pagination
                  currentPage={paginationInfo.page}
                  totalPages={paginationInfo.totalPages}
                  totalProducts={paginationInfo.totalProducts}
                  limit={paginationInfo.limit}
                  onPageChange={(newPage) => {
                    setCurrentPage(newPage);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </>
            )}
          </>
        )}
      </main>

      {/* Professional Footer */}
      <Footer />
    </div>
  );
};
