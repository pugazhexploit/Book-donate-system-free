import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`} />
  );
}

export function BookCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm p-4">
      <Skeleton className="w-full h-52 rounded-xl mb-4" />
      <Skeleton className="w-3/4 h-5 mb-2" />
      <Skeleton className="w-1/2 h-4 mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-20 h-5" />
      </div>
      <Skeleton className="w-full h-10 rounded-xl" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}
