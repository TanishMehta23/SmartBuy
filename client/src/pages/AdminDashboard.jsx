import React, { useState, useEffect } from 'react';
import { productService } from '../services/catalogService';
import { Package, FolderTree, ArrowRight, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    recentProducts: [],
  });
  const [loading, setLoading] = useState(true);

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
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Store catalog status, inventory metrics, and recent activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Products Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Products</p>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2">{stats.totalProducts}</h2>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mt-4 transition-colors"
            >
              <span>View all products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Package className="w-7 h-7" />
          </div>
        </div>

        {/* Categories Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Categories</p>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2">{stats.totalCategories}</h2>
            <Link
              to="/admin/categories"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mt-4 transition-colors"
            >
              <span>Manage categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <FolderTree className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Recently Added Products Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recently Added Products</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest items added to the catalog</p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            See all
          </Link>
        </div>

        {stats.recentProducts.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No products added yet. Click &quot;Manage Products&quot; to add your first product.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.recentProducts.map((prod) => (
              <div key={prod.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200/80 bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{prod.name}</p>
                    <span className="inline-block text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
                      {prod.category?.name || 'Uncategorized'}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400 shrink-0">
                  {new Date(prod.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
