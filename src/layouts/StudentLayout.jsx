import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Sidebar } from '../components/navigation/Sidebar';
import { MobileNav } from '../components/navigation/MobileNav';
import { Footer } from '../components/navigation/Footer';
import { DemoUserSwitcher } from '../components/ui/DemoUserSwitcher';
import { ReactBitsBackground } from '../components/ui/ReactBitsBackground';
import { useAuth } from '../contexts/AuthContext';

export function StudentLayout() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b14]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading Student Portal...</p>
        </div>
      </div>
    );
  }

  // If user is logged in as Admin, redirect to Admin Monitoring Dashboard
  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/90 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 relative transition-colors duration-200">
      <ReactBitsBackground />
      <DemoUserSwitcher />
      <Navbar />

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
