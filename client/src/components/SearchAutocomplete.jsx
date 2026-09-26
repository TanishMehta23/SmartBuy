import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Layers, Sparkles, ArrowRight, Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';

const slugify = (text) =>
  text
    ? text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    : '';

export const SearchAutocomplete = ({
  searchQuery,
  onSearchChange,
  categories = [],
  allProducts = [],
  onSelectProduct,
  onSelectCategory,
}) => {
  const navigate = useNavigate();
  const { t, isPortuguese } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const wrapperRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('smartbuy_recent_searches') || '[]');
      if (Array.isArray(saved)) setRecentSearches(saved.slice(0, 5));
    } catch (e) {
      // ignore
    }
  }, []);

  const saveRecentSearch = (term) => {
    if (!term || term.trim().length < 2) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('smartbuy_recent_searches', JSON.stringify(updated));
    } catch (e) {}
  };

  const removeRecentSearch = (e, termToRemove) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== termToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem('smartbuy_recent_searches', JSON.stringify(updated));
    } catch (e) {}
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const query = (searchQuery || '').trim().toLowerCase();

  // Filter Matching Categories
  const matchingCategories = categories.filter((cat) => {
    if (!query) return false;
    const nameMatch = cat.name.toLowerCase().includes(query);
    const ptMatch = isPortuguese && categoryTranslations[cat.name] && categoryTranslations[cat.name].toLowerCase().includes(query);
    return nameMatch || ptMatch;
  }).slice(0, 3);

  // Filter Matching Products
  const matchingProducts = allProducts.filter((p) => {
    if (!query) return false;
    return p.name.toLowerCase().includes(query);
  }).slice(0, 5);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      setIsOpen(false);
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (cat) => {
    saveRecentSearch(cat.name);
    setIsOpen(false);
    onSelectCategory?.(cat.id);
  };

  const handleSelectRecent = (term) => {
    onSearchChange(term);
    saveRecentSearch(term);
    setIsOpen(false);
    navigate(`/catalog?search=${encodeURIComponent(term)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const popularCats = categories.slice(0, 5);

  return (
    <div ref={wrapperRef} className="relative group flex-1">
      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery || ''}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setIsOpen(true);
            if (e.target.value) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-10 pr-9 py-2 sm:py-2.5 bg-slate-50/80 hover:bg-slate-100/70 focus:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:focus:bg-slate-900 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl sm:rounded-2xl border border-sky-200/80 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-3 focus:ring-cyan-500/15 transition-all outline-none"
        />
        {Boolean(searchQuery) && (
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              setIsOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title={t('clearSearch')}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-sky-100 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[420px] overflow-y-auto">
          {/* STATE 1: Empty Query - Show Recent Searches & Popular Categories */}
          {!query ? (
            <div className="p-3.5 space-y-3.5">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-500" />
                      {t('recentSearches')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectRecent(term)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-cyan-50 hover:text-cyan-700 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
                      >
                        <span>{term}</span>
                        <X
                          className="w-3 h-3 text-slate-400 hover:text-rose-500 transition-colors"
                          onClick={(e) => removeRecentSearch(e, term)}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              {popularCats.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {t('popularCategories')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {popularCats.map((cat) => {
                      const displayName = isPortuguese && categoryTranslations[cat.name]
                        ? categoryTranslations[cat.name]
                        : cat.name;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleSelectCategory(cat)}
                          className="flex items-center gap-2 p-2 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-cyan-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                            <Layers className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate">{displayName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* STATE 2: User Typed Query - Show Matching Products & Categories */
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Category Matches */}
              {matchingCategories.length > 0 && (
                <div className="p-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                    {t('suggestedCategories')}
                  </span>
                  {matchingCategories.map((cat) => {
                    const displayName = isPortuguese && categoryTranslations[cat.name]
                      ? categoryTranslations[cat.name]
                      : cat.name;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-cyan-50 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Layers className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                            {displayName}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 shrink-0">
                          <span>{t('exploreCollection')}</span>
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Product Matches */}
              {matchingProducts.length > 0 && (
                <div className="p-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                    {t('suggestedProducts', { query: searchQuery })}
                  </span>
                  {matchingProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        saveRecentSearch(product.name);
                        setIsOpen(false);
                        if (onSelectProduct) {
                          onSelectProduct(product);
                        } else {
                          navigate(`/catalog?search=${encodeURIComponent(product.name)}`);
                        }
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                          {product.name}
                        </h5>
                        {product.category?.name && (
                          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                            {isPortuguese && categoryTranslations[product.category.name]
                              ? categoryTranslations[product.category.name]
                              : product.category.name}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                        {t('viewProduct')}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* No matches */}
              {matchingCategories.length === 0 && matchingProducts.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('noSuggestionsFound')}
                  </p>
                </div>
              )}

              {/* View all search results banner */}
              <div className="p-2.5 bg-sky-50/50 dark:bg-slate-800/50">
                <button
                  type="button"
                  onClick={() => {
                    saveRecentSearch(searchQuery);
                    setIsOpen(false);
                    navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{t('pressEnterToSearch')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
