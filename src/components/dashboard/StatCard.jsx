import React from 'react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { AnimatedCounter } from '../ui/AnimatedCounter';

export function StatCard({ title, value, subtitle, icon: Icon, color = 'emerald' }) {
  const colorMaps = {
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      spotlight: 'rgba(16, 185, 129, 0.12)',
    },
    indigo: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      spotlight: 'rgba(99, 102, 241, 0.12)',
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
      spotlight: 'rgba(245, 158, 11, 0.12)',
    },
    sky: {
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      spotlight: 'rgba(6, 182, 212, 0.12)',
    },
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20',
      spotlight: 'rgba(168, 85, 247, 0.12)',
    },
  };

  const scheme = colorMaps[color] || colorMaps.emerald;

  return (
    <SpotlightCard
      className="p-5"
      spotlightColor={scheme.spotlight}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            <AnimatedCounter value={value} />
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${scheme.bg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}
