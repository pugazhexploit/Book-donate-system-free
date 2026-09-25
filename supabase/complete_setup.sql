-- ====================================================================
-- CAMPUS BOOK DONATION SYSTEM — COMPLETE ONE-CLICK SQL SETUP
-- Run this entire script in Supabase: Dashboard -> SQL Editor -> New Query
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES (Safe from duplicate creation on re-runs)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE book_condition AS ENUM ('New', 'Like New', 'Good', 'Used', 'Heavily Used');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE book_status AS ENUM ('available', 'requested', 'accepted', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    register_number TEXT,
    department TEXT NOT NULL,
    year TEXT DEFAULT '1st Year',
    semester TEXT DEFAULT 'Semester 1',
    avatar_url TEXT,
    bio TEXT,
    role user_role DEFAULT 'student'::user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. BOOKS TABLE
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    edition TEXT,
    subject TEXT NOT NULL,
    department TEXT NOT NULL,
    semester TEXT NOT NULL,
    condition book_condition DEFAULT 'Good'::book_condition NOT NULL,
    description TEXT,
    donation_location TEXT NOT NULL,
    status book_status DEFAULT 'available'::book_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. BOOK IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.book_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 6. BOOK REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.book_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status request_status DEFAULT 'pending'::request_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 8. ACTIVITY LOGS (For Admin Monitoring Feed)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 9. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_books_department ON public.books(department);
CREATE INDEX IF NOT EXISTS idx_books_donor ON public.books(donor_id);
CREATE INDEX IF NOT EXISTS idx_requests_book ON public.book_requests(book_id);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON public.book_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_requests_donor ON public.book_requests(donor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at DESC);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper to check if caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles read policy" ON public.profiles;
CREATE POLICY "Profiles read policy" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profiles insert policy" ON public.profiles;
CREATE POLICY "Profiles insert policy" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;
CREATE POLICY "Profiles update policy" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Books Policies
DROP POLICY IF EXISTS "Books read policy" ON public.books;
CREATE POLICY "Books read policy" ON public.books FOR SELECT USING (true);

DROP POLICY IF EXISTS "Books insert policy" ON public.books;
CREATE POLICY "Books insert policy" ON public.books FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Books update policy" ON public.books;
CREATE POLICY "Books update policy" ON public.books FOR UPDATE USING (auth.uid() = donor_id OR public.is_admin()) WITH CHECK (auth.uid() = donor_id OR public.is_admin());

-- Book Images Policies
DROP POLICY IF EXISTS "Images read policy" ON public.book_images;
CREATE POLICY "Images read policy" ON public.book_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Images insert policy" ON public.book_images;
CREATE POLICY "Images insert policy" ON public.book_images FOR INSERT WITH CHECK (true);

-- Requests Policies
DROP POLICY IF EXISTS "Requests read policy" ON public.book_requests;
CREATE POLICY "Requests read policy" ON public.book_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Requests insert policy" ON public.book_requests;
CREATE POLICY "Requests insert policy" ON public.book_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Requests update policy" ON public.book_requests;
CREATE POLICY "Requests update policy" ON public.book_requests FOR UPDATE USING (true) WITH CHECK (true);

-- Notifications Policies
DROP POLICY IF EXISTS "Notifs read policy" ON public.notifications;
CREATE POLICY "Notifs read policy" ON public.notifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Notifs insert policy" ON public.notifications;
CREATE POLICY "Notifs insert policy" ON public.notifications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Notifs update policy" ON public.notifications;
CREATE POLICY "Notifs update policy" ON public.notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Activity Logs Policies
DROP POLICY IF EXISTS "Activity read policy" ON public.activity_logs;
CREATE POLICY "Activity read policy" ON public.activity_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Activity insert policy" ON public.activity_logs;
CREATE POLICY "Activity insert policy" ON public.activity_logs FOR INSERT WITH CHECK (true);

-- 11. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('book-images', 'book-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Book images read" ON storage.objects;
CREATE POLICY "Book images read" ON storage.objects FOR SELECT USING (bucket_id = 'book-images');

DROP POLICY IF EXISTS "Book images upload" ON storage.objects;
CREATE POLICY "Book images upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'book-images');

-- 12. SAMPLE CAMPUS DATA SEED
INSERT INTO public.profiles (id, full_name, email, phone, register_number, department, year, semester, avatar_url, bio, role)
VALUES 
('d0000000-0000-0000-0000-000000000001', 'Pugazh Rajan', 'pugazh@college.edu', '+91 98765 43210', '21CS104', 'B.Sc Computer Science', '3rd Year', 'Semester 5', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', 'Computer science student passionate about systems & OSS. Happy to share books with juniors!', 'student'),
('d0000000-0000-0000-0000-000000000002', 'Arun Kumar', 'arun@college.edu', '+91 98765 43211', '22CS018', 'B.Sc Computer Science', '2nd Year', 'Semester 3', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250', '2nd year undergrad exploring algorithms and web tech.', 'student'),
('d0000000-0000-0000-0000-000000000003', 'Priya Dharshini', 'priya@college.edu', '+91 98765 43212', '21IT055', 'B.Sc IT', '3rd Year', 'Semester 5', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250', 'Tech enthusiast who loves donating textbooks every semester.', 'student'),
('d0000000-0000-0000-0000-000000000004', 'Karthik Raja', 'karthik@college.edu', '+91 98765 43213', '20EC090', 'ECE', '4th Year', 'Semester 7', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', 'Final year ECE student giving back to juniors.', 'student'),
('d0000000-0000-0000-0000-000000000005', 'Campus Academic Dean', 'admin@college.edu', '+91 98765 00000', 'STAFF001', 'Academic Monitoring Wing', 'Staff', 'Staff', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250', 'Campus Academic Affairs Coordinator (Read-Only Monitor)', 'admin')
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, role = EXCLUDED.role;

INSERT INTO public.books (id, donor_id, title, author, isbn, edition, subject, department, semester, condition, description, donation_location, status)
VALUES
('b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Database System Concepts', 'Abraham Silberschatz, Henry F. Korth', '978-0078022159', '7th Edition', 'Database Management Systems', 'B.Sc Computer Science', 'Semester 4', 'Good', 'Carefully kept with light pencil annotations in SQL chapters. All pages intact and clean.', 'College Library - 2nd Floor Shelf B', 'available'),
('b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'Java: The Complete Reference', 'Herbert Schildt', '978-1260440232', '11th Edition', 'Java Programming', 'B.Sc Computer Science', 'Semester 3', 'Like New', 'Hardly used, purchased last semester. Perfect condition for anyone studying OOP.', 'Computer Science Department Lobby', 'requested'),
('b0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'Operating System Concepts', 'Abraham Silberschatz, Peter B. Galvin', '978-1119800361', '10th Edition (Dinosaur Book)', 'Operating Systems', 'B.Sc IT', 'Semester 4', 'Good', 'Standard textbook for OS. Includes helpful notes on CPU scheduling and deadlocks.', 'Main Block Ground Floor', 'available'),
('b0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000003', 'Computer Networking: A Top-Down Approach', 'James Kurose, Keith Ross', '978-0133594140', '7th Edition', 'Computer Networks', 'B.Sc IT', 'Semester 5', 'New', 'Brand new copy with CD and practice questions included.', 'College Library', 'available'),
('b0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000004', 'Digital Design: With an Introduction to Verilog HDL', 'M. Morris Mano, Michael D. Ciletti', '978-0132774208', '5th Edition', 'Digital Electronics', 'ECE', 'Semester 3', 'Used', 'A few highlighted sections in logic gates and multiplexers. Binding is strong.', 'ECE Department 1st Floor Lab', 'accepted'),
('b0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000004', 'Python Crash Course', 'Eric Matthes', '978-1593279288', '2nd Edition', 'Python Programming', 'BCA', 'Semester 2', 'Like New', 'Excellent book for beginners learning practical Python programming.', 'Hostel Block A Common Room', 'completed')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.book_images (book_id, image_url)
VALUES
('b0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'),
('b0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600'),
('b0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&q=80&w=600'),
('b0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600'),
('b0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600'),
('b0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.book_requests (id, book_id, requester_id, donor_id, message, status)
VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'Hi Pugazh, I am preparing for Sem 3 OOP lab and would love to study from Herbert Schildt. Can meet at CS dept.', 'pending'),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000004', 'Hello Karthik, I need Digital Design for my electronics core this semester. Thank you!', 'accepted'),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000004', 'Hi Karthik, I want to learn Python scripting for my automation project.', 'completed')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.notifications (user_id, title, message, type, is_read)
VALUES
('d0000000-0000-0000-0000-000000000001', 'New Book Request', 'Arun requested your "Java: The Complete Reference" book.', 'request', false),
('d0000000-0000-0000-0000-000000000002', 'Request Accepted! 🎉', 'Karthik accepted your request for "Digital Design". You can collect it from ECE Department 1st Floor Lab.', 'accept', false),
('d0000000-0000-0000-0000-000000000001', 'Donation Completed', 'Your donation of "Python Crash Course" has been successfully verified.', 'completed', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.activity_logs (user_id, action, entity_type, description, created_at)
VALUES
('d0000000-0000-0000-0000-000000000001', 'DONATE_BOOK', 'book', 'Pugazh donated "Database System Concepts"', NOW() - INTERVAL '3 hours'),
('d0000000-0000-0000-0000-000000000002', 'REQUEST_BOOK', 'book_request', 'Arun requested "Java: The Complete Reference"', NOW() - INTERVAL '2 hours'),
('d0000000-0000-0000-0000-000000000004', 'ACCEPT_REQUEST', 'book_request', 'Karthik accepted request from Arun for "Digital Design"', NOW() - INTERVAL '1 hour'),
('d0000000-0000-0000-0000-000000000003', 'DONATE_BOOK', 'book', 'Priya donated "Operating System Concepts"', NOW() - INTERVAL '45 minutes'),
('d0000000-0000-0000-0000-000000000001', 'COMPLETE_DONATION', 'book', 'Donation for "Python Crash Course" was completed between Karthik and Pugazh', NOW() - INTERVAL '15 minutes')
ON CONFLICT (id) DO NOTHING;

-- Verification query
SELECT 'Database schema, RLS policies, and sample data initialized successfully!' AS result;
