import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MapPin, BookOpen, Send, Sparkles } from 'lucide-react';

export function RequestModal({ isOpen, onClose, book, onConfirm, loading }) {
  const defaultMsg = `Hi, I am interested in this book for my current coursework. Could I collect it from ${book?.donation_location || 'the college library'}?`;
  const [message, setMessage] = useState(defaultMsg);
  const [error, setError] = useState('');

  if (!book) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please add a polite note for the donor.');
      return;
    }
    setError('');
    try {
      await onConfirm(message);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit request.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request This Academic Book" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Book Context Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
          <img
            src={book.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200'}
            alt={book.title}
            className="w-14 h-18 object-cover rounded-lg flex-shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">
              {book.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">by {book.author}</p>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <Sparkles className="w-3 h-3" />
              100% Free Campus Donation
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3" />
              Pickup: {book.donation_location}
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Personal Note to Donor <span className="text-slate-400 font-normal">(Introduce yourself and propose collection time)</span>
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Introduce yourself and specify when you can collect the book..."
          />
          {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" loading={loading}>
            <Send className="w-3.5 h-3.5 mr-1" />
            Send Request
          </Button>
        </div>

      </form>
    </Modal>
  );
}
