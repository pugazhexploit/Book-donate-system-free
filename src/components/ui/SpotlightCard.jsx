import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

export function SpotlightCard({
  children,
  className = '',
  spotlightColor,
  borderColor,
  ...props
}) {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { isDark } = useTheme();

  // Dynamic theme-aware defaults
  const activeSpotlight = spotlightColor || (isDark ? 'rgba(16, 185, 129, 0.14)' : 'rgba(16, 185, 129, 0.08)');
  const activeBorder = borderColor || (isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.45)');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-lg transition-all duration-300 text-slate-800 dark:text-slate-100 ${className}`}
      {...props}
    >
      {/* Dynamic Mouse Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, ${activeSpotlight}, transparent 70%)`,
        }}
      />

      {/* Subtle border highlight under the cursor */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: `inset 0 0 0 1px ${activeBorder}`,
        }}
      />

      {/* Card Content */}
      <div className="relative z-30 h-full">{children}</div>
    </motion.div>
  );
}
