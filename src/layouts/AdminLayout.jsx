import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Sidebar } from '../components/navigation/Sidebar';
import { MobileNav } from '../components/navigation/MobileNav';
import { Footer } from '../components/navigation/Footer';
import { DemoUserSwitcher } from '../components/ui/DemoUserSwitcher';
import { ReactBitsBackground } from '../components/ui/ReactBitsBackground';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

export function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b14]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Verifying Academic Staff Credentials...</p>
        </div>
      </div>
    );
  }

  // Route protection
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/90 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 relative">
        <ReactBitsBackground />
        <DemoUserSwitcher />
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-xl">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-4 border border-amber-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Staff / Admin Access Only
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              The Campus Monitoring Dashboard is strictly restricted to authorized college administration.
            </p>
            <div className="space-y-3">
              <Link
                to="/admin/login"
                className="block w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold shadow-md transition"
              >
                Log In as Campus Staff / Admin
              </Link>
              <Link
                to="/student"
                className="block w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition"
              >
                Return to Student Dashboard
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/90 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 relative transition-colors duration-200">
      <ReactBitsBackground />
      <DemoUserSwitcher />
      <Navbar />

      {/* Admin Monitoring Read-Only Header Guarantee Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2 text-center relative z-10">
        <ShieldCheck className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Monitoring Only View:</strong> Administrative privileges are strictly read-only. Admins cannot create, alter, or delete student books or requests.
        </span>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto flex relative z-10">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 min-w-0">
          <Outlet />
        </main>
      </div>

      <MobileNav />
      <Footer />
    </div>
  );
}
