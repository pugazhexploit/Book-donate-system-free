import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from './store';

export const requestService = {
  // Create a book request
  async createRequest({ book, requester, message }) {
    // Business Rule Check: Cannot request own book
    if (book.donor_id === requester.id) {
      throw new Error('You cannot request your own book donation.');
    }

    if (isSupabaseConfigured) {
      // Check existing active request
      const { data: existing } = await supabase
        .from('book_requests')
        .select('id, status')
        .eq('book_id', book.id)
        .eq('requester_id', requester.id)
        .in('status', ['pending', 'accepted']);

      if (existing && existing.length > 0) {
        throw new Error('You have already submitted an active request for this book.');
      }

      const { data: newReq, error } = await supabase
        .from('book_requests')
        .insert([{
          book_id: book.id,
          requester_id: requester.id,
          donor_id: book.donor_id,
          message,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Update book status to 'requested'
      await supabase
        .from('books')
        .update({ status: 'requested' })
        .eq('id', book.id);

      // Create notification for donor
      await supabase.from('notifications').insert([{
        user_id: book.donor_id,
        title: 'New Book Request Received',
        message: `${requester.full_name} requested your "${book.title}" book.`,
        type: 'request'
      }]);

      // Activity log
      await supabase.from('activity_logs').insert([{
        user_id: requester.id,
        action: 'REQUEST_BOOK',
        entity_type: 'book_request',
        entity_id: newReq.id,
        description: `${requester.full_name} requested "${book.title}"`
      }]);

      return newReq;
    }

    // Local Mock Store
    const requests = localStore.getRequests();
    const existing = requests.find(r => 
      r.book_id === book.id && 
      r.requester_id === requester.id && 
      (r.status === 'pending' || r.status === 'accepted')
    );

    if (existing) {
      throw new Error('You have already submitted an active request for this book.');
    }

    const newReq = {
      id: 'req-' + Date.now(),
      book_id: book.id,
      book_title: book.title,
      requester_id: requester.id,
      requester_name: requester.full_name,
      requester_department: requester.department,
      requester_year: requester.year || '2nd Year',
      donor_id: book.donor_id,
      donor_name: book.donor_name || 'Donor',
      message: message.trim() || "Hi, I'm interested in this book and would like to collect it from the designated location.",
      status: 'pending',
      handover_location: book.donation_location,
      created_at: new Date().toISOString(),
    };

    requests.unshift(newReq);
    localStore.saveRequests(requests);

    // Update book status
    const books = localStore.getBooks();
    const bIndex = books.findIndex(b => b.id === book.id);
    if (bIndex !== -1) {
      books[bIndex].status = 'requested';
      localStore.saveBooks(books);
    }

    // Add notification to donor
    const notifs = localStore.getNotifications();
    notifs.unshift({
      id: 'notif-' + Date.now(),
      user_id: book.donor_id,
      title: 'New Book Request Received 📖',
      message: `${requester.full_name} requested your "${book.title}" book.`,
      type: 'request',
      is_read: false,
      created_at: new Date().toISOString(),
    });
    localStore.saveNotifications(notifs);

    // Activity log
    localStore.addLog('REQUEST_BOOK', 'book_request', `${requester.full_name} requested "${book.title}"`, requester.full_name, 'blue');

    return newReq;
  },

  // Get requests sent by the student
  async getMySentRequests(requesterId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('book_requests')
        .select(`
          *,
          book:books(*),
          donor:profiles(full_name, department, phone, email)
        `)
        .eq('requester_id', requesterId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }

    const requests = localStore.getRequests();
    const books = localStore.getBooks();
    return requests
      .filter(r => r.requester_id === requesterId)
      .map(r => ({
        ...r,
        book: books.find(b => b.id === r.book_id) || { title: r.book_title, donation_location: r.handover_location }
      }));
  },

  // Get requests received for books donated by the student
  async getRequestsForMyBooks(donorId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('book_requests')
        .select(`
          *,
          book:books(*),
          requester:profiles(full_name, department, year, phone, email, avatar_url)
        `)
        .eq('donor_id', donorId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }

    const requests = localStore.getRequests();
    const books = localStore.getBooks();
    return requests
      .filter(r => r.donor_id === donorId)
      .map(r => ({
        ...r,
        book: books.find(b => b.id === r.book_id) || { title: r.book_title, donation_location: r.handover_location }
      }));
  },

  // Accept a request (Donor only)
  async acceptRequest(requestId, donorUser) {
    if (isSupabaseConfigured) {
      const { data: req, error: reqError } = await supabase
        .from('book_requests')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', requestId)
        .eq('donor_id', donorUser.id)
        .select('*, book:books(*)')
        .single();
      if (reqError) throw reqError;

      // Update book status
      await supabase.from('books').update({ status: 'accepted' }).eq('id', req.book_id);

      // Notify requester
      await supabase.from('notifications').insert([{
        user_id: req.requester_id,
        title: 'Book Request Accepted! 🎉',
        message: `${donorUser.full_name} accepted your request for "${req.book?.title}". Handover location: ${req.book?.donation_location}`,
        type: 'accept'
      }]);

      return req;
    }

    const requests = localStore.getRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index === -1) throw new Error('Request not found');

    const req = requests[index];
    if (req.donor_id !== donorUser.id) {
      throw new Error('Only the donor of this book can accept requests.');
    }

    req.status = 'accepted';
    req.updated_at = new Date().toISOString();
    localStore.saveRequests(requests);

    // Update book status
    const books = localStore.getBooks();
    const bIndex = books.findIndex(b => b.id === req.book_id);
    if (bIndex !== -1) {
      books[bIndex].status = 'accepted';
      localStore.saveBooks(books);
    }

    // Notify requester
    const notifs = localStore.getNotifications();
    notifs.unshift({
      id: 'notif-' + Date.now(),
      user_id: req.requester_id,
      title: 'Your Book Request was Accepted! 🎉',
      message: `${donorUser.full_name} accepted your request for "${req.book_title}". You can coordinate handover at ${req.handover_location || 'the designated spot'}.`,
      type: 'accept',
      is_read: false,
      created_at: new Date().toISOString(),
    });
    localStore.saveNotifications(notifs);

    localStore.addLog('ACCEPT_REQUEST', 'book_request', `${donorUser.full_name} accepted request for "${req.book_title}" from ${req.requester_name}`, donorUser.full_name, 'purple');

    return req;
  },

  // Reject a request (Donor only)
  async rejectRequest(requestId, donorUser) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('book_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId)
        .eq('donor_id', donorUser.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const requests = localStore.getRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index === -1) throw new Error('Request not found');

    const req = requests[index];
    if (req.donor_id !== donorUser.id) {
      throw new Error('Only the donor of this book can reject requests.');
    }

    req.status = 'rejected';
    localStore.saveRequests(requests);

    // If no other accepted/pending request, set book back to available
    const books = localStore.getBooks();
    const remainingPending = requests.some(r => r.book_id === req.book_id && r.id !== req.id && r.status === 'pending');
    const bIndex = books.findIndex(b => b.id === req.book_id);
    if (bIndex !== -1 && !remainingPending) {
      books[bIndex].status = 'available';
      localStore.saveBooks(books);
    }

    return req;
  },

  // Mark Donation Completed (Either donor marks completed or receiver confirms received)
  async markCompleted(requestId, currentUser) {
    if (isSupabaseConfigured) {
      const { data: req, error } = await supabase
        .from('book_requests')
        .update({ status: 'completed' })
        .eq('id', requestId)
        .select('*, book:books(*)')
        .single();
      if (error) throw error;

      await supabase.from('books').update({ status: 'completed' }).eq('id', req.book_id);

      await supabase.from('activity_logs').insert([{
        user_id: currentUser.id,
        action: 'COMPLETE_DONATION',
        entity_type: 'book',
        entity_id: req.book_id,
        description: `Donation completed for "${req.book?.title}"`
      }]);

      return req;
    }

    const requests = localStore.getRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    req.status = 'completed';
    localStore.saveRequests(requests);

    // Update book status to completed so it no longer shows up in available list
    const books = localStore.getBooks();
    const bIndex = books.findIndex(b => b.id === req.book_id);
    if (bIndex !== -1) {
      books[bIndex].status = 'completed';
      localStore.saveBooks(books);
    }

    // Notify both parties
    const notifs = localStore.getNotifications();
    notifs.unshift({
      id: 'notif-' + Date.now(),
      user_id: req.donor_id === currentUser.id ? req.requester_id : req.donor_id,
      title: 'Donation Completed! 🎉',
      message: `The book handover for "${req.book_title}" has been confirmed. Thank you for building a sharing campus!`,
      type: 'complete',
      is_read: false,
      created_at: new Date().toISOString(),
    });
    localStore.saveNotifications(notifs);

    localStore.addLog('COMPLETE_DONATION', 'book', `Handover completed for "${req.book_title}" between ${req.donor_name} and ${req.requester_name}`, currentUser.full_name, 'green');

    return req;
  },

  // Cancel Request (Requester only)
  async cancelRequest(requestId, requesterUser) {
    const requests = localStore.getRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    if (req.requester_id !== requesterUser.id) {
      throw new Error('Only the requester can cancel their request.');
    }

    req.status = 'cancelled';
    localStore.saveRequests(requests);

    // Reset book status if no other active requests
    const books = localStore.getBooks();
    const hasOther = requests.some(r => r.book_id === req.book_id && r.id !== req.id && (r.status === 'pending' || r.status === 'accepted'));
    if (!hasOther) {
      const bIndex = books.findIndex(b => b.id === req.book_id);
      if (bIndex !== -1 && books[bIndex].status !== 'completed') {
        books[bIndex].status = 'available';
        localStore.saveBooks(books);
      }
    }

    return req;
  }
};
