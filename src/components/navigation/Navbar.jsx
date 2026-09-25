import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { BookOpen, Bell, Sun, Moon, LogOut, User, PlusCircle, ShieldAlert, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAvatar } from '../ui/UserAvatar';

export function Navbar() {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { isDark, toggleTheme } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo with Emerald Glow */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="absolute -inset-0.5 bg-emerald-500 rounded-xl blur-sm opacity-30 group-hover:opacity-60 transition duration-300 -z-10" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                BookDonate
              </span>
              <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                100% FREE
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block -mt-1 font-medium">
              Campus Academic Sharing
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/browse" 
            className="text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition"
          >
            Browse Books
          </Link>

          {isStudent && (
            <>
              <Link 
                to="/donate" 
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition"
              >
                <PlusCircle className="w-4 h-4" />
                Donate a Book
              </Link>
              <Link 
                to="/student" 
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition"
              >
                My Dashboard
              </Link>
              <Link 
                to="/my-requests" 
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition"
              >
                My Requests
              </Link>
            </>
          )}

          {isAdmin && (
            <Link 
              to="/admin" 
              className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Monitoring Dashboard
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Notifications Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifs && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl shadow-2xl p-4 z-50 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</h4>
                        {unreadCount > 0 && (
                          <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 text-xs px-2 py-0.5 rounded-full font-medium">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead} 
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 mt-2">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => markAsRead(n.id)}
                            className={`py-3 px-2 rounded-xl transition cursor-pointer ${n.is_read ? 'opacity-70' : 'bg-emerald-500/5 dark:bg-emerald-500/10'}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-xs text-slate-900 dark:text-white">{n.title}</p>
                              {!n.is_read && <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-0.5 rounded-full hover:ring-2 hover:ring-emerald-400 transition"
              >
                <UserAvatar user={user} size="md" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-2xl p-2 z-50 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        {user.role}
                      </span>
                    </div>

                    <div className="pt-1">
                      {isStudent && (
                        <>
                          <Link
                            to="/student"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                          >
                            <User className="w-4 h-4" />
                            Student Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                          >
                            <User className="w-4 h-4" />
                            My Profile
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded-xl transition"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          Admin Monitor
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-md shadow-emerald-600/25 transition"
              >
                Register
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
