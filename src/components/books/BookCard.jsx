import React from 'react';
import { Link } from 'react-router-dom';
import { ConditionBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SpotlightCard } from '../ui/SpotlightCard';
import { BookOpen, MapPin, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function BookCard({ book }) {
  const imageUrl = book.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600';

  return (
    <SpotlightCard
      className="group flex flex-col justify-between border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/40"
      spotlightColor="rgba(16, 185, 129, 0.12)"
    >
      <div>
        {/* Book Cover Image with Zoom Effect */}
        <div className="relative h-52 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-t-3xl">
          <img
            src={imageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Floating FREE Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-600/90 hover:bg-emerald-500 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-emerald-950/30 border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              🎁 FREE DONATION
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <StatusBadge status={book.status || 'available'} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="mb-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {book.title}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              by {book.author}
            </p>
          </div>

          {/* Academic meta */}
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 my-3">
            <div className="flex items-center gap-1.5 font-medium text-teal-700 dark:text-teal-400">
              <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{book.department} • {book.semester}</span>
            </div>
            
            <div className="flex items-center justify-between text-[11px] pt-1">
              <ConditionBadge condition={book.condition} />
              {book.donation_location && (
                <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 truncate max-w-[130px]">
                  <MapPin className="w-3 h-3 flex-shrink-0 text-emerald-500/70" />
                  {book.donation_location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Donor info + Action Button */}
      <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2">
        <div className="flex items-center justify-between gap-2 mb-3 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">
              {book.donor_name?.[0] || 'D'}
            </div>
            <span className="truncate">Donated by <strong className="text-slate-700 dark:text-slate-200 font-semibold">{book.donor_name || 'Senior Student'}</strong></span>
          </div>
        </div>

        <Link to={`/book/${book.id}`} className="block w-full">
          <Button variant="secondary" size="sm" className="w-full text-emerald-600 dark:text-emerald-400 hover:border-emerald-400/50">
            View Book Details
          </Button>
        </Link>
      </div>
    </SpotlightCard>
  );
}
