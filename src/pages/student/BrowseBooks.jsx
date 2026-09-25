import React, { useState, useEffect } from 'react';
import { bookService } from '../../services/books';
import { BookCard } from '../../components/books/BookCard';
import { BookFilter } from '../../components/books/BookFilter';
import { BookCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { BookOpen, Sparkles } from 'lucide-react';

export function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: 'All',
    semester: 'All',
    subject: 'All',
    condition: 'All',
    sortBy: 'recent',
    status: 'available',
  });

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await bookService.getBooks(filters);
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: 'All',
      semester: 'All',
      subject: 'All',
      condition: 'All',
      sortBy: 'recent',
      status: 'available',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Browse Campus Books
          </h1>
          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-300/40">
            Free Academic Sharing
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore textbooks donated by seniors and peers. Request for free to prepare for your semester.
        </p>
      </div>

      {/* Filter Bar */}
      <BookFilter
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Book Grid / Loading / Empty */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📚"
          title="No books match your criteria"
          description="Try broadening your department or subject filters, or be the first student to donate this book to help others."
          actionText="Donate a Book"
          actionLink="/donate"
        />
      )}

    </div>
  );
}
