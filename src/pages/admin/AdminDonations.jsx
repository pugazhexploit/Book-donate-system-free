import React, { useState, useEffect } from 'react';
import { localStore } from '../../services/store';
import { StatusBadge } from '../../components/ui/Badge';
import { DEPARTMENTS } from '../../utils/constants';
import { HeartHandshake, Search, ShieldCheck } from 'lucide-react';

export function AdminDonations() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const books = localStore.getBooks();
    const requests = localStore.getRequests();

    // Compile comprehensive donation records
    const list = requests.map(r => {
      const book = books.find(b => b.id === r.book_id) || {};
      return {
        id: r.id,
        donor: r.donor_name || 'Senior Donor',
        book: r.book_title || book.title || 'Textbook',
        receiver: r.requester_name || 'Student',
        department: r.requester_department || book.department || 'B.Sc Computer Science',
        date: r.created_at,
        status: r.status,
      };
    });

    setRecords(list);
  }, []);

  const filtered = records.filter(item => {
    const matchesSearch = item.book.toLowerCase().includes(search.toLowerCase()) ||
                          item.donor.toLowerCase().includes(search.toLowerCase()) ||
                          item.receiver.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || item.department.includes(deptFilter);
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Donation Lifecycle Records
            </h1>
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">
              Read-Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Display: Donor, Book, Receiver, Department, Date, and Status (strictly audit/monitoring).
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/40">
          <ShieldCheck className="w-4 h-4" />
          <span>Admin cannot modify donation records</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by book, donor, receiver student..."
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
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="w-full sm:w-56">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Table (Section 20) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Donor</th>
                <th className="py-3.5 px-4">Book Title</th>
                <th className="py-3.5 px-4">Receiver</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No donation records found.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {d.donor}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                      {d.book}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {d.receiver}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {d.department}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(d.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={d.status} />
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
