import React, { useState, useEffect } from 'react';
import { storeSettingsService } from '../services/storeSettingsService';
import { useLanguage } from '../context/LanguageContext';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Upload,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminStoreSettings = () => {
  const { t, isPortuguese } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    badgeTextEn: '',
    badgeTextPt: '',
    headlineEn: '',
    headlinePt: '',
    descriptionEn: '',
    descriptionPt: '',
    address: '',
    hoursEn: '',
    hoursPt: '',
    phone: '',
    mapUrl: '',
    photos: [],
  });

  const loadDetails = async () => {
    setLoading(true);
    try {
      const res = await storeSettingsService.getStoreDetails();
      if (res.success) {
        setFormData(res.data);
      }
    } catch (e) {
      toast.error('Failed to load store settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (index, field, value) => {
    setFormData((prev) => {
      const newPhotos = [...prev.photos];
      newPhotos[index] = { ...newPhotos[index], [field]: value };
      return { ...prev, photos: newPhotos };
    });
  };

  const handleAddPhoto = () => {
    if (formData.photos.length >= 8) {
      toast.error('Maximum 8 photos allowed');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      photos: [
        ...prev.photos,
        {
          url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
          tagEn: 'Featured Section',
          tagPt: 'Seção de Destaque',
          captionEn: 'Discover fresh store arrivals',
          captionPt: 'Descubra novidades frescas na loja',
        },
      ],
    }));
  };

  const handleRemovePhoto = (index) => {
    if (formData.photos.length <= 1) {
      toast.error('At least 1 store photo is required');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleImageFileUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      handlePhotoChange(index, 'url', previewUrl);
      toast.success('Image updated! Click "Save Store Changes" to apply.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await storeSettingsService.updateStoreDetails(formData);
      toast.success('Store details & photos saved successfully!');
    } catch (err) {
      toast.error('Failed to save store changes');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all store details and photos to original defaults?')) {
      const res = await storeSettingsService.resetStoreDetails();
      setFormData(res.data);
      toast.success('Store settings reset to defaults');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('storeSettingsTitle') || 'Store Showcase & Experience Settings'}
          </h1>
          <p className="text-xs sm:text-sm text-sky-800/70 dark:text-slate-400 font-medium mt-0.5">
            {t('storeSettingsSubtitle') ||
              'Customize the Cascais flagship store showcase, photos, address, opening hours, and phone number'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-slate-300/80 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetDefaults') || 'Reset Defaults'}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Store Changes'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Headlines & Descriptions */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-sky-100 dark:border-slate-800 pb-3">
            <Store className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Story, Headlines & Badges</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Badge EN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Top Pill Badge (English)
              </label>
              <input
                type="text"
                value={formData.badgeTextEn}
                onChange={(e) => handleChange('badgeTextEn', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>
            {/* Badge PT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Top Pill Badge (Português)
              </label>
              <input
                type="text"
                value={formData.badgeTextPt}
                onChange={(e) => handleChange('badgeTextPt', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>

            {/* Headline EN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Main Headline (English)
              </label>
              <input
                type="text"
                value={formData.headlineEn}
                onChange={(e) => handleChange('headlineEn', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>
            {/* Headline PT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Main Headline (Português)
              </label>
              <input
                type="text"
                value={formData.headlinePt}
                onChange={(e) => handleChange('headlinePt', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>

            {/* Description EN */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Store Bio / Story Description (English)
              </label>
              <textarea
                rows={2}
                value={formData.descriptionEn}
                onChange={(e) => handleChange('descriptionEn', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>
            {/* Description PT */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Store Bio / Story Description (Português)
              </label>
              <textarea
                rows={2}
                value={formData.descriptionPt}
                onChange={(e) => handleChange('descriptionPt', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-sky-100 dark:border-slate-800 pb-3">
            <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Store Location & Direct Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Physical Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Opening Hours (English)
              </label>
              <input
                type="text"
                value={formData.hoursEn}
                onChange={(e) => handleChange('hoursEn', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Opening Hours (Português)
              </label>
              <input
                type="text"
                value={formData.hoursPt}
                onChange={(e) => handleChange('hoursPt', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Google Maps Link URL
              </label>
              <input
                type="text"
                value={formData.mapUrl}
                onChange={(e) => handleChange('mapUrl', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Supermarket Photo Gallery Manager */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Supermarket Photo Gallery ({formData.photos.length})</span>
            </h3>
            <button
              type="button"
              onClick={handleAddPhoto}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:bg-sky-50 dark:hover:bg-slate-800 border border-sky-200/80 dark:border-slate-700 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Photo Slot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.photos.map((photo, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-sky-50/40 dark:bg-slate-800/40 border border-sky-100 dark:border-slate-700/80 flex flex-col gap-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                    Photo #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Image preview + Upload Button */}
                <div className="flex items-center gap-3">
                  <div className="w-24 h-16 rounded-xl overflow-hidden border border-sky-100 dark:border-slate-700 bg-sky-100 dark:bg-slate-800 shrink-0 shadow-2xs">
                    <img
                      src={photo.url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col gap-1.5">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-sky-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors self-start">
                      <Upload className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                      <span>Upload New Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(index, e)}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste direct image URL"
                      value={photo.url}
                      onChange={(e) => handlePhotoChange(index, 'url', e.target.value)}
                      className="w-full px-2.5 py-1 text-[11px] bg-white/80 dark:bg-slate-900/80 border border-sky-100 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 truncate"
                    />
                  </div>
                </div>

                {/* Tags & Captions */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                      Tag (EN)
                    </label>
                    <input
                      type="text"
                      value={photo.tagEn || ''}
                      onChange={(e) => handlePhotoChange(index, 'tagEn', e.target.value)}
                      placeholder="e.g. Modern Aisles"
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                      Tag (PT)
                    </label>
                    <input
                      type="text"
                      value={photo.tagPt || ''}
                      onChange={(e) => handlePhotoChange(index, 'tagPt', e.target.value)}
                      placeholder="e.g. Corredores Modernos"
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10.5px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                      Caption Description (EN)
                    </label>
                    <input
                      type="text"
                      value={photo.captionEn || ''}
                      onChange={(e) => handlePhotoChange(index, 'captionEn', e.target.value)}
                      placeholder="e.g. Spacious and organized supermarket aisles"
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating / Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 via-sky-600 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg shadow-cyan-500/25 transition-all cursor-pointer active:scale-97 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save & Publish Store Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
