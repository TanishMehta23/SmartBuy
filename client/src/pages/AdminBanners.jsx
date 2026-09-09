import React, { useState, useEffect } from 'react';
import { bannerService } from '../services/catalogService';
import { useLanguage } from '../context/LanguageContext';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  const { t } = useLanguage();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formLinkUrl, setFormLinkUrl] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formImageFile, setFormImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  // Delete State
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBanners = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await bannerService.getAdminBanners();
      if (res.success) {
        setBanners(res.data);
      }
    } catch (err) {
      toast.error(err.userFriendlyMessage || t('failedToLoadBanners') || 'Failed to load banners');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingBannerId(null);
    setFormTitle('');
    setFormLinkUrl('');
    setFormIsActive(true);
    setFormImageFile(null);
    setImagePreviewUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (banner) => {
    setModalMode('edit');
    setEditingBannerId(banner.id);
    setFormTitle(banner.title || '');
    setFormLinkUrl(banner.linkUrl || '');
    setFormIsActive(banner.isActive !== false);
    setFormImageFile(null);
    setImagePreviewUrl(banner.imageUrl);
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

  const handleSaveBanner = async (e) => {
    e.preventDefault();

    if (modalMode === 'create' && !formImageFile && !imagePreviewUrl) {
      toast.error(t('bannerImageRequired') || 'Banner image is required');
      return;
    }

    const formData = new FormData();
    if (formTitle.trim()) formData.append('title', formTitle.trim());
    if (formLinkUrl.trim()) formData.append('linkUrl', formLinkUrl.trim());
    formData.append('isActive', formIsActive ? 'true' : 'false');
    if (formImageFile) {
      formData.append('image', formImageFile);
    }

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await bannerService.createBanner(formData);
        toast.success(t('bannerCreatedSuccess') || 'Banner created successfully!');
      } else {
        await bannerService.updateBanner(editingBannerId, formData);
        toast.success(t('bannerUpdatedSuccess') || 'Banner updated successfully!');
      }
      setIsModalOpen(false);
      fetchBanners(false);
    } catch (err) {
      toast.error(err.userFriendlyMessage || t('operationFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (banner) => {
    const nextState = !banner.isActive;
    // Optimistic update
    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? { ...b, isActive: nextState } : b))
    );

    try {
      const formData = new FormData();
      formData.append('isActive', nextState ? 'true' : 'false');
      await bannerService.updateBanner(banner.id, formData);
      toast.success(
        nextState
          ? t('bannerActivated') || 'Banner activated'
          : t('bannerDeactivated') || 'Banner deactivated'
      );
    } catch (err) {
      toast.error(err.userFriendlyMessage || 'Failed to toggle banner status');
      fetchBanners(false);
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const [moved] = newBanners.splice(index, 1);
    newBanners.splice(targetIndex, 0, moved);

    setBanners(newBanners);
    setReordering(true);

    try {
      const bannerIds = newBanners.map((b) => b.id);
      await bannerService.reorderBanners(bannerIds);
      toast.success(t('sequenceUpdated') || 'Banner sequence updated successfully!');
    } catch (err) {
      toast.error(err.userFriendlyMessage || 'Failed to update sequence');
      fetchBanners(false);
    } finally {
      setReordering(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;

    setDeleting(true);
    try {
      await bannerService.deleteBanner(bannerToDelete.id);
      toast.success(t('bannerDeletedSuccess') || 'Banner deleted successfully');
      setBannerToDelete(null);
      fetchBanners(false);
    } catch (err) {
      toast.error(err.userFriendlyMessage || 'Failed to delete banner');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('bannerManagementTitle') || 'Promotional Banner Management'}
          </h1>
          <p className="text-xs sm:text-sm text-sky-800/70 dark:text-slate-400 font-medium mt-0.5 sm:mt-1">
            {t('bannerManagementSubtitle') ||
              'Add, organize, reorder, or toggle homepage promotional slideshow banners'}
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addNewBanner') || 'Add New Banner'}</span>
        </button>
      </div>

      {/* Banners List Table */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-sky-100 dark:border-slate-800 shadow-soft dark:shadow-slate-950/40 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-2" />
            <p className="text-xs font-semibold text-sky-800/70 dark:text-slate-400">
              {t('loadingBanners') || 'Loading banners...'}
            </p>
          </div>
        ) : banners.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-sky-300 dark:text-slate-600" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              {t('noBannersFound') || 'No banners added yet'}
            </p>
            <p className="text-xs text-sky-700/70 dark:text-slate-400 mt-1 font-medium">
              {t('noBannersHint') || 'Click "Add New Banner" above to create your first homepage carousel promo.'}
            </p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="border-b border-sky-100 dark:border-slate-800 bg-sky-50/70 dark:bg-slate-800/70 text-sky-800 dark:text-cyan-300 text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3 px-2 sm:px-4 w-16 sm:w-20 text-center">{t('sequenceHeader')}</th>
                  <th className="py-3 px-3 sm:px-6">{t('bannerHeader') || 'Banner'}</th>
                  <th className="hidden sm:table-cell py-3.5 px-6 w-32">{t('statusHeader') || 'Status'}</th>
                  <th className="py-3 px-3 sm:px-6 text-right w-24 sm:w-28">{t('actionsHeader')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50 dark:divide-slate-800/70 text-sm">
                {banners.map((banner, index) => (
                  <tr
                    key={banner.id}
                    className="hover:bg-sky-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* Reorder controls */}
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center justify-center gap-1">
                        <span className="w-5 text-center font-extrabold text-[11px] text-sky-900/60 dark:text-slate-400 bg-sky-100/60 dark:bg-slate-800 rounded-md py-0.5">
                          {index + 1}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0 || reordering}
                            onClick={() => handleMove(index, -1)}
                            className="p-0.5 rounded-md text-sky-700 dark:text-cyan-400 hover:bg-sky-200/60 dark:hover:bg-slate-700 disabled:opacity-20 disabled:hover:bg-transparent transition-all cursor-pointer"
                            title={t('moveUp')}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === banners.length - 1 || reordering}
                            onClick={() => handleMove(index, 1)}
                            className="p-0.5 rounded-md text-sky-700 dark:text-cyan-400 hover:bg-sky-200/60 dark:hover:bg-slate-700 disabled:opacity-20 disabled:hover:bg-transparent transition-all cursor-pointer"
                            title={t('moveDown')}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Banner Image Preview + Title + Link */}
                    <td className="py-3 sm:py-4 px-3 sm:px-6 min-w-0">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-20 sm:w-28 h-10 sm:h-14 rounded-xl overflow-hidden shrink-0 border border-sky-100 dark:border-slate-700 bg-sky-50 dark:bg-slate-800 shadow-2xs">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title || 'Banner'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate">
                            {banner.title || (
                              <span className="italic text-slate-400 font-normal">
                                {t('untitledBanner') || 'Untitled Banner'}
                              </span>
                            )}
                          </p>
                          {banner.linkUrl ? (
                            <a
                              href={banner.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline mt-0.5 truncate max-w-full"
                            >
                              <span className="truncate">{banner.linkUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {t('noClickAction') || 'No click-through link'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status Toggle Switch */}
                    <td className="hidden sm:table-cell py-3.5 px-6">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(banner)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          banner.isActive !== false
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {banner.isActive !== false ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t('active') || 'Active'}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{t('inactive') || 'Inactive'}</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-right shrink-0 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(banner)}
                          className="p-1.5 sm:p-2 rounded-xl text-sky-700 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-sky-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title={t('editBanner') || 'Edit Banner'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setBannerToDelete(banner)}
                          className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title={t('deleteBanner') || 'Delete Banner'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-sky-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-sky-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {modalMode === 'create'
                  ? t('addNewBanner') || 'Add Promotional Banner'
                  : t('editBanner') || 'Edit Promotional Banner'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="p-6 space-y-4">
              {/* Banner Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('bannerImageLabel') || 'Banner Image'}{' '}
                  {modalMode === 'create' && <span className="text-rose-500">*</span>}
                </label>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-sky-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 rounded-2xl p-4 bg-sky-50/40 dark:bg-slate-800/40 transition-colors">
                  {imagePreviewUrl ? (
                    <div className="relative group w-full flex flex-col items-center">
                      <div className="w-full aspect-[21/9] rounded-xl overflow-hidden border border-sky-100 dark:border-slate-700 shadow-sm mb-3">
                        <img
                          src={imagePreviewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
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
                    <label className="cursor-pointer flex flex-col items-center text-center py-4">
                      <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2 shadow-inner">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {t('clickToUploadBanner') || 'Click to upload banner image'}
                      </span>
                      <span className="text-[11px] text-sky-600/70 dark:text-slate-400 mt-0.5 font-medium">
                        {t('bannerUploadHint') || 'Recommended: 1600x600 px (PNG, JPG, WEBP)'}
                      </span>
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

              {/* Banner Title (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('bannerTitleLabel') || 'Promotional Title (Optional)'}
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Get 20% off on categories and brands"
                  className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                />
              </div>

              {/* Redirection Link (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('bannerLinkUrlLabel') || 'Target / Redirection Link URL (Optional)'}
                </label>
                <input
                  type="text"
                  value={formLinkUrl}
                  onChange={(e) => setFormLinkUrl(e.target.value)}
                  placeholder="e.g. https://store.com/promo or /category/bakery"
                  className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-sky-50/60 dark:bg-slate-800/60 rounded-2xl border border-sky-100 dark:border-slate-700/60">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    {t('displayOnHomepage') || 'Display on Homepage'}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t('displayOnHomepageHint') || 'Turn off to temporarily hide from customer slideshow'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-5 h-5 accent-cyan-600 rounded cursor-pointer"
                />
              </div>

              {/* Form Actions */}
              <div className="pt-3 flex items-center justify-end gap-2">
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
                  <span>
                    {modalMode === 'create'
                      ? t('addBanner') || 'Publish Banner'
                      : t('saveChanges')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-sky-100 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900/50">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('deleteBannerTitle') || 'Delete Promotional Banner?'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
              {t('deleteBannerConfirm') ||
                'Are you sure you want to remove this banner? This action cannot be undone.'}
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setBannerToDelete(null)}
                className="w-1/2 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDeleteBanner}
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
