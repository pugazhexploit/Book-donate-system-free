import React from 'react';
import { User, ShieldCheck } from 'lucide-react';

export function UserAvatar({ user, size = 'md', className = '' }) {
  const isAdmin = user?.role === 'admin';
  const name = user?.full_name || user?.name || (isAdmin ? 'Admin' : 'Student');
  
  // Extract initials (e.g., "Pugazh V" -> "PV", "Admin" -> "AD")
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || (isAdmin ? 'AD' : 'ST');

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-24 h-24 text-2xl',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  const bgGradient = isAdmin
    ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-indigo-400/30'
    : 'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white border-emerald-400/30';

  return (
    <div
      className={`relative inline-flex items-center justify-center font-bold tracking-wider rounded-full select-none shadow-sm border ${selectedSize} ${bgGradient} ${className}`}
      title={`${name} (${isAdmin ? 'Admin / Staff' : 'Student'})`}
    >
      <span>{initials}</span>

      {/* Role Indicator Mini-Badge for Admin / Student */}
      {size === 'xl' && (
        <span
          className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white shadow-md ${
            isAdmin ? 'bg-indigo-600' : 'bg-emerald-600'
          }`}
        >
          {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </span>
      )}
    </div>
  );
}
