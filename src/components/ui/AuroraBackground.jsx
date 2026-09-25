import React from 'react';

export function AuroraBackground({ children, className = '' }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Subtle Dot Grid Texture */}
      <div 
        className="absolute inset-0 pointer-events-none -z-20 bg-[radial-gradient(rgba(16,185,129,0.18)_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-40 dark:opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]" 
      />

      {/* Primary Emerald/Cyan Aurora Glow behind Hero */}
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-emerald-500/25 via-teal-400/20 to-cyan-500/25 dark:from-emerald-500/30 dark:via-teal-500/25 dark:to-cyan-400/20 rounded-full blur-[110px] pointer-events-none -z-10 animate-pulse" />

      {/* Secondary Right Ambient Glow */}
      <div className="absolute top-[25%] right-[-5%] w-[600px] h-[400px] bg-gradient-to-br from-teal-500/20 to-emerald-400/15 dark:from-teal-600/20 dark:to-emerald-500/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Tertiary Left Ambient Glow */}
      <div className="absolute top-[65%] left-[-8%] w-[600px] h-[400px] bg-gradient-to-tr from-indigo-500/20 to-teal-400/15 dark:from-indigo-600/25 dark:to-cyan-500/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      {children}
    </div>
  );
}
