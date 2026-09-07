import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/catalogService';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  FolderTree,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      toast.error(err.userFriendlyMessage || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
      toast.error('Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await categoryService.createCategory({ name: categoryName.trim() });
        toast.success('Category created successfully');
      } else {
        await categoryService.updateCategory(editingCategoryId, { name: categoryName.trim() });
        toast.success('Category updated successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.userFriendlyMessage || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    // Find a fallback default reassignment target (first other category)
    const otherCat = categories.find((c) => c.id !== category.id);
    setReassignTargetId(otherCat ? otherCat.id : '');
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    // If category has products and no reassign target selected
    if (categoryToDelete.productCount > 0 && !reassignTargetId) {
      toast.error('Please select a replacement category to reassign existing products.');
      return;
    }

    setDeleting(true);
    try {
      await categoryService.deleteCategory(
        categoryToDelete.id,
        categoryToDelete.productCount > 0 ? reassignTargetId : null
      );
      toast.success('Category deleted successfully');
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.userFriendlyMessage || 'Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Category Management</h1>
          <p className="text-sm text-sky-800/70 font-medium mt-1">
            Organize catalog inventory by managing dynamic product categories
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-sky-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-2" />
            <p className="text-xs font-semibold text-sky-800/70">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <FolderTree className="w-12 h-12 mx-auto mb-3 text-sky-300" />
            <p className="text-sm font-bold text-slate-800">No categories created</p>
            <p className="text-xs text-sky-700/70 mt-1 font-medium">Click above to add your first category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-100 bg-sky-50/70 text-sky-800 text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Category Name</th>
                  <th className="py-3.5 px-6">Products Count</th>
                  <th className="py-3.5 px-6">Created Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50 text-sm">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-sky-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {category.name}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-sky-100/80 text-sky-800 border border-sky-200/50">
                        {category.productCount} product{category.productCount === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-sky-700/80 font-medium">
                      {new Date(category.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(category)}
                        className="p-2 rounded-xl text-sky-700 hover:text-cyan-600 hover:bg-sky-100/80 transition-colors"
                        title="Edit category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteDialog(category)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-sky-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-sky-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                {modalMode === 'create' ? 'Add New Category' : 'Edit Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-sky-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Organic Produce"
                  className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 transition-all"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-sky-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === 'create' ? 'Create' : 'Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Reassign Category Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 text-center">
              Delete Category: &quot;{categoryToDelete.name}&quot;?
            </h3>

            {categoryToDelete.productCount > 0 ? (
              <div className="my-4 space-y-3">
                <p className="text-xs text-slate-600 text-center">
                  This category contains{' '}
                  <span className="font-bold text-rose-600">
                    {categoryToDelete.productCount} product(s)
                  </span>
                  . To protect database integrity, please select another category to move these products into:
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reassign products to:
                  </label>
                  <select
                    value={reassignTargetId}
                    onChange={(e) => setReassignTargetId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white"
                  >
                    {categories
                      .filter((c) => c.id !== categoryToDelete.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center mt-1 mb-6">
                Are you sure you want to delete this category? This action cannot be undone.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="w-1/2 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                disabled={deleting}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{categoryToDelete.productCount > 0 ? 'Reassign & Delete' : 'Delete Category'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
