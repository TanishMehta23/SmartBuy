import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Pagination = ({
  currentPage,
  totalPages,
  totalProducts,
  limit,
  onPageChange,
}) => {
  const { t } = useLanguage();

  if (totalPages <= 1 && totalProducts === 0) return null;

  const startItem = totalProducts === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalProducts);

  // Generate page number array with ellipsis if many pages
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-sky-200/60 dark:border-slate-800/80 mt-4">
      <div className="text-sm text-sky-800/80 dark:text-sky-300 font-medium">
        {t('showingItems', { start: startItem, end: endItem, total: totalProducts })}
      </div>

      <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-xs">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center p-2 rounded-xl text-sky-800 dark:text-slate-300 hover:bg-sky-100/80 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label={t('previousPage')}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Buttons */}
        {getPageNumbers().map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2.5 py-1.5 text-sky-400 dark:text-slate-600 font-bold select-none"
              >
                ...
              </span>
            );
          }

          const isActive = pageNum === currentPage;
          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[36px] h-9 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-600 dark:from-cyan-500 dark:to-sky-500 text-white shadow-md shadow-cyan-500/25 ring-2 ring-cyan-400/40'
                  : 'text-sky-900 dark:text-slate-300 hover:bg-sky-100/70 dark:hover:bg-slate-800 hover:text-sky-950 dark:hover:text-white'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center justify-center p-2 rounded-xl text-sky-800 dark:text-slate-300 hover:bg-sky-100/80 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label={t('nextPage')}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
