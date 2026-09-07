import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { Lock, Mail, KeyRound, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await login(email, password);
      toast.success(t('adminAuthenticated'));
      navigate(from, { replace: true });
    } catch (err) {
      const message = err.userFriendlyMessage || 'Invalid email or password';
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-start pt-24 pb-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Lighting Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Back link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('backToCatalog')}</span>
        </button>
        <LanguageSelector variant="dark" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-sky-500/20 rounded-3xl p-8 shadow-2xl shadow-cyan-950/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-cyan-500/20 to-sky-500/20 border border-cyan-400/30 rounded-2xl flex items-center justify-center text-cyan-400 mx-auto mb-4 shadow-inner shadow-cyan-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              {t('adminLoginTitle')}
            </h2>
            <p className="text-xs text-sky-400/80 mt-1.5 font-medium">
              {t('adminLoginSubtitle')}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-sky-200 mb-1.5">
                {t('adminEmail')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@storecatalog.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-sky-900/60 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-sky-200 mb-1.5">
                {t('password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-sky-900/60 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 disabled:opacity-50 text-white text-sm font-bold rounded-2xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('verifyingCredentials')}</span>
                </>
              ) : (
                <span>{t('signInButton')}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
