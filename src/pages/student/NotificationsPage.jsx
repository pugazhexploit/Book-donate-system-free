import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Button } from '../../components/ui/Button';
import { Bell, CheckCircle2, Clock, Check } from 'lucide-react';

export function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" />
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay updated on your book requests, donor acceptances, and campus handovers.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllAsRead}>
            <Check className="w-3.5 h-3.5 mr-1" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No notifications in your inbox.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`py-4 flex items-start justify-between gap-4 cursor-pointer transition rounded-xl px-2 ${
                !n.is_read ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {n.title}
                  </h4>
                  {!n.is_read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {n.message}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <Clock className="w-3 h-3" />
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(n.id);
                  }}
                  className="text-xs text-indigo-600 hover:underline flex-shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
