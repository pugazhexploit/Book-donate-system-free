import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { StatCard } from '../../components/dashboard/StatCard';
import {
  User,
  Mail,
  Phone,
  Hash,
  Building2,
  BookOpen,
  GraduationCap,
  Heart,
  CheckCircle2,
  Camera,
  Save,
  CheckCircle
} from 'lucide-react';
import { DEPARTMENTS, SEMESTERS } from '../../utils/constants';

export function StudentProfile() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    department: user?.department || 'B.Sc Computer Science',
    year: user?.year || '2nd Year',
    semester: user?.semester || 'Semester 3',
    avatar_url: user?.avatar_url || '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Profile Header Card (Section 15) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          
          <div className="relative">
            <UserAvatar user={user} size="xl" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {user?.full_name}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {user?.department} • {user?.year} ({user?.semester})
                </p>
              </div>

              <span className="inline-flex self-center sm:self-start items-center gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                Active Student Member
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 max-w-xl">
              {user?.bio || 'Campus student participating in the academic sharing movement.'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5 font-mono">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                {user?.register_number || '21CS104'}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email}
              </span>
              {user?.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {user?.phone}
                </span>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Statistics Section (Section 15) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Your Campus Impact
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Books Donated"
            value={user?.stats?.booksDonated || 8}
            subtitle="Textbooks listed"
            icon={BookOpen}
            color="indigo"
          />
          <StatCard
            title="Students Helped"
            value={user?.stats?.studentsHelped || 6}
            subtitle="Juniors empowered"
            icon={GraduationCap}
            color="emerald"
          />
          <StatCard
            title="Books Received"
            value={user?.stats?.booksReceived || 3}
            subtitle="Academic aid used"
            icon={Heart}
            color="sky"
          />
          <StatCard
            title="Completed"
            value={user?.stats?.completedDonations || 7}
            subtitle="Verified handovers"
            icon={CheckCircle2}
            color="purple"
          />
        </div>
      </div>

      {/* Edit Profile Form (Section 15: "Allow student to edit only their own profile") */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Edit Profile Details
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Update your contact and department info so other students can coordinate with you easily.
        </p>

        {success && (
          <div className="p-3.5 mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 mb-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bio / Academic Interests
              </label>
              <textarea
                name="bio"
                rows={2}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Share your branch, study groups, or what subjects you're focusing on..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

          </div>

          <div className="pt-3 flex justify-end">
            <Button type="submit" variant="primary" loading={loading}>
              <Save className="w-4 h-4 mr-1.5" />
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
}
