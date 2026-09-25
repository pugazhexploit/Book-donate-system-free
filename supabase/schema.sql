-- ====================================================================
-- CAMPUS BOOK DONATION SYSTEM — SUPABASE DATABASE SCHEMA & RLS
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE book_condition AS ENUM ('New', 'Like New', 'Good', 'Used', 'Heavily Used');
CREATE TYPE book_status AS ENUM ('available', 'requested', 'accepted', 'completed', 'cancelled');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'cancelled');

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    register_number TEXT UNIQUE,
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT prevent_self_request CHECK (requester_id <> donor_id)
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

-- 8. ACTIVITY LOGS (For Admin Monitoring & Transparency)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 9. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_books_department ON public.books(department);
CREATE INDEX IF NOT EXISTS idx_books_donor ON public.books(donor_id);
CREATE INDEX IF NOT EXISTS idx_requests_book ON public.book_requests(book_id);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON public.book_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_requests_donor ON public.book_requests(donor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10.1 PROFILES POLICIES
-- Students can read all profiles (to see donors and fellow students)
CREATE POLICY "Profiles can be viewed by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Students can insert their own profile on registration
CREATE POLICY "Users can create their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Students can ONLY update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ADMIN: strictly READ ONLY, NO insert/update/delete on profiles
-- (Covered by the SELECT policy above, no insert/update/delete policy granted for admins)

-- 10.2 BOOKS POLICIES
-- Anyone authenticated can view available books (and donors can see their own books, admins can view all)
CREATE POLICY "Books viewable by authenticated users"
ON public.books FOR SELECT
TO authenticated
USING (true);

-- Students can insert their own book donations
CREATE POLICY "Students can donate books"
ON public.books FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = donor_id);

-- Students can update ONLY their own books (e.g. status transition)
CREATE POLICY "Donors can update their own books"
ON public.books FOR UPDATE
TO authenticated
USING (auth.uid() = donor_id)
WITH CHECK (auth.uid() = donor_id);

-- ADMIN: strictly READ ONLY on books

-- 10.3 BOOK IMAGES POLICIES
CREATE POLICY "Book images are viewable by authenticated users"
ON public.book_images FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Donors can upload images for their books"
ON public.book_images FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.books
        WHERE books.id = book_images.book_id AND books.donor_id = auth.uid()
    )
);

-- 10.4 BOOK REQUESTS POLICIES
-- Requesters, donors, and admins can view book requests
CREATE POLICY "Users can view relevant book requests"
ON public.book_requests FOR SELECT
TO authenticated
USING (
    auth.uid() = requester_id OR 
    auth.uid() = donor_id OR 
    public.is_admin()
);

-- Students can create requests (for other students' books only)
CREATE POLICY "Students can request books"
ON public.book_requests FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = requester_id AND 
    auth.uid() <> donor_id
);

-- Both donor (accept/reject/complete) and requester (cancel/complete) can update the request
CREATE POLICY "Parties involved can update request status"
ON public.book_requests FOR UPDATE
TO authenticated
USING (auth.uid() = requester_id OR auth.uid() = donor_id)
WITH CHECK (auth.uid() = requester_id OR auth.uid() = donor_id);

-- ADMIN: strictly READ ONLY on requests

-- 10.5 NOTIFICATIONS POLICIES
CREATE POLICY "Users can read their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 10.6 ACTIVITY LOGS POLICIES
CREATE POLICY "Activity logs viewable by authenticated users"
ON public.activity_logs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Activity logs insertable by system/authenticated users"
ON public.activity_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- 11. SUPABASE STORAGE BUCKETS SETUP
-- Create storage buckets for books and avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('book-images', 'book-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public read for book images"
ON storage.objects FOR SELECT
USING (bucket_id = 'book-images');

CREATE POLICY "Authenticated users can upload book images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'book-images');

CREATE POLICY "Public read for avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');
