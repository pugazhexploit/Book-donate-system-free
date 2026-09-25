import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { AdminLogin } from './pages/auth/AdminLogin';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { BrowseBooks } from './pages/student/BrowseBooks';
import { BookDetail } from './pages/student/BookDetail';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { DonateBook } from './pages/student/DonateBook';
import { MyDonations } from './pages/student/MyDonations';
import { MyRequests } from './pages/student/MyRequests';
import { StudentProfile } from './pages/student/StudentProfile';
import { NotificationsPage } from './pages/student/NotificationsPage';

// Admin Monitoring Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminBooks } from './pages/admin/AdminBooks';
import { AdminDonations } from './pages/admin/AdminDonations';
import { AdminRequests } from './pages/admin/AdminRequests';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminActivity } from './pages/admin/AdminActivity';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              
              {/* Public Routes with Navbar & Footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/browse" element={<BrowseBooks />} />
                <Route path="/book/:id" element={<BookDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Student Portal (With Sidebar + Mobile Bottom Nav) */}
              <Route element={<StudentLayout />}>
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/donate" element={<DonateBook />} />
                <Route path="/my-donations" element={<MyDonations />} />
                <Route path="/my-requests" element={<MyRequests />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>

              {/* Admin Monitoring Wing (Strictly Read-Only) */}
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<AdminStudents />} />
                <Route path="/admin/books" element={<AdminBooks />} />
                <Route path="/admin/donations" element={<AdminDonations />} />
                <Route path="/admin/requests" element={<AdminRequests />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/activity" element={<AdminActivity />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
