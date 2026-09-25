import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { bookService } from '../../services/books';
import { requestService } from '../../services/requests';
import { localStore } from '../../services/store';
import { StatCard } from '../../components/dashboard/StatCard';
import { BookCard } from '../../components/books/BookCard';
import { Button } from '../../components/ui/Button';
import {
  BookOpen,
  PlusCircle,
  Inbox,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Send,
  Heart
} from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myDonations: 8,
    availableBooks: 5,
    requestsSent: 3,
    completed: 4,
  });
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      try {
        const books = await bookService.getBooks();
        const myDonations = books.filter(b => b.donor_id === user.id);
        const myRequests = await requestService.getMySentRequests(user.id);
        const available = books.filter(b => b.status === 'available');
        const completed = myDonations.filter(b => b.status === 'completed').length + 
                          myRequests.filter(r => r.status === 'completed').length;

        setStats({
          myDonations: myDonations.length > 0 ? myDonations.length : (user.stats?.booksDonated || 8),
          availableBooks: available.length,
          requestsSent: myRequests.length > 0 ? myRequests.length : 3,
          completed: completed > 0 ? completed : 4,
        });

        // Recommended books for student
        const rec = await bookService.getRecommendedBooks(user.department, user.semester);
        setRecommendedBooks(rec.filter(b => b.donor_id !== user.id).slice(0, 4));

        // Recent activity feed
        const logs = localStore.getLogs();
        setRecentActivities(logs.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  return (
    <div className="space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {user?.department} • {user?.year || '2nd Year'} • Free Book Sharing Hub
          </p>
        </div>

        {/* Quick Donate Action Button */}
        <Link to="/donate">
          <Button variant="donation" size="md" className="shadow-md shadow-emerald-500/20">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            + Donate Book
          </Button>
        </Link>
      </div>

      {/* Metric Cards Grid (Section 6) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Donations"
          value={stats.myDonations}
          subtitle="Books listed by you"
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Available Books"
          value={stats.availableBooks}
          subtitle="Ready to request now"
          icon={Sparkles}
          color="emerald"
        />
        <StatCard
          title="Requests Sent"
          value={stats.requestsSent}
          subtitle="Your pending & active"
          icon={Inbox}
          color="sky"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle="Successful handovers"
          icon={CheckCircle2}
          color="purple"
        />
      </div>

      {/* Quick Actions (Section 6) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/donate">
            <div className="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 transition flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">+ Donate Book</p>
                <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">Share your past semester textbooks</p>
              </div>
            </div>
          </Link>

          <Link to="/browse">
            <div className="p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/40 text-indigo-800 dark:text-indigo-300 transition flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Browse Books</p>
                <p className="text-[11px] text-indigo-700/80 dark:text-indigo-400">Find books across all departments</p>
              </div>
            </div>
          </Link>

          <Link to="/my-requests">
            <div className="p-4 rounded-xl bg-sky-50 hover:bg-sky-100/80 dark:bg-sky-950/30 dark:hover:bg-sky-950/50 border border-sky-200/80 dark:border-sky-800/40 text-sky-800 dark:text-sky-300 transition flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center flex-shrink-0">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">My Requests</p>
                <p className="text-[11px] text-sky-700/80 dark:text-sky-400">Track book statuses & handovers</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Two Column Section: Recent Activity & Recommended Books */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity (Section 6) */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Recent Activity
              </h3>
              <span className="text-[11px] text-slate-400">Live Campus Feed</span>
            </div>

            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {act.description}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {act.time_ago || 'Recently'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link to="/my-donations" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Manage Your Incoming Requests →
            </Link>
          </div>
        </div>

        {/* Recommended Books (Section 6) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Recommended for You
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Curated for {user?.department} • {user?.semester}
              </p>
            </div>

            <Link to="/browse">
              <Button variant="ghost" size="sm" className="text-indigo-600 text-xs">
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          {recommendedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400 mb-3">No matching books for your specific semester right now.</p>
              <Link to="/browse">
                <Button variant="secondary" size="sm">Browse All Departments</Button>
              </Link>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
