import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Zap,
  Cpu,
  Star,
  Users,
  Compass,
  CheckCircle,
  LogIn,
  UserPlus
} from 'lucide-react';
import HeroBook3D from '../components/3d/HeroBook3D';
import Card3DTilt from '../components/3d/Card3DTilt';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 120,
    activeStudents: 450,
    circulationRate: '98.4%',
    categories: 12
  });
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/books');
        if (res.success && res.books) {
          setFeaturedBooks(res.books.slice(0, 4));
        }
      } catch (err) {
        console.warn('Could not fetch books for landing:', err);
      }
    };
    loadData();
  }, []);

  const handleQuickDemo = async (role) => {
    await demoLogin(role);
    if (role === 'admin') navigate('/dashboard');
    else navigate('/student-portal');
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden">
      {/* Background radial gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Navigation Bar */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.5)]">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold font-display tracking-wider shimmer-text">
              AETHERIA
            </span>
            <span className="block text-[10px] uppercase font-mono tracking-widest text-cyan-400">
              Library System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to={user.role === 'admin' ? '/dashboard' : '/student-portal'}
              className="px-5 py-2.5 rounded-xl glass-btn-primary text-sm font-semibold flex items-center gap-2"
            >
              <span>Launch Portal</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl glass-btn-secondary text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2"
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="hidden sm:flex px-4 py-2 rounded-xl glass-btn-primary text-sm font-semibold items-center gap-2"
              >
                <UserPlus size={15} />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-20 lg:pt-12 lg:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Copy & Actions */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-6 text-center lg:text-left"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span>Next-Generation Knowledge Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.1] tracking-tight text-white">
            BOOK LIBRARY <br />
            <span className="shimmer-text">MANAGEMENT SYSTEM</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Experience the future of digital knowledge management. Featuring VisionOS-inspired Liquid Glass aesthetics, interactive 3D telemetry, real-time inventory synchronization, role-based student portals, and zero-friction circulation tracking.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            <Link
              to="/books"
              className="px-6 py-3.5 rounded-xl glass-btn-primary font-semibold text-sm flex items-center gap-2 group"
            >
              <span>Explore Library</span>
              <Compass size={18} className="group-hover:rotate-45 transition-transform" />
            </Link>

            <button
              onClick={() => handleQuickDemo('admin')}
              className="px-5 py-3.5 rounded-xl glass-btn-secondary text-slate-200 hover:text-white font-medium text-sm flex items-center gap-2"
            >
              <Shield size={16} className="text-purple-400" />
              <span>Demo Admin</span>
            </button>

            <button
              onClick={() => handleQuickDemo('student')}
              className="px-5 py-3.5 rounded-xl glass-btn-secondary text-slate-200 hover:text-white font-medium text-sm flex items-center gap-2"
            >
              <Users size={16} className="text-cyan-400" />
              <span>Demo Student</span>
            </button>
          </div>

          {/* Feature Micro-Badges */}
          <div className="pt-6 grid grid-cols-3 gap-3 border-t border-white/10 max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={15} className="text-cyan-400 shrink-0" />
              <span>Liquid Glass UI</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={15} className="text-cyan-400 shrink-0" />
              <span>3D Hologram Tilt</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle size={15} className="text-cyan-400 shrink-0" />
              <span>Auto Fine Engine</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: 3D Floating Book Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative rounded-3xl glass-panel p-2 shadow-[0_0_50px_rgba(6,182,212,0.15)] border border-white/15">
            <HeroBook3D />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Interactive 3D Holographic Reader</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Live Statistics Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
            <div className="text-3xl lg:text-4xl font-extrabold font-display text-white">12,400+</div>
            <div className="text-xs uppercase font-mono tracking-wider text-cyan-400 mt-1">Total Volumes</div>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
            <div className="text-3xl lg:text-4xl font-extrabold font-display text-white">4,850+</div>
            <div className="text-xs uppercase font-mono tracking-wider text-purple-400 mt-1">Active Scholars</div>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
            <div className="text-3xl lg:text-4xl font-extrabold font-display text-white">99.8%</div>
            <div className="text-xs uppercase font-mono tracking-wider text-emerald-400 mt-1">Uptime & Sync</div>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
            <div className="text-3xl lg:text-4xl font-extrabold font-display text-white">0.02s</div>
            <div className="text-xs uppercase font-mono tracking-wider text-blue-400 mt-1">Query Latency</div>
          </div>
        </div>
      </section>

      {/* Featured Books Section with 3D Tilt Cards */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              Curated Masterpieces
            </div>
            <h2 className="text-3xl font-extrabold font-display text-white mt-1">
              Featured Scientific & Theoretical Volumes
            </h2>
          </div>
          <Link
            to="/books"
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <Card3DTilt key={book._id} className="h-full">
              <div className="h-full glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                    {book.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{book.author}</p>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-2.5 font-light leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-cyan-400 font-mono">
                      {book.availableCopies} / {book.totalCopies} Available
                    </span>
                    <Link
                      to={`/books`}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-[11px] transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </Card3DTilt>
          ))}
        </div>
      </section>

      {/* Liquid Glass Architecture Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            Enterprise Architecture
          </div>
          <h2 className="text-3xl font-extrabold font-display text-white mt-1">
            Engineered For Frictionless Academic Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-2xl border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Real-Time Inventory Mesh</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Every checkout, reservation, and return synchronously adjusts digital counts across admin consoles and student viewports.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <Cpu size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Algorithmic Fine Computation</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Dynamically evaluates elapsed duration past return deadlines, applying daily accruals with transparent payment workflows.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <Shield size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Role-Enforced Portals</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Seamless partition between administrative oversight (catalog, users, audit trails) and student self-service (borrowing, countdowns).
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-semibold text-slate-300">
            <BookOpen size={16} className="text-cyan-400" />
            <span>AETHERIA LIBRARY MANAGEMENT SYSTEM</span>
          </div>
          <div>VisionOS Liquid Glass Theme • React + Vite + Three.js + Express + MongoDB</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
