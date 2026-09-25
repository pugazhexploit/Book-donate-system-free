import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { BookOpen, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your college email to receive a password recovery link
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              Recovery Link Sent
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
              If an account is associated with <strong>{email}</strong>, check your college inbox for instructions.
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
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

            <Button type="submit" variant="primary" className="w-full">
              Send Recovery Link
            </Button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
