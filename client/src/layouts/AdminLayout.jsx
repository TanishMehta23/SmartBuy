import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  LogOut,
  Store,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const handleConfirmLogout = async () => {
    setIsSignOutModalOpen(false);
    await logout();
    toast.success(t('loggedOutSuccess'));
    navigate('/admin/login');
  };

  const navItems = [
    { name: t('dashboard'), path: '/admin/dashboard', icon: LayoutDashboard },
    { name: t('products'), path: '/admin/products', icon: Package },
    { name: t('categories'), path: '/admin/categories', icon: FolderTree },
  ];

  return (
    <div className="h-screen w-full bg-theme-bluish flex flex-col md:flex-row text-slate-800 overflow-hidden">
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between shrink-0 z-40 border-b border-sky-950 shadow-md">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Smart Buy" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-sm tracking-tight text-white">{t('adminPortal')}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector variant="dark" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <span
                className={`absolute h-0.5 w-5 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                }`}
              />
              <span
                className={`absolute h-0.5 w-5 bg-current rounded-full transform transition-all duration-200 ease-in-out ${
                  mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute h-0.5 w-5 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Fixed Sticky Sidebar for Desktop / Animated Slide Drawer for Mobile */}
      <aside
        className={`fixed md:relative top-[57px] md:top-0 left-0 right-0 md:right-auto h-[calc(100vh-57px)] md:h-screen w-full md:w-64 bg-slate-900 text-slate-300 z-30 border-r border-sky-950/60 shadow-2xl md:shadow-lg flex flex-col p-4 shrink-0 transition-all duration-300 ease-in-out overflow-y-auto ${
          mobileMenuOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-4 md:translate-y-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto max-h-0 md:max-h-none overflow-hidden md:overflow-y-auto'
        }`}
      >
        {/* Brand Header for Desktop */}
        <div className="hidden md:flex items-center justify-between px-2 py-3 mb-5 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="Smart Buy"
                className="w-11 h-11 object-contain drop-shadow-md"
              />
            </div>
            <div>
              <h1 className="font-black text-sm text-white tracking-wide">{t('storeTitle').toUpperCase()} ADMIN</h1>
              <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
                {t('managementPortal')}
              </p>
            </div>
          </div>
        </div>

        {/* Language selector in sidebar for desktop */}
        <div className="hidden md:block mb-4 px-2 shrink-0">
          <LanguageSelector variant="dark" />
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 flex-1 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/30 translate-x-1'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-cyan-300 hover:translate-x-1'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-800/80">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-cyan-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 text-cyan-400" />
                <span>{t('viewLiveStore')}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </nav>

        {/* Admin User Info & Logout Button */}
        <div className="pt-3 mt-auto border-t border-slate-800 shrink-0">
          <div className="px-3 py-2 mb-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <p className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">{t('loggedInAs')}</p>
            <p className="text-xs font-semibold text-slate-200 truncate" title={admin?.email}>
              {admin?.email || 'admin@storecatalog.com'}
            </p>
          </div>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsSignOutModalOpen(true);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('signOut')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area: Scrolls independently on the right while sidebar remains pinned */}
      <main className="flex-1 min-w-0 h-[calc(100vh-57px)] md:h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>

      {/* Sign Out Confirmation Modal */}
      {isSignOutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-sky-100 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-inner">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-black text-slate-900">
              {t('confirmSignOutTitle') || 'Sign Out of Admin?'}
            </h3>
            
            <p className="text-xs text-slate-600 font-medium mt-1.5 mb-6 leading-relaxed">
              {t('confirmSignOutDesc') || 'Are you sure you want to end your session? You will need to enter your credentials again to access store management.'}
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsSignOutModalOpen(false)}
                className="w-1/2 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
              
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-1/2 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('signOut')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
