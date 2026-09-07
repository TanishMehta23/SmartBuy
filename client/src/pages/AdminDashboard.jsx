import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../services/catalogService';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';
import { Package, FolderTree, ArrowRight, Plus, Loader2, Edit2, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const DashboardRecentProductRow = ({ prod, displayCategory, onEditClick }) => {
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
    <div
      onClick={() => onEditClick(prod)}
      className="p-3.5 sm:p-4 sm:px-6 flex items-center justify-between hover:bg-sky-50/70 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <div className="relative shrink-0">
          <img
            src={prod.imageUrl}
            alt={displayName}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover border border-sky-100 bg-sky-50"
          />
          <div className="absolute inset-0 bg-cyan-600/30 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit2 className="w-4 h-4 text-white drop-shadow-sm" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-cyan-700 transition-colors">
            {displayName}
          </p>
          <span className="inline-block text-[10px] sm:text-[11px] font-bold text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded-full mt-0.5 border border-sky-200/50">
            {displayCategory}
          </span>
        </div>
      </div>
      <div className="text-right text-[11px] sm:text-xs text-sky-600/70 font-semibold shrink-0 ml-2">
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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, isPortuguese } = useLanguage();

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formImageFile, setFormImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStats = async () => {
    try {
      const [statsRes, catsRes] = await Promise.all([
        productService.getStats(),
        categoryService.getCategories(),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (catsRes.success) setCategories(catsRes.data);
    } catch (error) {
      console.error('Failed to load stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategoryId(product.categoryId);
    setFormImageFile(null);
    setImagePreviewUrl(product.imageUrl);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setFormImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error(t('productNameLabel') + ' is required');
      return;
    }
    if (!formCategoryId) {
      toast.error(t('selectCategoryPlaceholder'));
      return;
    }

    const formData = new FormData();
    formData.append('name', formName.trim());
    formData.append('categoryId', formCategoryId);
    if (formImageFile) {
      formData.append('image', formImageFile);
    }

    setSubmitting(true);
    try {
      await productService.updateProduct(editingProduct.id, formData);
      toast.success(t('saveChanges') + ' successful!');
      setEditingProduct(null);
      fetchStats();
    } catch (err) {
      toast.error(err.userFriendlyMessage || t('operationFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryName = (name) => {
    if (isPortuguese && categoryTranslations[name]) {
      return categoryTranslations[name];
    }
    return name;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl">
      {/* Page Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{t('adminDashboardTitle')}</h1>
          <p className="text-xs sm:text-sm text-sky-800/70 font-medium mt-0.5 sm:mt-1">
            {t('adminDashboardSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('manageProducts')}</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid - 2 Columns on Mobile */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {/* Products Card */}
        <div className="bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-sky-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-card hover:border-sky-200 transition-all gap-2">
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-600 truncate">{t('totalProductsMetric')}</p>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1 sm:mt-2">{stats.totalProducts}</h2>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-cyan-600 hover:text-cyan-700 mt-2 sm:mt-4 transition-colors"
            >
              <span>{t('viewAllProducts')}</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Link>
          </div>
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-sky-50 border border-sky-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-cyan-600 shadow-inner shrink-0 self-end sm:self-auto">
            <Package className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
        </div>

        {/* Categories Card */}
        <div className="bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-sky-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-card hover:border-sky-200 transition-all gap-2">
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-600 truncate">{t('totalCategoriesMetric')}</p>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1 sm:mt-2">{stats.totalCategories}</h2>
            <Link
              to="/admin/categories"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-sky-600 hover:text-sky-700 mt-2 sm:mt-4 transition-colors"
            >
              <span>{t('manageCategories')}</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Link>
          </div>
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-sky-50 border border-sky-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-sky-600 shadow-inner shrink-0 self-end sm:self-auto">
            <FolderTree className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
        </div>
      </div>

      {/* Recently Added Products Section */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-sky-100 shadow-soft overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-sky-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">{t('recentlyAddedProducts')}</h3>
            <p className="text-[11px] sm:text-xs text-sky-700/70 font-medium mt-0.5">{t('latestItemsSubtitle')}</p>
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
                  onEditClick={handleOpenEditModal}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Product Modal Popup */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-sky-100 animate-in zoom-in-95 duration-200">
            <div className="p-5 sm:p-6 border-b border-sky-100 flex items-center justify-between bg-sky-50/50">
              <h3 className="text-base font-black text-slate-900">
                {t('editProduct')}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-sky-100/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 sm:p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('productNameLabel')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Organic Honeycrisp Apples"
                  className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('categoryLabel')} <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formCategoryId}
                  onChange={(e) => setFormCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 transition-all cursor-pointer"
                >
                  <option value="" disabled>{t('selectCategoryPlaceholder')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {getCategoryName(cat.name)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('productImageLabel')}
                </label>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-sky-200 hover:border-cyan-500 rounded-3xl p-4 bg-sky-50/40 transition-colors">
                  {imagePreviewUrl ? (
                    <div className="relative group w-full flex flex-col items-center">
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl shadow-sm border border-sky-100 mb-3"
                      />
                      <label className="cursor-pointer text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sky-200 shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{t('changeImage')}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center text-center py-2">
                      <div className="w-10 h-10 rounded-2xl bg-sky-100 text-cyan-600 flex items-center justify-center mb-2 shadow-inner">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">{t('clickToUploadPhoto')}</span>
                      <span className="text-[11px] text-sky-600/70 mt-0.5 font-medium">{t('imageUploadHint')}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{t('saveChanges')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
