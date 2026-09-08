import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/catalogService';
import { useLanguage } from '../context/LanguageContext';
import { categoryTranslations } from '../utils/translations';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  FolderTree,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  const { t, isPortuguese } = useLanguage();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete & Reassign Dialog State
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [reassignTargetId, setReassignTargetId] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await categoryService.getCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      toast.error(err.userFriendlyMessage || t('failedToLoadCategories'));
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCategories = [...categories];
    const [moved] = newCategories.splice(index, 1);
    newCategories.splice(targetIndex, 0, moved);

    // Optimistic UI update
    setCategories(newCategories);
    setReordering(true);

    try {
      const categoryIds = newCategories.map((c) => c.id);
      await categoryService.reorderCategories(categoryIds);
      toast.success(t('sequenceUpdated') || 'Category sequence updated successfully!');
    } catch (err) {
      toast.error(err.userFriendlyMessage || 'Failed to update category sequence');
      // Revert on error
      fetchCategories(false);
    } finally {
      setReordering(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingCategoryId(null);
    setCategoryName('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setModalMode('edit');
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error(t('categoryNameRequired'));
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await categoryService.createCategory({ name: categoryName.trim() });
        toast.success(t('categoryCreatedSuccess'));
      } else {
        await categoryService.updateCategory(editingCategoryId, { name: categoryName.trim() });
        toast.success(t('categoryUpdatedSuccess'));
      }
      setIsModalOpen(false);
      fetchCategories(false);
    } catch (err) {
      toast.error(err.userFriendlyMessage || t('operationFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    const otherCat = categories.find((c) => c.id !== category.id);
    setReassignTargetId(otherCat ? otherCat.id : '');
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    if (categoryToDelete.productCount > 0 && !reassignTargetId) {
      toast.error(t('pleaseSelectReplacement'));
      return;
    }

    setDeleting(true);
    try {
      await categoryService.deleteCategory(
        categoryToDelete.id,
        categoryToDelete.productCount > 0 ? reassignTargetId : undefined
      );
      toast.success(t('categoryRemovedSuccess'));
      setCategoryToDelete(null);
      fetchCategories(false);
    } catch (err) {
      toast.error(err.userFriendlyMessage || t('failedToDeleteCategory'));
    } finally {
      setDeleting(false);
    }
  };

  const getDisplayName = (name) => {
    if (isPortuguese && categoryTranslations[name]) {
      return categoryTranslations[name];
    }
    return name;
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('categoryManagementTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-sky-800/70 dark:text-slate-400 font-medium mt-0.5 sm:mt-1">
            {t('categoryManagementSubtitle')}
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addNewCategory')}</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-sky-100 dark:border-slate-800 shadow-soft dark:shadow-slate-950/40 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-2" />
            <p className="text-xs font-semibold text-sky-800/70 dark:text-slate-400">{t('loadingCategories')}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <FolderTree className="w-12 h-12 mx-auto mb-3 text-sky-300 dark:text-slate-600" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">{t('noCategoriesCreated')}</p>
            <p className="text-xs text-sky-700/70 dark:text-slate-400 mt-1 font-medium">{t('clickToCreateCategory')}</p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="border-b border-sky-100 dark:border-slate-800 bg-sky-50/70 dark:bg-slate-800/70 text-sky-800 dark:text-cyan-300 text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3 px-2 sm:px-4 w-16 sm:w-24 text-center">{t('sequenceHeader')}</th>
                  <th className="py-3 px-2 sm:px-6">{t('categoryNameHeader')}</th>
                  <th className="hidden sm:table-cell py-3.5 px-6 w-36">{t('createdDateHeader')}</th>
                  <th className="py-3 px-2 sm:px-6 text-right w-20 sm:w-28">{t('actionsHeader')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50 dark:divide-slate-800/70 text-sm">
                {categories.map((category, index) => {
                  const formattedDate = new Date(category.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={category.id} className="hover:bg-sky-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      {/* Sequence reorder controls */}
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                          <span className="w-5 sm:w-6 text-center font-extrabold text-[11px] sm:text-xs text-sky-900/60 dark:text-slate-400 bg-sky-100/60 dark:bg-slate-800 rounded-md py-0.5">
                            {index + 1}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              disabled={index === 0 || reordering}
                              onClick={() => handleMove(index, -1)}
                              className="p-0.5 sm:p-1 rounded-md text-sky-700 dark:text-cyan-400 hover:bg-sky-200/60 dark:hover:bg-slate-700 disabled:opacity-20 disabled:hover:bg-transparent transition-all cursor-pointer"
                              title={t('moveUp')}
                              aria-label={`${t('moveUp')} ${category.name}`}
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={index === categories.length - 1 || reordering}
                              onClick={() => handleMove(index, 1)}
                              className="p-0.5 sm:p-1 rounded-md text-sky-700 dark:text-cyan-400 hover:bg-sky-200/60 dark:hover:bg-slate-700 disabled:opacity-20 disabled:hover:bg-transparent transition-all cursor-pointer"
                              title={t('moveDown')}
                              aria-label={`${t('moveDown')} ${category.name}`}
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Category Name & Products Count (with Date on Mobile) */}
                      <td className="py-3 sm:py-4 px-2 sm:px-6 min-w-0">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm line-clamp-1">
                            {getDisplayName(category.name)}
                          </span>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100/80 dark:bg-slate-800 text-sky-800 dark:text-cyan-300 border border-sky-200/60 dark:border-slate-700 whitespace-nowrap">
                              {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                            </span>
                            <span className="sm:hidden text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                              {formattedDate}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Created Date for Desktop / Tablet */}
                      <td className="hidden sm:table-cell py-4 px-6 text-xs text-sky-700/80 dark:text-slate-400 font-medium whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 sm:py-4 px-2 sm:px-6 text-right shrink-0 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(category)}
                            className="p-1.5 sm:p-2 rounded-xl text-sky-700 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-sky-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title={t('editCategory')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteDialog(category)}
                            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title={t('deleteCategoryTitle', { name: category.name })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-sky-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-sky-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {modalMode === 'create' ? t('addNewCategory') : t('editCategory')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('categoryNameLabel')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Organic Produce"
                  className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
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
                  <span>{modalMode === 'create' ? t('createCategory') : t('saveCategory')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Reassign Category Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900/50">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white text-center">
              {t('deleteCategoryTitle', { name: categoryToDelete.name })}
            </h3>

            {categoryToDelete.productCount > 0 ? (
              <div className="my-4 space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                  {t('reassignNotice', { count: categoryToDelete.productCount })}
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('reassignTo')}
                  </label>
                  <select
                    value={reassignTargetId}
                    onChange={(e) => setReassignTargetId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 cursor-pointer"
                  >
                    {categories
                      .filter((c) => c.id !== categoryToDelete.id)
                      .map((c) => (
                        <option key={c.id} value={c.id} className="dark:bg-slate-900">
                          {getDisplayName(c.name)}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1 mb-6">
                {t('deleteCategoryConfirm')}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="w-1/2 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDeleteCategory}
                disabled={deleting}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{categoryToDelete.productCount > 0 ? t('reassignAndDelete') : t('delete')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
