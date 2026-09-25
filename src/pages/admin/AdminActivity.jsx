import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analytics';
import { Activity, ShieldCheck, Filter, Clock, CheckCircle2, BookOpen, Inbox } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export function AdminActivity() {
  const [logs, setLogs] = useState([]);
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    async function fetchLogs() {
      const data = await analyticsService.getActivityLogs();
      setLogs(data);
    }
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filterAction === 'ALL') return true;
    if (filterAction === 'DONATE') return log.action.includes('DONATE');
    if (filterAction === 'REQUEST') return log.action.includes('REQUEST');
    if (filterAction === 'COMPLETE') return log.action.includes('COMPLETE');
    return true;
  });

  const getActionBadge = (action) => {
    if (action.includes('DONATE')) return <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">Donation</span>;
    if (action.includes('REQUEST')) return <span className="bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full">Request</span>;
    if (action.includes('ACCEPT')) return <span className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full">Accepted</span>;
    if (action.includes('COMPLETE')) return <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full">Completed</span>;
    return <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Activity</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-600" />
              Live Campus Activity Monitor
            </h1>
            <Badge variant="warning">Monitoring Only</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time chronological audit trail of student donations, incoming requests, and confirmed book handovers.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/40">
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Log Immutability Active</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-medium">
        {[
          { id: 'ALL', label: 'All Activities' },
          { id: 'DONATE', label: '🟢 Book Donations' },
          { id: 'REQUEST', label: '🔵 Student Requests' },
          { id: 'COMPLETE', label: '🟣 Completed Handovers' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterAction(tab.id)}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterAction === tab.id
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Live Feed List (Section 23) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No activity records match the selected action filter.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const dotColor = 
              log.action.includes('DONATE') ? 'bg-emerald-500' :
              log.action.includes('REQUEST') ? 'bg-sky-500' :
              log.action.includes('ACCEPT') ? 'bg-purple-500' :
              log.action.includes('COMPLETE') ? 'bg-indigo-500' : 'bg-slate-400';

            return (
              <div key={log.id} className="py-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className={`w-3 h-3 rounded-full ${dotColor} mt-1 flex-shrink-0`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {log.description}
                      </p>
                      {getActionBadge(log.action)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{log.time_ago || 'Recently'}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 hidden sm:block">
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                    {log.action}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
