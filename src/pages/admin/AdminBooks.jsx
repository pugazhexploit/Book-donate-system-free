import React, { useState, useEffect } from 'react';
import { localStore } from '../../services/store';
import { StatusBadge, ConditionBadge } from '../../components/ui/Badge';
import { DEPARTMENTS, BOOK_STATUS } from '../../utils/constants';
import { BookOpen, Search, ShieldCheck, MapPin } from 'lucide-react';

export function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  useEffect(() => {
    setBooks(localStore.getBooks());
  }, []);

  const filtered = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
                          b.author.toLowerCase().includes(search.toLowerCase()) ||
                          b.subject.toLowerCase().includes(search.toLowerCase()) ||
                          (b.donor_name && b.donor_name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesDept = deptFilter === 'All' || b.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Book Inventory Oversight
            </h1>
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">
              Read-Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Audit cataloged textbooks, donor identities, condition classifications, and availability statuses.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/40">
          <ShieldCheck className="w-4 h-4" />
          <span>Admin cannot edit or delete book entries</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by book title, author, subject, donor..."
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
            <option value="available">Available</option>
            <option value="requested">Requested</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
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

      {/* Book Table (Section 19) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Book Details</th>
                <th className="py-3.5 px-4">Donor Student</th>
                <th className="py-3.5 px-4">Department & Sem</th>
                <th className="py-3.5 px-4">Condition</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No books found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200'}
                          alt={b.title}
                          className="w-9 h-11 object-cover rounded-lg border border-slate-200 dark:border-slate-700 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{b.title}</p>
                          <p className="text-[11px] text-slate-400">{b.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {b.donor_name || 'Senior Student'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{b.department}</span>
                      <span className="text-[11px] text-slate-400 block">{b.semester}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <ConditionBadge condition={b.condition} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="line-clamp-1">{b.donation_location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(b.created_at).toLocaleDateString()}
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
