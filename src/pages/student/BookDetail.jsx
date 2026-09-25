import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/books';
import { requestService } from '../../services/requests';
import { useAuth } from '../../contexts/AuthContext';
import { ConditionBadge, StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { RequestModal } from '../../components/books/RequestModal';
import {
  BookOpen,
  MapPin,
  Calendar,
  User,
  Hash,
  Layers,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadBook() {
      setLoading(true);
      try {
        const data = await bookService.getBookById(id);
        setBook(data);
        const firstImg = data.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600';
        setActiveImage(firstImg);
      } catch (err) {
        setError(err.message || 'Book not found.');
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [id]);

  const isOwner = user && book && book.donor_id === user.id;

  const handleRequestConfirm = async (message) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setRequestLoading(true);
    try {
      await requestService.createRequest({
        book,
        requester: user,
        message
      });
      setSuccessMsg('Your book request was submitted successfully! The donor has been notified.');
      // Refresh book
      const updated = await bookService.getBookById(id);
      setBook(updated);
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading book specifications...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Book Not Available</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'This book could not be found.'}</p>
        <Link to="/browse">
          <Button variant="secondary" size="sm">Back to Browse</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Back button */}
      <div>
        <Link to="/browse" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Books Directory
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <Link to="/my-requests">
            <Button variant="primary" size="sm">View in My Requests</Button>
          </Link>
        </div>
      )}

      {/* Main Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
            <img
              src={activeImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                🎁 100% FREE DONATION
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <StatusBadge status={book.status} />
            </div>
          </div>

          {/* Thumbnails */}
          {book.images && book.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {book.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === img ? 'border-indigo-600 scale-95' : 'border-slate-200 dark:border-slate-700 opacity-70'
                  }`}
                >
                  <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Book Metadata & Request CTA */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ConditionBadge condition={book.condition} />
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Donated {new Date(book.created_at).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {book.title}
              </h1>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
                Author: {book.author}
              </p>
            </div>

            {/* Academic Tags */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">Department</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{book.department}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Semester</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{book.semester}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Subject / Module</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{book.subject}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Edition</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{book.edition || 'Standard Edition'}</span>
              </div>
            </div>

            {/* ISBN if available */}
            {book.isbn && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>ISBN: <strong className="font-mono text-slate-700 dark:text-slate-300">{book.isbn}</strong></span>
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Donor's Condition Notes
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {book.description || 'No additional condition notes provided by donor.'}
              </p>
            </div>

            {/* Handover Campus Location */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
              <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>
                Campus Handover Location: <strong>{book.donation_location}</strong>
              </span>
            </div>

            {/* Donor Credit */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                {book.donor_name?.[0] || 'D'}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Donated by {book.donor_name || 'Senior Peer'}
                </p>
                <p className="text-slate-400">{book.donor_department || book.department}</p>
              </div>
            </div>

          </div>

          {/* Action Button Section (Section 9) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            {isOwner ? (
              <div className="space-y-2">
                <Link to="/my-donations" className="block w-full">
                  <Button variant="primary" size="lg" className="w-full">
                    Manage Requests for This Book
                  </Button>
                </Link>
                <p className="text-[11px] text-center text-slate-400">
                  You donated this book. Review interested students and accept requests.
                </p>
              </div>
            ) : book.status === 'available' ? (
              <Button
                variant="donation"
                size="lg"
                className="w-full shadow-lg shadow-emerald-500/20"
                onClick={() => setShowRequestModal(true)}
              >
                <Sparkles className="w-5 h-5 mr-1.5" />
                Request This Book
              </Button>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 text-center">
                This book is currently <strong>{book.status}</strong> by another student.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Request Modal */}
      <RequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        book={book}
        onConfirm={handleRequestConfirm}
        loading={requestLoading}
      />

    </div>
  );
}
