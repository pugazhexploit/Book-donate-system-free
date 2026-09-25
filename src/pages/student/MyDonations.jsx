import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { bookService } from '../../services/books';
import { requestService } from '../../services/requests';
import { StatusBadge, ConditionBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  BookOpen,
  PlusCircle,
  Inbox,
  CheckCircle,
  XCircle,
  MapPin,
  User,
  Clock,
  Sparkles
} from 'lucide-react';

export function MyDonations() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [donations, setDonations] = useState([]);
  const [requestsForBooks, setRequestsForBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const myBooks = await bookService.getMyDonations(user.id);
      const incomingRequests = await requestService.getRequestsForMyBooks(user.id);
      setDonations(myBooks);
      setRequestsForBooks(incomingRequests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAcceptRequest = async (requestId) => {
    setActionLoadingId(requestId);
    try {
      await requestService.acceptRequest(requestId, user);
      await loadData();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setActionLoadingId(requestId);
    try {
      await requestService.rejectRequest(requestId, user);
      await loadData();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkCompleted = async (requestId) => {
    setActionLoadingId(requestId);
    try {
      await requestService.markCompleted(requestId, user);
      await loadData();
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredDonations = donations.filter(b => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Book Donations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your listed textbooks and review student requests.
          </p>
        </div>

        <Link to="/donate">
          <Button variant="donation" size="sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            + Donate Another Book
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-medium">
        {[
          { id: 'all', label: 'All Donations' },
          { id: 'available', label: 'Available' },
          { id: 'requested', label: 'Requested' },
          { id: 'accepted', label: 'Accepted' },
          { id: 'completed', label: 'Completed' },
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

      {/* Donations List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading your donations...</div>
      ) : filteredDonations.length === 0 ? (
        <EmptyState
          icon="🎁"
          title="You haven't donated any books in this category yet."
          description="Have textbooks from past semesters? Help a junior student by listing them for free."
          actionText="Donate Your First Book"
          actionLink="/donate"
        />
      ) : (
        <div className="space-y-4">
          {filteredDonations.map((book) => {
            const incomingReqs = requestsForBooks.filter(r => r.book_id === book.id);
            const acceptedReq = incomingReqs.find(r => r.status === 'accepted');

            return (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={book.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200'}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={book.status} />
                        <ConditionBadge condition={book.condition} />
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {book.author} • {book.department} ({book.semester})
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        Handover spot: {book.donation_location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/book/${book.id}`}>
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Handover & Completion Notification if Accepted */}
                {acceptedReq && book.status === 'accepted' && (
                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        Accepted for {acceptedReq.requester_name || acceptedReq.requester?.full_name}!
                      </p>
                      <p className="text-indigo-700 dark:text-indigo-300 mt-0.5">
                        Please meet at <strong>{book.donation_location}</strong> to hand over the textbook.
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      loading={actionLoadingId === acceptedReq.id}
                      onClick={() => handleMarkCompleted(acceptedReq.id)}
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      Mark as Completed
                    </Button>
                  </div>
                )}

                {/* Incoming Requests Section (Section 11) */}
                {incomingReqs.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Student Requests ({incomingReqs.length})
                    </p>

                    <div className="space-y-2">
                      {incomingReqs.map((req) => (
                        <div
                          key={req.id}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {req.requester_name || req.requester?.full_name || 'Student'}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500">
                                {req.requester_department || req.requester?.department} ({req.requester_year || req.requester?.year || 'Junior'})
                              </span>
                              <span className="ml-1">
                                <StatusBadge status={req.status} />
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mt-1 italic">
                              "{req.message}"
                            </p>
                          </div>

                          {req.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="donation"
                                size="sm"
                                loading={actionLoadingId === req.id}
                                onClick={() => handleAcceptRequest(req.id)}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                loading={actionLoadingId === req.id}
                                onClick={() => handleRejectRequest(req.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
