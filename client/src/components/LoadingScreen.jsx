import React, { useState, useEffect } from 'react';
import { Loader2, Server } from 'lucide-react';

export const LoadingScreen = ({
  title = 'Loading Product Catalog',
  message = 'Connecting to catalog services...',
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getDynamicStatus = () => {
    if (secondsElapsed < 4) {
      return {
        step: 'Fetching latest products and categories...',
        hint: 'Loading fresh catalog items',
      };
    } else if (secondsElapsed < 10) {
      return {
        step: 'Waking up cloud server...',
        hint: 'Render instances take a few seconds to spin up on initial load.',
      };
    } else if (secondsElapsed < 20) {
      return {
        step: 'Establishing database connection...',
        hint: 'Almost ready, streaming product showcase data...',
      };
    } else {
      return {
        step: 'Finishing up loading...',
        hint: 'Thank you for your patience! Products will appear shortly.',
      };
    }
  };

  const status = getDynamicStatus();

  return (
    <div className="min-h-screen bg-theme-bluish flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none -top-20 -right-20 animate-pulse" />
      <div className="absolute w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none -bottom-20 -left-20 animate-pulse" />

      <div className="max-w-md w-full text-center flex flex-col items-center relative z-10">
        {/* Animated Brand Emblem */}
        <div className="relative mb-6 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Smart Buy"
            className="w-24 h-24 object-contain animate-bounce"
            style={{ animationDuration: '2s' }}
          />
        </div>

        {/* Store Title */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-1">
          Smart Buy
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">
          ONESHOP FOR SMART BUYERS
        </p>
        <span className="inline-block px-3 py-1 mb-6 rounded-full text-xs font-black bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-xs border border-cyan-300/50">
          NIPC 518263606
        </span>

        {/* Loading Card */}
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-sky-100 shadow-xl shadow-sky-200/40 flex flex-col items-center">
          <div className="flex items-center gap-3 text-slate-900 font-bold text-sm sm:text-base mb-2">
            <Loader2 className="w-5 h-5 text-cyan-500 animate-spin shrink-0" />
            <span>{status.step}</span>
          </div>

          <p className="text-xs text-sky-800/70 font-medium text-center mb-5 max-w-xs">
            {status.hint}
          </p>

          {/* Animated Gradient Progress Indicator */}
          <div className="w-full bg-sky-100/70 h-2.5 rounded-full overflow-hidden relative mb-3 p-0.5">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 rounded-full animate-pulse w-full shadow-xs" />
          </div>

          {/* Cloud Server Info Badge */}
          {secondsElapsed >= 4 && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-sky-700 font-medium bg-sky-50 border border-sky-200/80 rounded-full px-3 py-1 animate-in fade-in duration-300">
              <Server className="w-3.5 h-3.5 text-cyan-600" />
              <span>Server wake up in progress ({secondsElapsed}s)</span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-sky-600/70 mt-6 font-semibold">
          Fast &bull; Secure &bull; High Quality Catalog
        </p>
      </div>
    </div>
  );
};
