import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { DemoUserSwitcher } from '../components/ui/DemoUserSwitcher';
import { ReactBitsBackground } from '../components/ui/ReactBitsBackground';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/90 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 relative transition-colors duration-200">
      <ReactBitsBackground />
      <DemoUserSwitcher />
      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
