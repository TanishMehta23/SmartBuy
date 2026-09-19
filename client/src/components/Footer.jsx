import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
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
  const navigate = useNavigate();
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | null
  const { ref: trustRef, isVisible: trustVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: linksRef, isVisible: linksVisible } = useScrollAnimation({ threshold: 0.1 });

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

  const googleMapsUrl = 'https://maps.app.goo.gl/88x5p8bFx5cojFvv7';

  const trustFeatures = [
    {
      icon: ShieldCheck,
      gradient: 'from-cyan-500 to-sky-600',
      shadowColor: 'shadow-cyan-500/20',
      titleKey: 'footerFeature1Title',
      descKey: 'footerFeature1Desc',
    },
    {
      icon: Sparkles,
      gradient: 'from-sky-500 to-blue-600',
      shadowColor: 'shadow-sky-500/20',
      titleKey: 'footerFeature2Title',
      descKey: 'footerFeature2Desc',
    },
    {
      icon: Globe2,
      gradient: 'from-teal-500 to-cyan-600',
      shadowColor: 'shadow-teal-500/20',
      titleKey: 'footerFeature3Title',
      descKey: 'footerFeature3Desc',
    },
  ];

  return (
    <footer className="relative mt-auto border-t border-sky-200/80 dark:border-slate-800 bg-gradient-to-b from-sky-50/90 via-sky-100/50 to-white/95 dark:from-slate-900/90 dark:via-slate-950/90 dark:to-slate-950/95 backdrop-blur-xl text-slate-700 dark:text-slate-300 w-full overflow-hidden transition-colors duration-200">
      {/* Decorative ambient background blur orbs — now with floating animation */}
      <div className="absolute top-0 left-1/4 w-96 h-48 bg-cyan-300/15 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-48 bg-sky-400/15 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none animate-float-slow-reverse" />

      {/* Trust & Quality Pillars Banner */}
      <div ref={trustRef} className="border-b border-sky-200/60 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              const delayMs = idx * 120;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-sky-100/80 dark:border-slate-700/80 shadow-xs hover:shadow-soft dark:hover:shadow-slate-950/50 hover:border-cyan-200 dark:hover:border-cyan-500/40 transition-all animate-on-scroll ${
                    trustVisible ? 'animate-fade-in-up' : ''
                  }`}
                  style={trustVisible ? { animationDelay: `${delayMs}ms` } : undefined}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center shrink-0 shadow-sm ${feature.shadowColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                      {t(feature.titleKey)}
                    </h4>
                    <p className="text-xs text-sky-800/70 dark:text-slate-400 font-medium mt-0.5 leading-relaxed">
                      {t(feature.descKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Links & Contact Info */}
      <div
        ref={linksRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-on-scroll ${
          linksVisible ? 'animate-fade-in-up' : ''
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Smart Buy Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
              <div>
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  {t('storeTitle')}
                </span>
                <p className="text-[9px] uppercase tracking-wider font-extrabold text-cyan-700 dark:text-cyan-400">
                  {t('motto')}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-sm">
              {t('footerAboutDesc')}
            </p>

            <div className="pt-1 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('language')}:</span>
                <LanguageSelector variant="light" />
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle size="sm" />
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="sm:col-span-1 md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{t('footerQuickLinks')}</span>
            </h4>
            <div className="space-y-2 text-xs font-semibold">
              <div>
                <button
                  onClick={() => {
                    navigate('/catalog');
                    scrollToTop();
                  }}
                  className="text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  {t('footerExploreCatalog')}
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    navigate('/');
                    scrollToTop();
                  }}
                  className="text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  {t('footerAllCategories')}
                </button>
              </div>
              <div>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  {t('footerPrivacy')}
                </button>
              </div>
              <div>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  {t('footerTerms')}
                </button>
              </div>
            </div>
          </div>

          {/* Visit & Contact Information Column */}
          <div className="sm:col-span-1 md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{t('footerContactTitle')}</span>
            </h4>

            <div className="space-y-2 text-xs">
              {/* Address */}
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold leading-snug">
                    {t('footerAddressVal')}
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline mt-0.5"
                  >
                    <span>{t('footerViewOnMap')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <a
                  href="tel:+351214843122"
                  className="text-slate-800 dark:text-slate-200 font-bold hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  {t('footerPhoneVal')}
                </a>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {t('footerHoursVal')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Back to Top Ribbon */}
      <div className="border-t border-sky-200/70 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-1.5 sm:gap-3 text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
            <span>© {currentYear} <strong>Smart Buy</strong>. {t('footerRights')}</span>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setActiveModal('privacy')}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 underline-offset-2 hover:underline cursor-pointer font-semibold"
              >
                {t('footerPrivacy')}
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                onClick={() => setActiveModal('terms')}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 underline-offset-2 hover:underline cursor-pointer font-semibold"
              >
                {t('footerTerms')}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center shrink-0">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-cyan-700 dark:hover:text-cyan-300 font-bold text-xs transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
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
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3.5 sm:p-6 bg-slate-950/70 dark:bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveModal(null);
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-sky-100 dark:border-slate-800 animate-in zoom-in-95 duration-200 relative z-[10000]">
              {/* Modal Header */}
              <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-sky-100 dark:border-slate-800 flex items-center justify-between bg-sky-50/60 dark:bg-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-inner">
                    {activeModal === 'privacy' ? <Shield className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                      {activeModal === 'privacy' ? t('privacyPolicyTitle') : t('termsTitle')}
                    </h3>
                    <p className="text-[11px] text-sky-700/80 dark:text-cyan-400 font-semibold">
                      {activeModal === 'privacy' ? t('privacyPolicyLastUpdated') : t('termsLastUpdated')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Content */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm leading-relaxed">
                {activeModal === 'privacy' ? (
                  <>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 bg-sky-50/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-sky-200/80 dark:border-slate-700/80">
                      {t('privacyIntro')}
                    </p>

                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-slate-900 dark:text-cyan-400">{t('privacySection1Title')}</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{t('privacySection1Text')}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-slate-900 dark:text-cyan-400">{t('privacySection2Title')}</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{t('privacySection2Text')}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-slate-900 dark:text-cyan-400">{t('privacySection3Title')}</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{t('privacySection3Text')}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-slate-900 dark:text-cyan-400">{t('privacySection4Title')}</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{t('privacySection4Text')}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 bg-sky-50/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-sky-200/80 dark:border-slate-700/80">
                      {t('termsIntro')}
                    </p>

                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-slate-900 dark:text-cyan-400">{t('termsSection1Title')}</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{t('termsSection1Text')}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-slate-900 dark:text-cyan-400">{t('termsSection2Title')}</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{t('termsSection2Text')}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-slate-900 dark:text-cyan-400">{t('termsSection3Title')}</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{t('termsSection3Text')}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-sm text-slate-900 dark:text-cyan-400">{t('termsSection4Title')}</h4>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{t('termsSection4Text')}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer Action */}
              <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-sky-100 dark:border-slate-800 bg-sky-50/40 dark:bg-slate-800/40 flex items-center justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/25 transition-all cursor-pointer hover:scale-102 active:scale-98"
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
