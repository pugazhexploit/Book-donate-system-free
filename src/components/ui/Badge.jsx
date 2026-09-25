import React from 'react';

export function Badge({ children, variant = 'default', className = '', glowing = false }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    free: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm shadow-emerald-500/10',
    primary: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30',
    success: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30',
    info: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors ${variants[variant] || variants.default} ${className}`}>
      {glowing && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
      )}
      {children}
    </span>
  );
}

export function ConditionBadge({ condition }) {
  const map = {
    'New': 'free',
    'Like New': 'success',
    'Good': 'info',
    'Used': 'warning',
    'Heavily Used': 'danger',
  };
  return <Badge variant={map[condition] || 'default'}>Condition: {condition}</Badge>;
}

export function StatusBadge({ status }) {
  const map = {
    'available': { variant: 'free', label: 'Available', glowing: true },
    'requested': { variant: 'warning', label: 'Requested' },
    'accepted': { variant: 'primary', label: 'Accepted' },
    'completed': { variant: 'success', label: 'Completed' },
    'cancelled': { variant: 'danger', label: 'Cancelled' },
    'pending': { variant: 'warning', label: 'Pending' },
    'rejected': { variant: 'danger', label: 'Rejected' },
  };

  const current = map[status] || { variant: 'default', label: status };
  return (
    <Badge variant={current.variant} glowing={current.glowing}>
      {current.label}
    </Badge>
  );
}
