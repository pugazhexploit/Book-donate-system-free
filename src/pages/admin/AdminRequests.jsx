import React, { useState, useEffect } from 'react';
import { localStore } from '../../services/store';
import { StatusBadge } from '../../components/ui/Badge';
import { Inbox, Search, ShieldCheck } from 'lucide-react';

export function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    setRequests(localStore.getRequests());
  }, []);

  const filtered = requests.filter(r => {
    const matchesSearch = (r.requester_name && r.requester_name.toLowerCase().includes(search.toLowerCase())) ||
                          (r.book_title && r.book_title.toLowerCase().includes(search.toLowerCase())) ||
                          (r.donor_name && r.donor_name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Book Request Monitoring Tracker
            </h1>
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">
              Read-Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Show: Requester, Book, Donor, Request date, and Status (strictly monitoring).
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/40">
          <ShieldCheck className="w-4 h-4" />
          <span>Admin cannot approve, reject, or modify requests</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by requester student, book title, donor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="All">All Request Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Requests Table (Section 21) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Requester</th>
                <th className="py-3.5 px-4">Book</th>
                <th className="py-3.5 px-4">Donor</th>
                <th className="py-3.5 px-4">Request Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No active student requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {r.requester_name || 'Student'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                      {r.book_title || 'Academic Textbook'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {r.donor_name || 'Senior Donor'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
