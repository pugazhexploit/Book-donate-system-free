import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analytics';
import { StatCard } from '../../components/dashboard/StatCard';
import {
  Users,
  BookOpen,
  Sparkles,
  Inbox,
  CheckCircle2,
  ShieldCheck,
  Activity,
  ArrowRight,
  BarChart3,
  HeartHandshake
} from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 1250,
    totalBooks: 2840,
    availableBooks: 1120,
    activeRequests: 430,
    completedDonations: 1920,
  });

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await analyticsService.getSummaryStats();
        const logs = await analyticsService.getActivityLogs();
        setStats(data);
        setActivities(logs.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Header (Section 17) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Campus Book Donation Monitoring
            </h1>
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-300/40">
              Read-Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time administrative oversight, peer exchange tracking, and college department analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/analytics">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
              <BarChart3 className="w-3.5 h-3.5" />
              View Deep Analytics
            </button>
          </Link>
        </div>
      </div>

      {/* Statistics (Section 17) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          subtitle="Enrolled on portal"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Books"
          value={stats.totalBooks.toLocaleString()}
          subtitle="All cataloged books"
          icon={BookOpen}
          color="sky"
        />
        <StatCard
          title="Available Books"
          value={stats.availableBooks.toLocaleString()}
          subtitle="Ready for request"
          icon={Sparkles}
          color="emerald"
        />
        <StatCard
          title="Active Requests"
          value={stats.activeRequests.toLocaleString()}
          subtitle="Pending / In-progress"
          icon={Inbox}
          color="amber"
        />
        <StatCard
          title="Completed"
          value={stats.completedDonations.toLocaleString()}
          subtitle="Successful handovers"
          icon={CheckCircle2}
          color="purple"
        />
      </div>

      {/* Two Column Layout: Monitoring Modules & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Monitoring Modules Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Monitoring Directories
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <Link to="/admin/students" className="group">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    Student Monitoring
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    View student directories, register numbers, department enrollment, and contribution counts.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Open Directory <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link to="/admin/books" className="group">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    Book Inventory Oversight
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Audit textbook titles, donor profiles, semester classifications, condition grades, and availability.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Inspect Inventory <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link to="/admin/donations" className="group">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                    Donation Records
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Audit historical donations, donor-to-receiver associations, and department distribution trails.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400">
                  Review Records <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link to="/admin/requests" className="group">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 transition shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                    Request Tracker
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Monitor active student requests, pending acceptances, collection spots, and resolution rates.
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400">
                  Track Requests <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* Live-Style Activity Feed (Section 23) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Live Activity Feed
              </h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {activities.map((act) => {
                const dotColors = {
                  green: 'bg-emerald-500',
                  blue: 'bg-sky-500',
                  purple: 'bg-purple-500',
                };
                return (
                  <div key={act.id} className="py-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${dotColors[act.type] || 'bg-indigo-500'}`} />
                        {act.time_ago || 'Recently'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {act.action}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 pl-3.5">
                      {act.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link to="/admin/activity" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All Campus Activity Logs →
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
