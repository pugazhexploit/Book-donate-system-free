import React from 'react';
import { BookOpen, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                Book Donation System
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                100% FREE
              </span>
            </div>
            
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">
              “One Student’s Old Book Can Be Another Student’s New Opportunity.”
            </p>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              A peer-to-peer campus platform built to eliminate textbook expenses, reduce paper waste, and foster a culture of academic solidarity. Zero selling, zero pricing, purely student-to-student sharing.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/browse" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition">
                  Browse Available Books
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition">
                  Donate Academic Book
                </Link>
              </li>
              <li>
                <Link to="/student" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-600 dark:text-slate-400 hover:text-amber-600 transition">
                  Admin Monitoring Wing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Campus Integrity</h4>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Community Standards
              </div>
              <p className="text-[11px]">
                Books are donated unconditionally. Commercial reselling or charging fees is strictly prohibited across campus grounds.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} College Book Donation System. Built for students, by students.</p>
          <p className="flex items-center gap-1">
            Empowering education with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> on campus
          </p>
        </div>
      </div>
    </footer>
  );
}
