import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  GraduationCap,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BackgroundCanvas from '../components/3d/BackgroundCanvas';
import Modal from '../components/common/Modal';
import api from '../services/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      const savedUser = JSON.parse(localStorage.getItem('aetheria_user') || '{}');
      if (savedUser.role === 'admin') navigate('/dashboard');
      else navigate('/student-portal');
    } else {
      setError(result.message || 'Invalid email or password');
    }
  };

  const handleDemo = async (role) => {
    setError('');
    setSubmitting(true);
    const result = await demoLogin(role);
    setSubmitting(false);

    if (result.success) {
      if (role === 'admin') navigate('/dashboard');
      else navigate('/student-portal');
    } else {
      setError(result.message || 'Demo login failed');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotMsg('Password reset instructions dispatched to your inbox (simulated).');
    } catch (err) {
      setForgotMsg('Failed to process request.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#030712] overflow-hidden">
      <BackgroundCanvas />

      {/* Radiant Glow Orb */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)]">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black font-display tracking-wider shimmer-text block">
                AETHERIA
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 block -mt-1">
                Security Gateway
              </span>
            </div>
          </Link>
          <h2 className="text-xl font-bold text-white mt-4 font-display">Sign In to Your Workspace</h2>
          <p className="text-xs text-slate-400 mt-1">Access unified catalog & circulation systems</p>
        </div>

        {/* Liquid Glass Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl backdrop-blur-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@library.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 font-mono uppercase">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(true);
                    setForgotMsg('');
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl glass-input placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl glass-btn-primary font-bold text-sm text-white flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick 1-Click Demo Logins */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="text-[11px] uppercase font-mono tracking-widest text-slate-400 text-center mb-3">
              1-Click Demo Accounts
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemo('admin')}
                className="py-2.5 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Shield size={14} className="text-purple-400" />
                <span>Admin Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('student')}
                className="py-2.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <GraduationCap size={14} className="text-cyan-400" />
                <span>Student Portal</span>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Access Credentials"
      >
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Enter your registered university or institutional email to receive a recovery token.
          </p>
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="user@campus.edu"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>
          {forgotMsg && (
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
              {forgotMsg}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="px-4 py-2 rounded-xl glass-btn-secondary text-xs"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl glass-btn-primary text-xs font-semibold"
            >
              Send Recovery Link
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LoginPage;
