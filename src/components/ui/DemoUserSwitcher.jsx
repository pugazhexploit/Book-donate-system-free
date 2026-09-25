import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Sparkles, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export function DemoUserSwitcher() {
  const { user, switchDemoUser, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSwitch = async (role) => {
    await switchDemoUser(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-50">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-medium text-slate-300 hidden sm:inline">Active Session:</span>
        <span className="font-semibold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          {user?.full_name || 'Guest'}
        </span>
        <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
          isAdmin 
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        }`}>
          {isAdmin ? 'Admin (Monitoring Only)' : 'Student'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400 hidden md:inline">Quick Demo Switch:</span>
        <button
          onClick={() => handleSwitch('pugazh')}
          className={`px-2 py-1 rounded transition text-xs flex items-center gap-1 ${
            user?.email === 'pugazh@college.edu' 
              ? 'bg-indigo-600 text-white font-medium' 
              : 'hover:bg-slate-800 text-slate-300'
          }`}
          title="Switch to Pugazh (Senior CS Student / Donor)"
        >
          <UserCheck className="w-3 h-3" />
          Pugazh (Donor)
        </button>

        <button
          onClick={() => handleSwitch('arun')}
          className={`px-2 py-1 rounded transition text-xs flex items-center gap-1 ${
            user?.email === 'arun@college.edu' 
              ? 'bg-indigo-600 text-white font-medium' 
              : 'hover:bg-slate-800 text-slate-300'
          }`}
          title="Switch to Arun (Junior Student / Requester)"
        >
          <UserCheck className="w-3 h-3" />
          Arun (Requester)
        </button>

        <button
          onClick={() => handleSwitch('admin')}
          className={`px-2 py-1 rounded transition text-xs flex items-center gap-1 ${
            isAdmin 
              ? 'bg-amber-600 text-white font-medium' 
              : 'hover:bg-slate-800 text-slate-300'
          }`}
          title="Switch to Campus Dean (Read-Only Staff Monitor)"
        >
          <ShieldCheck className="w-3 h-3" />
          Admin (Read-Only)
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 ml-1"
          title="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
        </button>
      </div>
    </div>
  );
}
