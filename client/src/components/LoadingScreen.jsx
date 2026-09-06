import React, { useState, useEffect } from 'react';
import { Store, Loader2, Server } from 'lucide-react';

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

  // Helpful progressive message for cold-start delays (like Render free tier)
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/30 to-slate-100 flex flex-col items-center justify-center p-4 select-none">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        {/* Animated Brand Emblem */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer pulsing rings */}
          <div className="absolute w-28 h-28 rounded-3xl bg-emerald-400/20 animate-ping opacity-75" />
          <div className="absolute w-24 h-24 rounded-3xl bg-emerald-500/20 animate-pulse" />

          {/* Main Logo Card */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 border border-emerald-400/30">
            <Store className="w-10 h-10 animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
        </div>

        {/* Store Title */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-1">
          STORE CATALOG
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-6">
          Direct Product Showcase
        </p>

        {/* Loading Card */}
        <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col items-center">
          <div className="flex items-center gap-3 text-slate-800 font-semibold text-sm sm:text-base mb-2">
            <Loader2 className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
            <span>{status.step}</span>
          </div>

          <p className="text-xs text-slate-500 text-center mb-5 max-w-xs">
            {status.hint}
          </p>

          {/* Animated Gradient Progress Indicator */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative mb-3">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-full animate-pulse w-full" />
          </div>

          {/* Cloud Server Info Badge */}
          {secondsElapsed >= 4 && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-50 border border-slate-200/60 rounded-full px-3 py-1 animate-in fade-in duration-300">
              <Server className="w-3.5 h-3.5 text-emerald-500" />
              <span>Server wake up in progress ({secondsElapsed}s)</span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-400 mt-6 font-medium">
          Fast &bull; Secure &bull; High Quality Catalog
        </p>
      </div>
    </div>
  );
};
