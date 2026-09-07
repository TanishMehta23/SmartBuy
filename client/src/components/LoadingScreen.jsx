import React, { useState, useEffect } from 'react';
import { Loader2, Server } from 'lucide-react';

export const LoadingScreen = ({
  title = 'Loading Product Catalog',
  message = 'Connecting to catalog services...',
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed[(prev) => prev + 1];
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50/30 to-slate-100 flex flex-col items-center justify-center p-4 select-none">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        {/* Animated Brand Emblem */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full bg-cyan-400/20 animate-ping opacity-75" />
          <div className="relative w-24 h-24 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Smart Buy"
              className="w-24 h-24 object-contain animate-bounce"
              style={{ animationDuration: '2s' }}
            />
          </div>
        </div>

        {/* Store Title */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-1">
          Smart Buy
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-2">
          ONESHOP FOR SMART BUYERS
        </p>
        <span className="inline-block px-3 py-1 mb-6 rounded-md text-xs font-bold bg-cyan-400 text-slate-900 shadow-xs">
          NIPC 518263606
        </span>

        {/* Loading Card */}
        <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col items-center">
          <div className="flex items-center gap-3 text-slate-800 font-semibold text-sm sm:text-base mb-2">
            <Loader2 className="w-5 h-5 text-cyan-600 animate-spin shrink-0" />
            <span>{status.step}</span>
          </div>

          <p className="text-xs text-slate-500 text-center mb-5 max-w-xs">
            {status.hint}
          </p>

          {/* Animated Gradient Progress Indicator */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative mb-3">
            <div className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 rounded-full animate-pulse w-full" />
          </div>

          {/* Cloud Server Info Badge */}
          {secondsElapsed >= 4 && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-50 border border-slate-200/60 rounded-full px-3 py-1 animate-in fade-in duration-300">
              <Server className="w-3.5 h-3.5 text-cyan-500" />
              <span>Server wake up in progress ({secondsElapsed}s)</span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-400 mt-6 font-medium">
          Fast &vull; Secure &bull; High Quality Catalog
        </p>
      </div>
    </div>
  );
};
