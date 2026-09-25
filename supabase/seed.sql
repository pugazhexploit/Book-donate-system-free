-- ====================================================================
-- SAMPLE SEED DATA FOR TESTING / PRODUCTION DEMO
-- ====================================================================

-- 1. Profiles (Auth users would normally be created via auth.users, but for preview/seed)
INSERT INTO public.profiles (id, full_name, email, phone, register_number, department, year, semester, avatar_url, bio, role)
VALUES 
('d0000000-0000-0000-0000-000000000001', 'Pugazh Rajan', 'pugazh@college.edu', '+91 98765 43210', '21CS104', 'B.Sc Computer Science', '3rd Year', 'Semester 5', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', 'Computer science student passionate about systems & OSS. Happy to share books with juniors!', 'student'),
('d0000000-0000-0000-0000-000000000002', 'Arun Kumar', 'arun@college.edu', '+91 98765 43211', '22CS018', 'B.Sc Computer Science', '2nd Year', 'Semester 3', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250', '2nd year undergrad exploring algorithms and web tech.', 'student'),
('d0000000-0000-0000-0000-000000000003', 'Priya Dharshini', 'priya@college.edu', '+91 98765 43212', '21IT055', 'B.Sc IT', '3rd Year', 'Semester 5', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250', 'Tech enthusiast who loves donating textbooks every semester.', 'student'),
('d0000000-0000-0000-0000-000000000004', 'Karthik Raja', 'karthik@college.edu', '+91 98765 43213', '20EC090', 'ECE', '4th Year', 'Semester 7', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', 'Final year ECE student giving back to juniors.', 'student'),
('d0000000-0000-0000-0000-000000000005', 'Campus Academic Dean', 'admin@college.edu', '+91 98765 00000', 'STAFF001', 'Academic Monitoring Wing', 'Staff', 'Staff', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250', 'Campus Academic Affairs Coordinator (Read-Only Monitor)', 'admin')
ON CONFLICT (id) DO NOTHING;

-- 2. Books
INSERT INTO public.books (id, donor_id, title, author, isbn, edition, subject, department, semester, condition, description, donation_location, status)
VALUES
('b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Database System Concepts', 'Abraham Silberschatz, Henry F. Korth', '978-0078022159', '7th Edition', 'Database Management Systems', 'B.Sc Computer Science', 'Semester 4', 'Good', 'Carefully kept with light pencil annotations in SQL chapters. All pages intact and clean.', 'College Library - 2nd Floor Shelf B', 'available'),
('b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'Java: The Complete Reference', 'Herbert Schildt', '978-1260440232', '11th Edition', 'Java Programming', 'B.Sc Computer Science', 'Semester 3', 'Like New', 'Hardly used, purchased last semester. Perfect condition for anyone studying OOP.', 'Computer Science Department Lobby', 'requested'),
('b0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'Operating System Concepts', 'Abraham Silberschatz, Peter B. Galvin', '978-1119800361', '10th Edition (Dinosaur Book)', 'Operating Systems', 'B.Sc IT', 'Semester 4', 'Good', 'Standard textbook for OS. Includes helpful notes on CPU scheduling and deadlocks.', 'Main Block Ground Floor', 'available'),
('b0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000003', 'Computer Networking: A Top-Down Approach', 'James Kurose, Keith Ross', '978-0133594140', '7th Edition', 'Computer Networks', 'B.Sc IT', 'Semester 5', 'New', 'Brand new copy with CD and practice questions included.', 'College Library', 'available'),
('b0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000004', 'Digital Design: With an Introduction to Verilog HDL', 'M. Morris Mano, Michael D. Ciletti', '978-0132774208', '5th Edition', 'Digital Electronics', 'ECE', 'Semester 3', 'Used', 'A few highlighted sections in logic gates and multiplexers. Binding is strong.', 'ECE Department 1st Floor Lab', 'accepted'),
('b0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000004', 'Python Crash Course', 'Eric Matthes', '978-1593279288', '2nd Edition', 'Python Programming', 'BCA', 'Semester 2', 'Like New', 'Excellent book for beginners learning practical Python programming.', 'Hostel Block A Common Room', 'completed')
ON CONFLICT (id) DO NOTHING;

-- 3. Book Images
INSERT INTO public.book_images (book_id, image_url)
VALUES
('b0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'),
('b0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600'),
('b0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&q=80&w=600'),
('b0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600'),
('b0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600'),
('b0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600')
ON CONFLICT DO NOTHING;

-- 4. Book Requests
INSERT INTO public.book_requests (id, book_id, requester_id, donor_id, message, status)
VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'Hi Pugazh, I am preparing for Sem 3 OOP lab and would love to study from Herbert Schildt. Can meet at CS dept.', 'pending'),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000004', 'Hello Karthik, I need Digital Design for my electronics core this semester. Thank you!', 'accepted'),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000004', 'Hi Karthik, I want to learn Python scripting for my automation project.', 'completed')
ON CONFLICT (id) DO NOTHING;

-- 5. Notifications
INSERT INTO public.notifications (user_id, title, message, type, is_read)
VALUES
('d0000000-0000-0000-0000-000000000001', 'New Book Request', 'Arun requested your "Java: The Complete Reference" book.', 'request', false),
('d0000000-0000-0000-0000-000000000002', 'Request Accepted! 🎉', 'Karthik accepted your request for "Digital Design". You can collect it from ECE Department 1st Floor Lab.', 'accept', false),
('d0000000-0000-0000-0000-000000000001', 'Donation Completed', 'Your donation of "Python Crash Course" has been successfully verified.', 'completed', true);

-- 6. Activity Logs
INSERT INTO public.activity_logs (user_id, action, entity_type, description, created_at)
VALUES
('d0000000-0000-0000-0000-000000000001', 'DONATE_BOOK', 'book', 'Pugazh donated "Database System Concepts"', NOW() - INTERVAL '3 hours'),
('d0000000-0000-0000-0000-000000000002', 'REQUEST_BOOK', 'book_request', 'Arun requested "Java: The Complete Reference"', NOW() - INTERVAL '2 hours'),
('d0000000-0000-0000-0000-000000000004', 'ACCEPT_REQUEST', 'book_request', 'Karthik accepted request from Arun for "Digital Design"', NOW() - INTERVAL '1 hour'),
('d0000000-0000-0000-0000-000000000003', 'DONATE_BOOK', 'book', 'Priya donated "Operating System Concepts"', NOW() - INTERVAL '45 minutes'),
('d0000000-0000-0000-0000-000000000001', 'COMPLETE_DONATION', 'book', 'Donation for "Python Crash Course" was completed between Karthik and Pugazh', NOW() - INTERVAL '15 minutes');
