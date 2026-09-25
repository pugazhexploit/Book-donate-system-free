import React from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

export function EmptyState({
  icon = '📚',
  title = 'No items found',
  description = 'There are no items to display at this moment.',
  actionText,
  actionLink,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 my-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-3xl mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        {description}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      )}

      {actionText && onAction && !actionLink && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
