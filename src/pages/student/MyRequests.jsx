import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { requestService } from '../../services/requests';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Inbox,
  BookOpen,
  MapPin,
  CheckCircle,
  Clock,
  User,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadRequests = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await requestService.getMySentRequests(user.id);
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handleConfirmReceived = async (req) => {
    setActionLoadingId(req.id);
    try {
      await requestService.markCompleted(req.id, user);
      await loadRequests();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelRequest = async (requestId) => {
    setActionLoadingId(requestId);
    try {
      await requestService.cancelRequest(requestId, user);
      await loadRequests();
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'all') return true;
    return r.status === activeTab;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Requested Books
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track the status of academic books you've requested from campus donors.
        </p>
      </div>

      {/* Tabs (Section 14) */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-medium">
        {[
          { id: 'all', label: 'All Requests' },
          { id: 'pending', label: '🟡 Pending' },
          { id: 'accepted', label: '🔵 Accepted' },
          { id: 'completed', label: '🟢 Completed' },
          { id: 'rejected', label: '🔴 Rejected' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Request Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading your requests...</div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No requests yet"
          description="Browse the campus catalog to find textbooks donated by your peers for free."
          actionText="Browse Available Books"
          actionLink="/browse"
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={req.status} />
                      <span className="text-[11px] text-slate-400">
                        Requested on {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {req.book_title || req.book?.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        Donor: <strong className="text-slate-700 dark:text-slate-200">{req.donor_name || req.donor?.full_name || 'Senior Student'}</strong>
                      </span>
                      {req.handover_location && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          Pickup: {req.handover_location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/book/${req.book_id}`}>
                    <Button variant="secondary" size="sm">
                      View Book
                    </Button>
                  </Link>

                  {req.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600"
                      loading={actionLoadingId === req.id}
                      onClick={() => handleCancelRequest(req.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              {/* Message Note */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Your Request Note:</span>
                <p className="text-slate-700 dark:text-slate-300 italic">"{req.message}"</p>
              </div>

              {/* Handover & Confirm Received CTA when Accepted (Section 12) */}
              {req.status === 'accepted' && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Request Accepted by Donor!
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-300 mt-0.5">
                      Please collect the textbook from <strong>{req.handover_location || 'the agreed campus spot'}</strong>.
                    </p>
                  </div>

                  <Button
                    variant="donation"
                    size="sm"
                    loading={actionLoadingId === req.id}
                    onClick={() => handleConfirmReceived(req)}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Confirm Received
                  </Button>
                </div>
              )}

              {/* Completed Badge Display (Section 12) */}
              {req.status === 'completed' && (
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    🎉 <strong>Donation Completed</strong> — Donor: {req.donor_name || 'Senior'} • Receiver: {user.full_name}
                  </span>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
