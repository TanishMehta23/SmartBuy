import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import {
  ShieldCheck,
  Sparkles,
  Globe2,
  ArrowUp,
  Layers,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  X,
  FileText,
  Shield,
} from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | null

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeModal]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const googleMapsUrl = 'https://www.google.com/maps/place/Smart+Buy+Supermercado/data=!4m2!3m1!1s0x0:0x3b8e9bda4f2f79c5?sa=X&ved=1t:2428&ictx=111';

  return (
    <footer className="relative mt-auto border-t border-sky-200/80 bg-gradient-to-b from-sky-50/90 via-sky-100/50 to-white/95 backdrop-blur-xl text-slate-700">
      {/* Decorative ambient background blur orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-48 bg-cyan-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-48 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Trust & Quality Pillars Banner */}
      <div className="border-b border-sky-200/60 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/80 border border-sky-100/80 shadow-xs hover:shadow-soft hover:border-cyan-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-cyan-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                  {t('footerFeature1Title')}
                </h4>
                <p className="text-xs text-sky-800/70 font-medium mt-0.5 leading-relaxed">
                  {t('footerFeature1Desc')}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/80 border border-sky-100/80 shadow-xs hover:shadow-soft hover:border-cyan-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                  {t('footerFeature2Title')}
                </h4>
                <p className="text-xs text-sky-800/70 font-medium mt-0.5 leading-relaxed">
                  {t('footerFeature2Desc')}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/80 border border-sky-100/80 shadow-xs hover:shadow-soft hover:border-cyan-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-teal-500/20">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                  {t('footerFeature3Title')}
                </h4>
                <p className="text-xs text-sky-800/70 font-medium mt-0.5 leading-relaxed">
                  {t('footerFeature3Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Contact Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Smart Buy Logo"
                className="w-10 h-10 object-contain drop-shadow-sm"
              />
              <div>
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 bg-clip-text text-transparent">
                  {t('storeTitle')}
                </span>
                <p className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-600">
                  {t('motto')}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-sky-900/70 font-medium leading-relaxed max-w-sm">
              {t('footerAboutDesc')}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-bold text-sky-800">{t('language')}:</span>
              <LanguageSelector variant="light" />
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-600" />
              <span>{t('footerQuickLinks')}</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button
                  onClick={scrollToTop}
                  className="text-sky-800/80 hover:text-cyan-600 transition-colors cursor-pointer"
                >
                  {t('footerExploreCatalog')}
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToTop}
                  className="text-sky-800/80 hover:text-cyan-600 transition-colors cursor-pointer"
                >
                  {t('footerAllCategories')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="text-sky-800/80 hover:text-cyan-600 transition-colors cursor-pointer"
                >
                  {t('footerPrivacy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="text-sky-800/80 hover:text-cyan-600 transition-colors cursor-pointer"
                >
                  {t('footerTerms')}
                </button>
              </li>
            </ul>
          </div>

          {/* Visit & Contact Information Column */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-600" />
              <span>{t('footerContactTitle')}</span>
            </h4>

            <div className="space-y-3 text-xs">
              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sky-900 font-semibold leading-snug">
                    {t('footerAddressVal')}
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-600 hover:text-cyan-700 hover:underline mt-1"
                  >
                    <span>{t('footerViewOnMap')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-600 shrink-0" />
                <a
                  href="tel:+351214843122"
                  className="text-sky-900 font-bold hover:text-cyan-600 transition-colors"
                >
                  {t('footerPhoneVal')}
                </a>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
                <span className="text-sky-800/80 font-medium">
                  {t('footerHoursVal')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Back to Top Ribbon */}
      <div className="border-t border-sky-200/70 bg-white/80 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-sky-800/70 font-medium text-center sm:text-left">
            <span>© {currentYear} <strong>Smart Buy</strong>. {t('footerRights')}</span>
            <span className="hidden sm:inline text-sky-300">•</span>
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-cyan-600 underline-offset-2 hover:underline cursor-pointer"
            >
              {t('footerPrivacy')}
            </button>
            <span className="text-sky-300">•</span>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-cyan-600 underline-offset-2 hover:underline cursor-pointer"
            >
              {t('footerTerms')}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-100 hover:bg-cyan-100 text-sky-800 hover:text-cyan-700 font-bold text-xs transition-colors cursor-pointer border border-sky-200"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy / Terms Modal Popup with Portal */}
      {activeModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveModal(null);
            }}
          >
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-sky-100 animate-in zoom-in-95 duration-200 relative z-[10000]">
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-sky-100 flex items-center justify-between bg-sky-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-cyan-600 flex items-center justify-center">
                    {activeModal === 'privacy' ? <Shield className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {activeModal === 'privacy' ? t('privacyPolicyTitle') : t('termsTitle')}
                    </h3>
                    <p className="text-[11px] text-sky-700/80 font-semibold">
                      {activeModal === 'privacy' ? t('privacyPolicyLastUpdated') : t('termsLastUpdated')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeModal === 'privacy' ? (
                  <>
                    <p className="font-medium text-slate-800 bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100">
                      {t('privacyIntro')}
                    </p>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{t('privacySection1Title')}</h4>
                      <p>{t('privacySection1Text')}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{t('privacySection2Title')}</h4>
                      <p>{t('privacySection2Text')}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{t('privacySection3Title')}</h4>
                      <p>{t('privacySection3Text')}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{t('privacySection4Title')}</h4>
                      <p>{t('privacySection4Text')}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-slate-800 bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100">
                      {t('termsIntro')}
                    </p>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{t('termsSection1Title')}</h4>
                      <p>{t('termsSection1Text')}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{t('termsSection2Title')}</h4>
                      <p>{t('termsSection2Text')}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{t('termsSection3Title')}</h4>
                      <p>{t('termsSection3Text')}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{t('termsSection4Title')}</h4>
                      <p>{t('termsSection4Text')}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer Action */}
              <div className="p-4 border-t border-sky-100 bg-sky-50/30 flex items-center justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  {t('closeModal')}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </footer>
  );
};

