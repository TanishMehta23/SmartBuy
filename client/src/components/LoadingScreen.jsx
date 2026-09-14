import React, { useState, useEffect } from 'react';
import { Loader2, Server } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LoadingScreen = () => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Trigger entrance animation
    const mountTimer = setTimeout(() => setHasMounted(true), 100);
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => {
      clearTimeout(mountTimer);
      clearInterval(timer);
    };
  }, []);

  const getDynamicStatus = () => {
    if (secondsElapsed < 4) {
      return {
        step: t('fetchStep1'),
        hint: t('fetchHint1'),
      };
    } else if (secondsElapsed < 10) {
      return {
        step: t('wakeServerStep'),
        hint: t('wakeServerHint'),
      };
    } else if (secondsElapsed < 20) {
      return {
        step: t('dbConnectStep'),
        hint: t('dbConnectHint'),
      };
    } else {
      return {
        step: t('finishStep'),
        hint: t('finishHint'),
      };
    }
  };

  const status = getDynamicStatus();

  return (
    <div className="min-h-screen bg-theme-bluish flex flex-col items-center justify-center p-4 select-none relative overflow-hidden transition-colors duration-200">
      {/* Background ambient lighting — now with floating animation */}
      <div className="absolute w-96 h-96 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -top-20 -right-20 animate-float-slow" />
      <div className="absolute w-96 h-96 bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -left-20 animate-float-slow-reverse" />

      <div className="max-w-md w-full text-center flex flex-col items-center relative z-10">
        {/* Animated Brand Emblem — bounce-in spring entrance */}
        <div className="relative mb-6 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Smart Buy"
            className={`w-24 h-24 object-contain ${
              hasMounted ? 'animate-bounce-in' : 'opacity-0 scale-50'
            }`}
          />
        </div>

        {/* Store Title — fade in after logo */}
        <div
          className={`animate-on-scroll ${hasMounted ? 'animate-fade-in-up' : ''}`}
          style={hasMounted ? { animationDelay: '300ms' } : undefined}
        >
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
            {t('storeTitle')}
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-cyan-400 mb-2">
            {t('motto')}
          </p>
          <span className="inline-block px-3 py-1 mb-6 rounded-full text-xs font-black bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-xs border border-cyan-300/50">
            NIPC 518263606
          </span>
        </div>

        {/* Loading Card — fade in after title */}
        <div
          className={`w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-xl shadow-sky-200/40 dark:shadow-slate-950/50 flex flex-col items-center animate-on-scroll ${
            hasMounted ? 'animate-fade-in-up' : ''
          }`}
          style={hasMounted ? { animationDelay: '500ms' } : undefined}
        >
          <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold text-sm sm:text-base mb-2">
            <Loader2 className="w-5 h-5 text-cyan-500 animate-spin shrink-0" />
            <span
              key={status.step}
              className="animate-fade-in-up"
              style={{ animationDuration: '0.4s' }}
            >
              {status.step}
            </span>
          </div>

          <p
            key={status.hint}
            className="text-xs text-sky-800/70 dark:text-slate-400 font-medium text-center mb-5 max-w-xs animate-fade-in-up"
            style={{ animationDuration: '0.4s' }}
          >
            {status.hint}
          </p>

          {/* Animated Gradient Progress Indicator with shimmer */}
          <div className="w-full bg-sky-100/70 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative mb-3 p-0.5">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-cyan-400 rounded-full w-full shadow-xs animate-shimmer-bar" />
          </div>

          {/* Cloud Server Info Badge */}
          {secondsElapsed >= 4 && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-sky-700 dark:text-cyan-300 font-medium bg-sky-50 dark:bg-slate-800 border border-sky-200/80 dark:border-slate-700 rounded-full px-3 py-1 animate-fade-in-up">
              <Server className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{t('serverWakeInProgress', { seconds: secondsElapsed })}</span>
            </div>
          )}
        </div>

        <p
          className={`text-[11px] text-sky-600/70 dark:text-slate-400 mt-6 font-semibold animate-on-scroll ${
            hasMounted ? 'animate-fade-in-up' : ''
          }`}
          style={hasMounted ? { animationDelay: '700ms' } : undefined}
        >
          {t('loadingBadge')}
        </p>
      </div>
    </div>
  );
};
