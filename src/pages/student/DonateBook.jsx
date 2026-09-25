import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { bookService } from '../../services/books';
import { Button } from '../../components/ui/Button';
import {
  BookOpen,
  Upload,
  X,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DEPARTMENTS, SEMESTERS, SUBJECTS, CONDITIONS, LOCATIONS } from '../../utils/constants';

export function DonateBook() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    edition: '',
    subject: SUBJECTS[0],
    department: user?.department || DEPARTMENTS[0],
    semester: user?.semester || SEMESTERS[0],
    condition: 'Good',
    description: '',
    donation_location: LOCATIONS[0],
  });

  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > 4) {
      setError('You can upload a maximum of 4 images per book.');
      return;
    }

    setUploadingImage(true);
    setError('');
    try {
      for (const file of files) {
        const previewUrl = await bookService.uploadBookImage(file);
        setImages(prev => [...prev, previewUrl]);
      }
    } catch (err) {
      setError(err.message || 'Image processing failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Please provide book title and author.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await bookService.donateBook({
        ...formData,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600']
      }, user);

      setSuccess(true);
      setTimeout(() => {
        navigate('/my-donations');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit book donation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Donate an Academic Book
          </h1>
          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full">
            100% Free
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Share your syllabus textbooks with juniors. Make quality learning accessible for everyone.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span><strong>Donation submitted successfully 🎉</strong> Redirecting to your donations list...</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Section 1: Book Information */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Book Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Book Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Database System Concepts"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Author(s) *
              </label>
              <input
                type="text"
                name="author"
                required
                placeholder="e.g. Abraham Silberschatz, Henry F. Korth"
                value={formData.author}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ISBN <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="isbn"
                placeholder="e.g. 978-0078022159"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Edition
              </label>
              <input
                type="text"
                name="edition"
                placeholder="e.g. 7th Edition"
                value={formData.edition}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department *
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester *
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
        </div>

        {/* Section 2: Book Condition (Section 7) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Book Condition *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CONDITIONS.map((cond) => (
              <label
                key={cond.label}
                className={`p-3 rounded-xl border cursor-pointer text-center transition flex flex-col items-center justify-center ${
                  formData.condition === cond.label
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="condition"
                  value={cond.label}
                  checked={formData.condition === cond.label}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-xs">{cond.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 3: Description (Section 7) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Condition Description & Notes
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the condition of your book, including notes, highlighting, missing pages, etc."
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Section 4: Book Images Upload (Section 7 & 25) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Book Photos <span className="text-slate-400 font-normal">(Up to 4 images, JPG/PNG under 5MB)</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {images.map((img, i) => (
              <div key={i} className="relative h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                <img src={img} alt={`upload-${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 p-1 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full text-xs transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {images.length < 4 && (
              <label className="h-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center cursor-pointer transition p-2 text-center">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Upload Photo</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  multiple
                  onChange={handleImageSelect}
                  className="sr-only"
                  disabled={uploadingImage}
                />
              </label>
            )}
          </div>
        </div>

        {/* Section 5: Donation Location (Section 7) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            Campus Handover Location *
          </label>
          <select
            name="donation_location"
            value={formData.donation_location}
            onChange={handleChange}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <p className="text-[11px] text-slate-400 mt-1">
            Safe, verified campus spots to exchange books without traveling off-campus.
          </p>
        </div>

        {/* Submit Button (Section 7) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            100% Free Campus Donation
          </div>

          <Button type="submit" variant="donation" size="lg" loading={submitting}>
            Donate Book
          </Button>
        </div>

      </form>

    </div>
  );
}
