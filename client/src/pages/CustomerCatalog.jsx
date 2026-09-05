import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';
import { productService, categoryService } from '../services/catalogService';
import { useDebounce } from '../hooks/useDebounce';
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
  const [error, setError] = useState(null);

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
        }
      } catch (err) {
        setError(err.userFriendlyMessage || 'Could not fetch catalog items.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, debouncedSearch, selectedCategoryId, sortOption]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header with Search and Categories */}
      <Header
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Controls Ribbon: Active Filter Summary & Sorting Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {selectedCategoryId === 'all'
                ? debouncedSearch
                  ? `Search results for "${debouncedSearch}"`
                  : 'All Products'
                : categories.find((c) => c.id === selectedCategoryId)?.name || 'Category Products'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {selectedCategoryId !== 'all' || debouncedSearch
                ? `Showing ${paginationInfo.totalProducts} product${paginationInfo.totalProducts === 1 ? '' : 's'} matching criteria`
                : `${paginationInfo.totalProducts} total products available in store`}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label htmlFor="catalog-sort" className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </label>
            <select
              id="catalog-sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer shadow-2xs"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Loading State Skeleton Grid */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-soft animate-pulse"
              >
                <div className="aspect-square bg-slate-200/70" />
                <div className="p-4 flex flex-col items-center gap-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="my-12 p-8 max-w-lg mx-auto text-center bg-white rounded-2xl border border-rose-100 shadow-soft">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Failed to load catalog</h3>
            <p className="text-sm text-slate-500 mb-4">{error}</p>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="my-16 py-12 px-6 max-w-md mx-auto text-center bg-white rounded-3xl border border-dashed border-slate-200 shadow-soft">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No products found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 mb-6">
              {debouncedSearch
                ? `No products matched your search "${debouncedSearch}". Try different keywords or reset filters.`
                : 'There are no products listed in this category yet.'}
            </p>
            {(debouncedSearch || selectedCategoryId !== 'all') && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setSelectedCategoryId('all');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Clear all filters
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
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Store Product Catalog &copy; {new Date().getFullYear()} &bull; Browse Only Showcase
          </p>
        </div>
      </footer>
    </div>
  );
};
