import React from 'react';
import { Search, X } from 'lucide-react';

export const Header = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:kx-8">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Logo, Store Title, Moto & NIPC */}
          <div className="flex items-center gap-3.5 shrink-0">
            <img
              src="/logo.png"
              alt="Smart Buy Logo"
              className="w-12 h-12 object-contain drop-shadow-sm hover:scale-105 transition-transform"
            />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-800">
                  Smart Buy
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-400 text-slate-900 tracking-wide shadow-xs">
                  NIPC 518263606
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                ONESHOP FOR SMART BUYERS
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-2 sm:mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products or category..."
                className="w-full pl-10 pr-9 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-full border border-slate-200/60 focus:border-cyan-500 focus:ring-3 focus:ring-cyan-500/15 transition-all outline-none"
              />
              {Boolean(searchQuery) && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter Pills Ribbon */}
        <div className="py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2 border-t border-slate-100">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategoryId === 'all'
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/25'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
            }`}
          >
            All Products
          </button>

          {categories.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
              >
                {category.name}
                {category.productCount !== undefined && (
                  <span
                    className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-cyan-700/60 text-white' : 'bg-slate-200/80 text-slate-500'
                    }`}
                  >
                    {category.productCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
