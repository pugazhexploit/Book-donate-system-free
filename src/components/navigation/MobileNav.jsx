import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  BookOpen,
  PlusCircle,
  Inbox,
  User,
  LayoutDashboard,
  Users,
  Activity,
  BarChart3,
} from 'lucide-react';

export function MobileNav() {
  const { isAdmin } = useAuth();

  const studentTabs = [
    { to: '/student', label: 'Home', icon: Home },
    { to: '/browse', label: 'Browse', icon: BookOpen },
    { to: '/donate', label: 'Donate', icon: PlusCircle, isMain: true },
    { to: '/my-requests', label: 'Requests', icon: Inbox },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const adminTabs = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/books', label: 'Books', icon: BookOpen },
    { to: '/admin/activity', label: 'Activity', icon: Activity },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const tabs = isAdmin ? adminTabs : studentTabs;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 transition-colors">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/student' || tab.to === '/admin'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                } ${tab.isMain ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`
              }
            >
              <div className={`${tab.isMain ? 'bg-emerald-100 dark:bg-emerald-950 p-1.5 rounded-full -mt-3 shadow-md' : ''}`}>
                <Icon className={`w-5 h-5 ${tab.isMain ? 'text-emerald-600 dark:text-emerald-300' : ''}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
