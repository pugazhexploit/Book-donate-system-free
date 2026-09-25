import React from 'react';
import { motion } from 'framer-motion';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none overflow-hidden';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 dark:shadow-emerald-950/50 focus:ring-emerald-500 border border-emerald-500/30',
    donation: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/30 focus:ring-emerald-400 border border-emerald-400/30',
    secondary: 'bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-800/90 shadow-sm backdrop-blur-md focus:ring-slate-400',
    outline: 'border border-emerald-600/80 text-emerald-600 hover:bg-emerald-50/80 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-950/40 focus:ring-emerald-500',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 focus:ring-rose-500',
    cyber: 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/20 focus:ring-teal-400 border border-teal-300/20',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4.5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
