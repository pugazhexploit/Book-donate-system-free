import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { DEPARTMENTS, SEMESTERS, SUBJECTS, CONDITIONS } from '../../utils/constants';

export function BookFilter({ filters, onChange, onReset }) {
  return (
    <div className="glass-card rounded-3xl p-5 shadow-sm space-y-4">
      
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-500" />
        <input
          type="text"
          placeholder="Search books, authors, subjects, ISBN..."
          value={filters.search || ''}
          onChange={(e) => onChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
        />
      </div>

      {/* Filter Selects Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        
        {/* Department */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Department
          </label>
          <select
            value={filters.department || 'All'}
            onChange={(e) => onChange('department', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Semester
          </label>
          <select
            value={filters.semester || 'All'}
            onChange={(e) => onChange('semester', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="All">All Semesters</option>
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Subject
          </label>
          <select
            value={filters.subject || 'All'}
            onChange={(e) => onChange('subject', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="All">All Subjects</option>
            {SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Condition
          </label>
          <select
            value={filters.condition || 'All'}
            onChange={(e) => onChange('condition', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="All">All Conditions</option>
            {CONDITIONS.map((cond) => (
              <option key={cond.label} value={cond.label}>{cond.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sorting & Reset Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Sort by:</span>
          <select
            value={filters.sortBy || 'recent'}
            onChange={(e) => onChange('sortBy', e.target.value)}
            className="p-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="recent">Recently Donated</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
          </select>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      </div>

    </div>
  );
}
