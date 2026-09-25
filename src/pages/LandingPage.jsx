import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/books';
import { BookCard } from '../components/books/BookCard';
import { Button } from '../components/ui/Button';
import { ShinyText } from '../components/ui/ShinyText';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { AuroraBackground } from '../components/ui/AuroraBackground';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { motion } from 'framer-motion';
import { GravitationalMeshHero } from '@/components/ui/retrying';
import { TubesCursor } from '@/components/ui/tube-cursor';
import { MousePointerClick } from 'lucide-react';
import {
  BookOpen,
  ArrowRight,
  Heart,
  Users,
  Building2,
  CheckCircle2,
  Sparkles,
  Recycle,
  GraduationCap,
  ShieldCheck,
  Send,
  CheckCircle,
  Clock,
  Compass,
  Zap,
  Layers
} from 'lucide-react';

export function LandingPage() {
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMeshHero, setShowMeshHero] = useState(false);

  useEffect(() => {
    async function loadBooks() {
      try {
        const books = await bookService.getBooks({ status: 'available' });
        setRecentBooks(books.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  const impactStats = [
    { label: 'Students', value: '1,250+', numeric: 1250, icon: Users, desc: 'Registered campus peers' },
    { label: 'Books Donated', value: '2,840+', numeric: 2840, icon: BookOpen, desc: 'Passed to fellow students' },
    { label: 'Students Helped', value: '1,920+', numeric: 1920, icon: GraduationCap, desc: 'Academic terms supported' },
    { label: 'Departments', value: '12', numeric: 12, icon: Building2, desc: 'Across Engineering & Arts' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Donate',
      desc: 'List your past semester syllabus textbooks with condition details and campus pickup spot.',
      icon: BookOpen,
      color: 'emerald'
    },
    {
      num: '02',
      title: 'Student Requests',
      desc: 'A junior or classmate studying the course spots your book and submits a polite free request.',
      icon: Send,
      color: 'teal'
    },
    {
      num: '03',
      title: 'Donor Accepts',
      desc: 'Review the student note, accept the request, and confirm the campus collection spot.',
      icon: CheckCircle2,
      color: 'cyan'
    },
    {
      num: '04',
      title: 'Book Handover',
      desc: 'Meet safely at the library or department lobby, hand over the book, and mark completed.',
      icon: Heart,
      color: 'emerald'
    },
  ];

  const whyDonatePoints = [
    {
      title: 'Reduce Educational Costs',
      desc: 'Textbooks can cost thousands per semester. Free peer sharing keeps academic resources accessible to everyone.',
      icon: Sparkles,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Reuse Academic Resources',
      desc: 'Rather than sitting on dusty shelves after final exams, books continue delivering value term after term.',
      icon: Recycle,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Help Your Juniors',
      desc: 'Pass on books annotated with your insights, highlights, and exam bookmarks to help the next batch excel.',
      icon: GraduationCap,
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/20'
    },
    {
      title: 'Reduce Book Waste',
      desc: 'Campus eco-friendliness starts with circular resources. Extend textbook lifecycles and save paper.',
      icon: Heart,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'Build a Sharing Culture',
      desc: 'Foster collegiality, friendship, and collaborative spirit across departments and year batches.',
      icon: Users,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
    },
  ];

  return (
    <AuroraBackground className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Animated Glow Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-8 shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShinyText className="font-bold">
              100% Free Campus Book Sharing • Zero Selling • Zero Fees
            </ShinyText>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12] max-w-4xl mx-auto"
          >
            Give a Book.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
              Share Knowledge.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Donate your used academic books and help another student learn.
          </motion.p>

          {/* Core Action Buttons with Spring Micro-Interactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/donate">
              <Button variant="donation" size="lg" className="w-full sm:w-auto">
                <BookOpen className="w-5 h-5 mr-1" />
                Donate a Book
              </Button>
            </Link>

            <Link to="/browse">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Browse Books
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowMeshHero(!showMeshHero)}
              className="w-full sm:w-auto border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
            >
              <Layers className="w-4 h-4 mr-1.5 text-emerald-500" />
              {showMeshHero ? 'Standard View' : '3D Mesh View'}
            </Button>
          </motion.div>

          {/* Conditional 3D Gravitational Hero at Top */}
          {showMeshHero && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <GravitationalMeshHero
                headline="Retrying Digital"
                subtitle="“Let’s keep that cinematic backdrop energy, but move the mouse ‘vibe’ for something with a ‘Reteyinh burn’ intensity.”"
              />
            </motion.div>
          )}

          {/* Mission Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 max-w-xl mx-auto"
          >
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 italic">
              “One Student's Old Book Can Be Another Student's New Opportunity.”
            </p>
          </motion.div>

          {/* IMPACT STATISTICS with Spotlight Cards & Animated Counters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto"
          >
            {impactStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <SpotlightCard
                  key={idx}
                  className="p-5 sm:p-6 text-left"
                  spotlightColor="rgba(20, 184, 166, 0.15)"
                >
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 shadow-inner">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    <AnimatedCounter value={stat.numeric} />
                    {stat.value.includes('+') ? '+' : ''}
                  </h3>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {stat.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {stat.desc}
                  </p>
                </SpotlightCard>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">
            How It Works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            No money, no bargaining, no complications. Free sharing between campus students.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <SpotlightCard
                key={idx}
                className="p-6 flex flex-col justify-between"
                spotlightColor="rgba(16, 185, 129, 0.12)"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-slate-300 dark:text-slate-700 font-mono">
                      {step.num}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Free & Verified
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* RECENTLY DONATED BOOKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Fresh On Campus
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Recently Donated Books
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Academic textbooks donated by students across various departments this week.
            </p>
          </div>

          <Link to="/browse">
            <Button variant="secondary" size="sm" className="gap-1.5">
              Explore All Books
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {recentBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center glass-card rounded-3xl">
            <p className="text-sm text-slate-500">Loading recent donations...</p>
          </div>
        )}
      </section>

      {/* 3D GRAVITATIONAL MESH HERO INTERACTIVE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-4 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Three.js Canvas Feature
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Gravitational Mesh Hero
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Move your cursor across the WebGL gravitational mesh to warp and manipulate the 3D vertex field in real time.
            </p>
          </div>
        </div>

        <GravitationalMeshHero
          headline="Retrying Digital"
          subtitle="“Let’s keep that cinematic backdrop energy, but move the mouse ‘vibe’ for something with a ‘Reteyinh burn’ intensity.”"
        />
      </section>

      {/* 3D TUBES CURSOR INTERACTIVE WEBGL SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-4 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5" />
              Interactive Three.js Fluid Tubes
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Tubes Cursor Visualizer
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Move your mouse to control the glowing 3D tubular ribbons. Click anywhere inside the canvas to randomize light colors.
            </p>
          </div>
        </div>

        <TubesCursor
          title="Campus Books"
          subtitle="Tubes Cursor"
          caption="Click to Change - by Rahil Vahora • WebGPU / WebGL"
          initialColors={["#10b981", "#06b6d4", "#8b5cf6"]}
          lightColors={["#34d399", "#38bdf8", "#a855f7", "#ec4899"]}
          lightIntensity={250}
          titleSize="text-4xl sm:text-6xl md:text-7xl"
          subtitleSize="text-2xl sm:text-4xl md:text-5xl"
          captionSize="text-xs sm:text-sm font-semibold tracking-wider text-emerald-300"
          enableRandomizeOnClick={true}
          className="border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]"
        />
      </section>

      {/* WHY DONATE? WITH GLOWING GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-slate-100/90 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 text-slate-900 dark:text-white shadow-xl border border-emerald-500/20 dark:border-emerald-500/30 overflow-hidden">
          
          {/* Subtle Ambient Light Orb */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Community Impact
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white mt-2 tracking-tight">
                Why Donate Your Academic Books?
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                Every semester, thousands of textbooks sit idle. Here is why joining our book donation movement transforms campus life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whyDonatePoints.slice(0, 3).map((item, idx) => {
                const Icon = item.icon;
                return (
                  <SpotlightCard
                    key={idx}
                    className="p-6 bg-white/90 dark:bg-slate-900/70 border-slate-200/90 dark:border-white/10"
                    spotlightColor="rgba(16, 185, 129, 0.15)"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                  </SpotlightCard>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
              {whyDonatePoints.slice(3, 5).map((item, idx) => {
                const Icon = item.icon;
                return (
                  <SpotlightCard
                    key={idx}
                    className="p-6 bg-white/90 dark:bg-slate-900/70 border-slate-200/90 dark:border-white/10"
                    spotlightColor="rgba(16, 185, 129, 0.15)"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                  </SpotlightCard>
                );
              })}
            </div>

            {/* CTA inside */}
            <div className="mt-12 text-center pt-8 border-t border-slate-200/80 dark:border-white/10">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 font-medium">
                Have books from your previous semester? Pass them on today!
              </p>
              <Link to="/donate">
                <Button variant="donation" size="lg" className="shadow-xl">
                  <BookOpen className="w-5 h-5 mr-1" />
                  Donate Your Books Now
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

    </AuroraBackground>
  );
}
