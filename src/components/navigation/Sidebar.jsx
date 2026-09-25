import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Inbox,
  User,
  ShieldCheck,
  Users,
  Activity,
  BarChart3,
  BookMarked,
  HeartHandshake,
  LogOut,
  Sparkles,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserAvatar } from '../ui/UserAvatar';

export function Sidebar() {
  const { user, isAdmin, isStudent } = useAuth();

  const studentLinks = [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/browse', label: 'Browse Books', icon: BookOpen },
    { to: '/donate', label: 'Donate Book', icon: PlusCircle, highlight: true },
    { to: '/my-donations', label: 'My Donations', icon: BookMarked },
    { to: '/my-requests', label: 'My Requests', icon: Inbox },
    { to: '/profile', label: 'Student Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Student Directory', icon: Users },
    { to: '/admin/books', label: 'Book Inventory', icon: BookOpen },
    { to: '/admin/donations', label: 'Donation Records', icon: HeartHandshake },
    { to: '/admin/requests', label: 'Request Tracker', icon: Inbox },
    { to: '/admin/activity', label: 'Activity Logs', icon: Activity },
    { to: '/admin/analytics', label: 'Campus Analytics', icon: BarChart3 },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-white/70 dark:bg-[#070b14]/70 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex-shrink-0 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] p-4 transition-colors">
      <div>
        {/* User Card */}
        {user && (
          <div className="p-3 mb-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <UserAvatar user={user} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.department}
                </p>
              </div>
            </div>
            
            {isAdmin && (
              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Read-Only Monitoring Mode
              </div>
            )}
          </div>
        )}

        {/* Section Heading */}
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {isAdmin ? 'Monitoring Wing' : 'Student Portal'}
        </div>

        {/* Navigation Links with Smooth Active Transitions */}
        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/student' || item.to === '/admin'}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold'
                      : item.highlight
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/15 hover:bg-emerald-500/20 border border-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Campus Core Banner */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free Campus Policy
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            No selling or pricing. Every book is shared for free to promote equal academic opportunity.
          </p>
        </div>
      </div>
    </aside>
  );
}
