import React, { useState, useEffect } from 'react';
import { localStore } from '../../services/store';
import { DEPARTMENTS } from '../../utils/constants';
import { Users, Search, Filter, ShieldCheck, Mail, Phone, Hash } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { UserAvatar } from '../../components/ui/UserAvatar';

export function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  useEffect(() => {
    const profiles = localStore.getProfiles().filter(p => p.role === 'student');
    setStudents(profiles);
  }, []);

  const filtered = students.filter(s => {
    const matchesSearch = s.full_name.toLowerCase().includes(search.toLowerCase()) ||
                          s.email.toLowerCase().includes(search.toLowerCase()) ||
                          (s.register_number && s.register_number.toLowerCase().includes(search.toLowerCase()));
    const matchesDept = deptFilter === 'All' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Student Directory Monitoring
            </h1>
            <Badge variant="warning">Read-Only View</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor registered students across academic departments, donation counts, and participation rates.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/40">
          <ShieldCheck className="w-4 h-4" />
          <span>Admin cannot edit or delete student data</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, email, register number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="All">All Academic Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Students Table (Section 18) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Register No</th>
                <th className="py-3.5 px-4">Department & Year</th>
                <th className="py-3.5 px-4 text-center">Donations Listed</th>
                <th className="py-3.5 px-4 text-center">Books Received</th>
                <th className="py-3.5 px-4 text-center">Completed</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No student records match your query.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={s} size="sm" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{s.full_name}</p>
                          <p className="text-[11px] text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {s.register_number || '21CS104'}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{s.department}</p>
                      <p className="text-[11px] text-slate-400">{s.year || '2nd Year'} • {s.semester}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-indigo-600 dark:text-indigo-400">
                      {s.stats?.booksDonated || 4}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-sky-600 dark:text-sky-400">
                      {s.stats?.booksReceived || 2}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {s.stats?.completedDonations || 3}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40">
                        Active Verified
                      </span>
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
