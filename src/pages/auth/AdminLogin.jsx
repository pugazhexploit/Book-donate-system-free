import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, Lock, Mail, AlertTriangle, KeyRound } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('admin@college.edu');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Staff verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = async () => {
    setLoading(true);
    try {
      await switchDemoUser('admin');
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-amber-200 dark:shadow-none">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Campus Staff Monitoring
          </h2>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-medium">
            Read-Only Academic Oversight & Analytics
          </p>
        </div>

        {/* Notice of Monitoring Only */}
        <div className="p-3.5 mb-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            STRICT READ-ONLY SYSTEM POLICY
          </div>
          <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
            Admins monitor campus participation, audit trails, and distribution statistics. Admin accounts cannot insert, update, approve, or delete student and book records.
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
              Staff / Dean Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Access Monitoring Dashboard'}
          </button>
        </form>

        {/* 1-Click Demo Admin Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            1-Click Staff Demo Login (Dean)
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-xs text-slate-500 dark:text-slate-400 hover:underline">
            ← Return to Student Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
