# 📚 Campus Book Donation System

> **“One Student's Old Book Can Be Another Student's New Opportunity.”**

A modern, responsive web application for college campuses enabling students to donate their used academic textbooks for free to fellow peers.

---

## 🌟 Key Principles & Features

* **100% Free Campus Platform:** Zero selling, zero pricing, and zero commercial marketplace fees.
* **Two Clearly Separated Roles:**
  1. **👨‍🎓 Student Role (Full Platform):**
     - Register & Authenticate with college credentials
     - List textbooks with details, syllabus classification, condition, and safe campus pickup locations
     - Upload multiple book photos
     - Search & multi-facet filter (Department, Semester, Subject, Condition, Author)
     - Submit book requests with custom notes to seniors
     - Donors accept/reject requests
     - Track active and historical requests
     - Two-way handover confirmation (**Mark as Completed** / **Confirm Received**)
     - Personal profile with academic impact statistics
     - Real-time notifications
  2. **👨‍💼 Admin / Staff Role (Strictly Monitoring Only):**
     - Campus Book Donation Monitoring Overview (1,250+ students, 2,840+ books, 1,920+ completed)
     - Student Directory oversight (view only)
     - Book Inventory tracker (view only)
     - Donation records & Handover audits (view only)
     - Request Tracker (view only)
     - Live Activity Audit Feed with immutable logs
     - Deep visual Analytics powered by **Recharts**:
       - Donations Over Time (Line chart)
       - Books by Department (Bar chart)
       - Donation Status breakdown (Donut chart)
       - Most Donated Subjects (Horizontal Bar chart)
       - Department Participation (Comparative multi-bar chart)
     - **Strict Security Guarantee:** Admins cannot add, edit, approve, or delete student, book, or request records.

---

## 🛠️ Technology Stack

* **Frontend:** React 18, Vite, React Router v7
* **Styling & UI:** Tailwind CSS, Lucide React Icons
* **Data Visualization:** Recharts
* **Backend & Database:** Supabase (PostgreSQL, Supabase Auth, Supabase Storage, Row-Level Security RLS)
* **Resilience:** Includes rich offline / demo simulation with sample data seed, so the application runs immediately without configuration hurdles, and connects to Supabase as soon as credentials are provided.

---

## 🚀 Quick Start

### 1. Install & Run Dev Server

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Visit the app at `http://localhost:5173`.

### 2. Quick Demo Switcher

The app includes an **Interactive Demo Switcher** bar at the very top of the screen:
* **Pugazh (Senior Student / Donor):** Pre-loaded with 8 donations, incoming student requests ready for acceptance or completion.
* **Arun (Junior Student / Requester):** Pre-loaded with active book requests, ready to track or confirm receipt.
* **Campus Dean (Admin / Staff):** Live read-only monitoring dashboard with charts and activity logs.

---

* **Desktop:** Clean sidebar with department navigation, stats cards, and interactive filters.
* **Mobile:** Bottom navigation bar matching exact specifications:
  - *Student:* Home, Browse, Donate, Requests, Profile
  - *Admin:* Dashboard, Students, Books, Activity, Analytics
