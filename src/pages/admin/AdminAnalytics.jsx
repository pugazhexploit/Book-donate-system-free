import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analytics';
import { SpotlightCard } from '../../components/ui/SpotlightCard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon, Building2, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';

export function AdminAnalytics() {
  const [timeline, setTimeline] = useState([]);
  const [deptStats, setDeptStats] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [time, depts, status, subs] = await Promise.all([
          analyticsService.getDonationTimeline(),
          analyticsService.getDepartmentStats(),
          analyticsService.getStatusBreakdown(),
          analyticsService.getSubjectStats(),
        ]);
        setTimeline(time);
        setDeptStats(depts);
        setStatusData(status);
        setSubjects(subs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Campus Academic Sharing Analytics
            </h1>
            <span className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Read-Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Data visualizations powered by Recharts tracking student contributions, department activity, and resource reuse.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Monitoring Only View</span>
        </div>
      </div>

      {/* Grid of Charts with Spotlight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Donations Over Time (Line Chart) */}
        <SpotlightCard
          className="p-6 space-y-4"
          spotlightColor="rgba(16, 185, 129, 0.12)"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Donations Over Time
            </h3>
            <span className="text-xs text-slate-400">Monthly Volume</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '14px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="donations" name="Books Donated" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="requests" name="Student Requests" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="completed" name="Completed Handovers" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SpotlightCard>

        {/* Chart 2: Books by Department (Bar Chart) */}
        <SpotlightCard
          className="p-6 space-y-4"
          spotlightColor="rgba(6, 182, 212, 0.12)"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-500" />
              Books by Department
            </h3>
            <span className="text-xs text-slate-400">Distribution</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptStats} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '14px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="books" name="Books Donated" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SpotlightCard>

        {/* Chart 3: Donation Status (Donut / Pie Chart) */}
        <SpotlightCard
          className="p-6 space-y-4"
          spotlightColor="rgba(245, 158, 11, 0.12)"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-amber-500" />
              Donation Status Breakdown
            </h3>
            <span className="text-xs text-slate-400">Current Catalog</span>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '14px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SpotlightCard>

        {/* Chart 4: Most Donated Subjects (Horizontal Bar Chart) */}
        <SpotlightCard
          className="p-6 space-y-4"
          spotlightColor="rgba(139, 92, 246, 0.12)"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-500" />
              Most Donated Subjects
            </h3>
            <span className="text-xs text-slate-400">Curriculum Demand</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjects} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="subject" type="category" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '14px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Textbooks Donated" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SpotlightCard>

      </div>

      {/* Chart 5: Department Participation Comparison */}
      <SpotlightCard
        className="p-6 sm:p-8 space-y-4"
        spotlightColor="rgba(16, 185, 129, 0.12)"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Department Participation Comparison
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cross-department comparison: Number of Donors vs. Books Donated vs. Students Helped
            </p>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptStats} margin={{ top: 10, right: 10, left: -10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '14px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
              <Bar dataKey="donors" name="Active Donors" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="books" name="Books Donated" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="helped" name="Students Helped" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SpotlightCard>

    </div>
  );
}
