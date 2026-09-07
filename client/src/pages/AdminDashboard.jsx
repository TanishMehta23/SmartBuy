import React, { useState, useEffect } from 'react';
import { productService } from '../services/catalogService';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';
import { Package, FolderTree, ArrowRight, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardRecentProductRow = ({ prod, displayCategory }) => {
  const { isPortuguese, translateDynamic, language } = useLanguage();
  const [displayName, setDisplayName] = useState(prod.name);

  useEffect(() => {
    let isMounted = true;
    if (isPortuguese) {
      translateDynamic(prod.name, 'pt').then((translated) => {
        if (isMounted) setDisplayName(translated);
      });
    } else {
      setDisplayName(prod.name);
    }
    return () => {
      isMounted = false;
    };
  }, [prod.name, isPortuguese, language]);

  return (
    <div className="p-4 sm:px-6 flex items-center justify-between hover:bg-sky-50/50 transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <img
          src={prod.imageUrl}
          alt={displayName}
          className="w-12 h-12 rounded-2xl object-cover border border-sky-100 bg-sky-50 shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">{displayName}</p>
          <span className="inline-block text-[11px] font-bold text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-full mt-0.5 border border-sky-200/50">
            {displayCategory}
          </span>
        </div>
      </div>
      <div className="text-right text-xs text-sky-600/70 font-semibold shrink-0">
        {new Date(prod.createdAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </div>
    </div>
  );
};

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    recentProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const { t, isPortuguese } = useLanguage();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await productService.getStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('adminDashboardTitle')}</h1>
          <p className="text-sm text-sky-800/70 font-medium mt-1">
            {t('adminDashboardSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('manageProducts')}</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Products Card */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-sky-100 shadow-soft flex items-center justify-between hover:shadow-card hover:border-sky-200 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-sky-600">{t('totalProductsMetric')}</p>
            <h2 className="text-4xl font-black text-slate-900 mt-2">{stats.totalProducts}</h2>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-700 mt-4 transition-colors"
            >
              <span>{t('viewAllProducts')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-14 h-14 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center text-cyan-600 shadow-inner">
            <Package className="w-7 h-7" />
          </div>
        </div>

        {/* Categories Card */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-sky-100 shadow-soft flex items-center justify-between hover:shadow-card hover:border-sky-200 transition-all">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-sky-600">{t('totalCategoriesMetric')}</p>
            <h2 className="text-4xl font-black text-slate-900 mt-2">{stats.totalCategories}</h2>
            <Link
              to="/admin/categories"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 mt-4 transition-colors"
            >
              <span>{t('manageCategories')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-14 h-14 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center text-sky-600 shadow-inner">
            <FolderTree className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Recently Added Products Section */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-sky-100 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-sky-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">{t('recentlyAddedProducts')}</h3>
            <p className="text-xs text-sky-700/70 font-medium mt-0.5">{t('latestItemsSubtitle')}</p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-cyan-600 hover:text-cyan-700"
          >
            {t('seeAll')}
          </Link>
        </div>

        {stats.recentProducts.length === 0 ? (
          <div className="p-8 text-center text-sky-800/60 text-sm">
            {t('noProductsYet')}
          </div>
        ) : (
          <div className="divide-y divide-sky-50">
            {stats.recentProducts.map((prod) => {
              const categoryName = prod.category?.name;
              const displayCategory = isPortuguese && categoryName && categoryTranslations[categoryName]
                ? categoryTranslations[categoryName]
                : categoryName || t('uncategorized');

              return (
                <DashboardRecentProductRow
                  key={prod.id}
                  prod={prod}
                  displayCategory={displayCategory}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
