import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../services/catalogService';
import { useDebounce } from '../hooks/useDebounce';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';
import { Pagination } from '../components/Pagination';
import { CustomSelect } from '../components/CustomSelect';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

// Sub-component for each row to handle dynamic translation seamlessly
const AdminProductRow = ({ product, displayCat, onEdit, onDelete }) => {
  const { isPortuguese, translateDynamic, language } = useLanguage();
  const [displayName, setDisplayName] = useState(product.name);

  useEffect(() => {
    let isMounted = true;
    if (isPortuguese) {
      translateDynamic(product.name, 'pt').then((translated) => {
        if (isMounted) setDisplayName(translated);
      });
    } else {
      setDisplayName(product.name);
    }
    return () => {
      isMounted = false;
    };
  }, [product.name, isPortuguese, language]);

  const formattedDate = new Date(product.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <tr className="hover:bg-sky-50/60 dark:hover:bg-slate-800/60 transition-colors group border-b border-sky-50/80 dark:border-slate-800/80">
      <td className="py-3 px-3 sm:px-6">
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <img
            src={product.imageUrl}
            alt={displayName}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-sky-100 dark:border-slate-700 bg-sky-50 dark:bg-slate-800 shrink-0 shadow-2xs"
          />
          <div className="min-w-0 pr-1">
            <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm line-clamp-2 leading-snug">
              {displayName}
            </span>
            {/* Mobile-only info row: Category badge & Added Date */}
            <div className="md:hidden flex items-center gap-2 mt-1 flex-wrap">
              <span className="inline-block text-[10px] font-bold text-sky-800 dark:text-cyan-300 bg-sky-100/80 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-sky-200/60 dark:border-slate-700">
                {displayCat}
              </span>
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell py-3.5 px-6">
        <span className="inline-block text-[11px] font-bold text-sky-800 dark:text-cyan-300 bg-sky-100/70 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-sky-200/50 dark:border-slate-700">
          {displayCat}
        </span>
      </td>
      <td className="hidden md:table-cell py-3.5 px-6 text-xs text-sky-700/70 dark:text-slate-400 font-semibold whitespace-nowrap">
        {formattedDate}
      </td>
      <td className="py-3 px-3 sm:px-6 text-right shrink-0 whitespace-nowrap w-24">
        <div className="flex items-center justify-end gap-1 sm:gap-1.5">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 sm:p-2 rounded-xl text-sky-700 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-sky-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalProducts: 0,
    totalPages: 1,
  });

  const { t, isPortuguese } = useLanguage();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingProductId, setEditingProductId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formImageFile, setFormImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  // Delete Dialog State
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({
        page: currentPage,
        limit: 20,
        search: debouncedSearch,
        categoryId: selectedCategory,
        sort: 'newest',
      });
      if (res.success) {
        setProducts(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      toast.error(err.userFriendlyMessage || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, debouncedSearch, selectedCategory]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingProductId(null);
    setFormName('');
    setFormCategoryId(categories[0]?.id || '');
    setFormImageFile(null);
    setImagePreviewUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormCategoryId(product.categoryId);
    setFormImageFile(null);
    setImagePreviewUrl(product.imageUrl);
    setIsModalOpen(true);
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
      toast.error('Product name is required');
      return;
    }

    if (!formCategoryId) {
      toast.error('Please select a category');
      return;
    }

    if (modalMode === 'create' && !formImageFile) {
      toast.error('Please select an image for the product');
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
      if (modalMode === 'create') {
        await productService.createProduct(formData);
        toast.success('Product created successfully');
      } else {
        await productService.updateProduct(editingProductId, formData);
        toast.success('Product updated successfully');
      }
      setIsModalOpen(false);
      fetchProducts();
      fetchCategories(); // Refresh product counts
    } catch (err) {
      toast.error(err.userFriendlyMessage || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    try {
      await productService.deleteProduct(productToDelete.id);
      toast.success('Product deleted successfully');
      setProductToDelete(null);
      fetchProducts();
      fetchCategories();
    } catch (err) {
      toast.error(err.userFriendlyMessage || 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const getCategoryName = (name) => {
    if (isPortuguese && categoryTranslations[name]) {
      return categoryTranslations[name];
    }
    return name;
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t('productManagementTitle')}</h1>
          <p className="text-xs sm:text-sm text-sky-800/70 dark:text-slate-400 font-medium mt-0.5 sm:mt-1">
            {t('productManagementSubtitle')}
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addNewProduct')}</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="relative z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-sky-100 dark:border-slate-800 shadow-soft dark:shadow-slate-950/40 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute inset-y-0 left-3 my-auto text-sky-400 dark:text-sky-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchProductsByName')}
            className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-sky-50/70 dark:bg-slate-800/80 border border-sky-200/70 dark:border-slate-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner shadow-sky-100/40 dark:shadow-none"
          />
        </div>

        <div className="w-full sm:w-64">
          <CustomSelect
            options={[
              { value: '', label: t('allCategoriesFilter') },
              ...categories.map((cat) => ({
                value: cat.id,
                label: `${getCategoryName(cat.name)} (${cat.productCount ?? 0})`,
              })),
            ]}
            value={selectedCategory}
            onChange={(val) => {
              setSelectedCategory(val);
              setCurrentPage(1);
            }}
            placeholder={t('allCategoriesFilter')}
            className="w-full"
            buttonClassName="w-full justify-between py-2 sm:py-2.5 text-xs sm:text-sm"
            align="right"
          />
        </div>
      </div>

      {/* Products Table / Cards */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-sky-100 dark:border-slate-800 shadow-soft dark:shadow-slate-950/40 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-2" />
            <p className="text-xs font-semibold text-sky-800/70 dark:text-slate-400">{t('loadingProducts')}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-sky-300 dark:text-slate-600" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">{t('noProductsFound')}</p>
            <p className="text-xs text-sky-700/70 dark:text-slate-400 mt-1 font-medium">
              {t('noProductsSearchHint', { query: search })}
            </p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="border-b border-sky-100 dark:border-slate-800 bg-sky-50/70 dark:bg-slate-800/70 text-sky-800 dark:text-cyan-300 text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3 px-3 sm:px-6">{t('productHeader')}</th>
                  <th className="hidden md:table-cell py-3.5 px-6 w-44">{t('categoryHeader')}</th>
                  <th className="hidden md:table-cell py-3.5 px-6 w-36">{t('addedDateHeader')}</th>
                  <th className="py-3 px-3 sm:px-6 text-right w-20 sm:w-28">{t('actionsHeader')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50 dark:divide-slate-800/70 text-sm">
                {products.map((product) => {
                  const catName = product.category?.name;
                  const displayCat = isPortuguese && catName && categoryTranslations[catName]
                    ? categoryTranslations[catName]
                    : catName || t('unassigned');

                  return (
                    <AdminProductRow
                      key={product.id}
                      product={product}
                      displayCat={displayCat}
                      onEdit={handleOpenEditModal}
                      onDelete={setProductToDelete}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="px-4 sm:px-6 pb-2 pt-1 border-t border-sky-50 dark:border-slate-800">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalProducts={pagination.totalProducts}
              limit={pagination.limit}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-sky-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-sky-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {modalMode === 'create' ? t('addNewProduct') : t('editProduct')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('productNameLabel')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Organic Honeycrisp Apples"
                  className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('categoryLabel')} <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formCategoryId}
                  onChange={(e) => setFormCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/10 transition-all cursor-pointer"
                >
                  <option value="" disabled>{t('selectCategoryPlaceholder')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="dark:bg-slate-900">
                      {getCategoryName(cat.name)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('productImageLabel')} {modalMode === 'create' && <span className="text-rose-500">*</span>}
                </label>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-sky-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 rounded-3xl p-4 bg-sky-50/40 dark:bg-slate-800/40 transition-colors">
                  {imagePreviewUrl ? (
                    <div className="relative group w-full flex flex-col items-center">
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-2xl shadow-sm border border-sky-100 dark:border-slate-700 mb-3"
                      />
                      <label className="cursor-pointer text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-sky-200 dark:border-slate-700 shadow-2xs">
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
                      <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2 shadow-inner">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('clickToUploadPhoto')}</span>
                      <span className="text-[11px] text-sky-600/70 dark:text-slate-400 mt-0.5 font-medium">{t('imageUploadHint')}</span>
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
              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === 'create' ? t('addProduct') : t('saveChanges')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-sky-100 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900/50">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('deleteProductTitle')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
              {t('deleteProductConfirm', { name: productToDelete.name })}
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="w-1/2 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{t('delete')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
