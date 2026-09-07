import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';
import { LoadingScreen } from '../components/LoadingScreen';
import { productService, categoryService } from '../services/catalogService';
import { useDebounce } from '../hooks/useDebounce';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';
import { ArrowUpDown, Layers, AlertCircle, Loader2 } from 'lucide-react';

export const CustomerCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    page: 1,
    limit: 25,
    totalProducts: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [error, setError] = useState(null);

  const { t, isPortuguese } = useLanguage();
  const debouncedSearch = useDebounce(searchInput, 400);

  // Load categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategoryId, sortOption]);

  // Fetch products when params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productService.getProducts({
          page: currentPage,
          limit: 25,
          search: debouncedSearch,
          categoryId: selectedCategoryId,
          sort: sortOption,
        });

        if (res.success) {
          setProducts(res.data);
          setPaginationInfo(res.pagination);
          setHasLoadedOnce(true);
        }
      } catch (err) {
        setError(err.userFriendlyMessage || 'Could not fetch catalog items.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, debouncedSearch, selectedCategoryId, sortOption]);

  // Show full loading screen on initial catalog load or when backend is waking up
  if (!hasLoadedOnce && loading && !error) {
    return <LoadingScreen />;
  }

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);
  const categoryDisplayName = selectedCategoryObj
    ? isPortuguese && categoryTranslations[selectedCategoryObj.name]
      ? categoryTranslations[selectedCategoryObj.name]
      : selectedCategoryObj.name
    : t('categoryProducts');

  return (
    <div className="min-h-screen flex flex-col bg-theme-bluish relative">
      {/* Header with Search and Categories */}
      <Header
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Controls Ribbon: Active Filter Summary & Sorting Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-sky-200/60">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>
                {selectedCategoryId === 'all'
                  ? debouncedSearch
                    ? `${t('searchResultsFor')} "${debouncedSearch}"`
                    : t('allProducts')
                  : categoryDisplayName}
              </span>
              {loading && <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />}
            </h1>
            <p className="text-xs sm:text-sm text-sky-700/80 font-medium mt-0.5">
              {loading && products.length === 0
                ? t('updatingCatalog')
                : selectedCategoryId !== 'all' || debouncedSearch
                ? paginationInfo.totalProducts === 1
                  ? t('matchingProductsCount', { count: paginationInfo.totalProducts })
                  : t('matchingProductsCountPlural', { count: paginationInfo.totalProducts })
                : t('totalProductsCount', { count: paginationInfo.totalProducts })}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-sky-100 shadow-xs">
            <label htmlFor="catalog-sort" className="text-xs font-bold text-sky-700 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-600" />
              <span>{t('sortLabel')}</span>
            </label>
            <select
              id="catalog-sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-sky-50/80 border border-sky-200 rounded-xl px-2.5 py-1 text-xs sm:text-sm font-semibold text-slate-700 hover:border-cyan-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all cursor-pointer"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="oldest">{t('sortOldest')}</option>
              <option value="name_asc">{t('sortNameAsc')}</option>
              <option value="name_desc">{t('sortNameDesc')}</option>
            </select>
          </div>
        </div>

        {/* Loading State Skeleton Grid when filtering/changing page after initial load */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5 opacity-60 pointer-events-none transition-opacity">
            {Array.from({ length: products.length || 10 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white/80 rounded-2xl border border-sky-100 overflow-hidden shadow-soft animate-pulse"
              >
                <div className="aspect-square bg-sky-100/70" />
                <div className="p-4 flex flex-col items-center gap-2">
                  <div className="h-4 bg-sky-100 rounded-full w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="my-12 p-8 max-w-lg mx-auto text-center bg-white/90 backdrop-blur-md rounded-3xl border border-rose-200/80 shadow-soft">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">{t('failedToLoadCatalog')}</h3>
            <p className="text-sm text-slate-500 mb-4">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all"
            >
              {t('tryAgain')}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="my-16 py-12 px-6 max-w-md mx-auto text-center bg-white/85 backdrop-blur-md rounded-3xl border border-dashed border-sky-200 shadow-soft">
            <div className="w-14 h-14 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center text-cyan-600 mx-auto mb-4 shadow-inner">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-800">{t('noProductsFound')}</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 mb-6">
              {debouncedSearch
                ? t('noProductsSearchHint', { query: debouncedSearch })
                : t('noProductsCategoryHint')}
            </p>
            {(debouncedSearch || selectedCategoryId !== 'all') && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setSelectedCategoryId('all');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-sky-700 hover:from-cyan-500 hover:to-sky-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/25 transition-all"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Server-Side Pagination Controls */}
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
      </main>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-md border-t border-sky-100/80 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-sky-700/60 font-medium">
            {t('footerText', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
};
