import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { BookOpen, Lock, Mail, ArrowRight, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userType) => {
    setLoading(true);
    try {
      await switchDemoUser(userType);
      if (userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-indigo-200 dark:shadow-none">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome to BookDonate
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sign in to donate or request academic textbooks
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              College Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            Sign In to Student Portal
          </Button>
        </form>

        {/* Quick Demo Logins Box */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              1-Click Demo Accounts
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('pugazh')}
              type="button"
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-left transition"
            >
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                Pugazh (Donor)
              </p>
              <p className="text-[10px] text-slate-400">CS Senior • 8 Donations</p>
            </button>

            <button
              onClick={() => handleQuickLogin('arun')}
              type="button"
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-left transition"
            >
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                Arun (Requester)
              </p>
              <p className="text-[10px] text-slate-400">CS 2nd Year • 3 Requests</p>
            </button>
          </div>
        </div>

        {/* Admin Link & Register Link */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2 text-xs">
          <p className="text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Register as Student
            </Link>
          </p>

          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:underline mt-1"
          >
            <ShieldAlert className="w-3 h-3" />
            Academic Staff & Admin Monitoring Login →
          </Link>
        </div>

      </div>
    </div>
  );
}
