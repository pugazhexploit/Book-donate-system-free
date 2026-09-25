import React from 'react';

export function ShinyText({ children, className = '', speed = 3 }) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 via-teal-500 to-emerald-800 dark:from-white dark:via-emerald-300 dark:to-white bg-[length:200%_100%] animate-shimmer font-semibold ${className}`}
      style={{
        animationDuration: `${speed}s`,
      }}
    >
      {children}
    </span>
  );
}
