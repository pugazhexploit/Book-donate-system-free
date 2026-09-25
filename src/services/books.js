import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from './store';

export const bookService = {
  // Get all books with filtering and sorting
  async getBooks(filters = {}) {
    if (isSupabaseConfigured) {
      let query = supabase
        .from('books')
        .select(`
          *,
          donor:profiles(full_name, department, avatar_url),
          images:book_images(image_url)
        `);

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.department && filters.department !== 'All') {
        query = query.eq('department', filters.department);
      }
      if (filters.semester && filters.semester !== 'All') {
        query = query.eq('semester', filters.semester);
      }
      if (filters.subject && filters.subject !== 'All') {
        query = query.eq('subject', filters.subject);
      }
      if (filters.condition && filters.condition !== 'All') {
        query = query.eq('condition', filters.condition);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,author.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`);
      }

      if (filters.sortBy === 'alphabetical') {
        query = query.order('title', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }

    // Local Store
    let books = localStore.getBooks();

    if (filters.status) {
      books = books.filter(b => b.status === filters.status);
    }
    if (filters.department && filters.department !== 'All') {
      books = books.filter(b => b.department === filters.department);
    }
    if (filters.semester && filters.semester !== 'All') {
      books = books.filter(b => b.semester === filters.semester);
    }
    if (filters.subject && filters.subject !== 'All') {
      books = books.filter(b => b.subject === filters.subject);
    }
    if (filters.condition && filters.condition !== 'All') {
      books = books.filter(b => b.condition === filters.condition);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      books = books.filter(b => 
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.subject.toLowerCase().includes(q) ||
        (b.isbn && b.isbn.toLowerCase().includes(q))
      );
    }

    if (filters.sortBy === 'alphabetical') {
      books.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      books.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return books;
  },

  // Get single book details
  async getBookById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          donor:profiles(id, full_name, email, phone, department, year, avatar_url),
          images:book_images(image_url)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    }

    const books = localStore.getBooks();
    const book = books.find(b => b.id === id);
    if (!book) throw new Error('Book not found');
    return book;
  },

  // Create book donation
  async donateBook(bookData, donor) {
    if (isSupabaseConfigured) {
      const { data: book, error: bookError } = await supabase
        .from('books')
        .insert([{
          donor_id: donor.id,
          title: bookData.title,
          author: bookData.author,
          isbn: bookData.isbn || null,
          edition: bookData.edition || null,
          subject: bookData.subject,
          department: bookData.department,
          semester: bookData.semester,
          condition: bookData.condition,
          description: bookData.description,
          donation_location: bookData.donation_location,
          status: 'available',
        }])
        .select()
        .single();

      if (bookError) throw bookError;

      // Insert image records
      if (bookData.images && bookData.images.length > 0) {
        const imageRows = bookData.images.map(url => ({
          book_id: book.id,
          image_url: url
        }));
        await supabase.from('book_images').insert(imageRows);
      }

      // Log activity
      await supabase.from('activity_logs').insert([{
        user_id: donor.id,
        action: 'DONATE_BOOK',
        entity_type: 'book',
        entity_id: book.id,
        description: `${donor.full_name} donated "${book.title}"`
      }]);

      return book;
    }

    // Local Mock Store
    const books = localStore.getBooks();
    const newBook = {
      id: 'book-' + Date.now(),
      donor_id: donor.id,
      donor_name: donor.full_name,
      donor_department: donor.department,
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn || '',
      edition: bookData.edition || '',
      subject: bookData.subject,
      department: bookData.department,
      semester: bookData.semester,
      condition: bookData.condition || 'Good',
      description: bookData.description || '',
      donation_location: bookData.donation_location,
      status: 'available',
      images: bookData.images && bookData.images.length > 0 
        ? bookData.images 
        : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'],
      created_at: new Date().toISOString(),
    };

    books.unshift(newBook);
    localStore.saveBooks(books);
    localStore.addLog('DONATE_BOOK', 'book', `${donor.full_name} donated "${newBook.title}"`, donor.full_name, 'green');

    return newBook;
  },

  // Upload book image to Supabase Storage with local preview fallback
  async uploadBookImage(file) {
    // Validate file
    if (!file) throw new Error('No image file selected.');
    if (!file.type.startsWith('image/')) throw new Error('Only image files (JPG, PNG, WebP) are allowed.');
    if (file.size > 5 * 1024 * 1024) throw new Error('Image size must be less than 5MB.');

    if (isSupabaseConfigured) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `books/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('book-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('book-images').getPublicUrl(filePath);
      return data.publicUrl;
    }

    // Return Data URL for instant offline demo preview
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  },

  // Get books donated by a specific student
  async getMyDonations(donorId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          requests:book_requests(id, status, requester:profiles(full_name, department))
        `)
        .eq('donor_id', donorId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }

    const books = localStore.getBooks().filter(b => b.donor_id === donorId);
    const requests = localStore.getRequests();
    
    return books.map(book => ({
      ...book,
      request_count: requests.filter(r => r.book_id === book.id && r.status !== 'cancelled').length,
      active_request: requests.find(r => r.book_id === book.id && (r.status === 'accepted' || r.status === 'pending'))
    }));
  },

  // Get recommended books for student based on department & semester
  async getRecommendedBooks(department, semester) {
    const all = await this.getBooks({ status: 'available' });
    return all.filter(b => b.department === department || b.semester === semester).slice(0, 4);
  }
};
