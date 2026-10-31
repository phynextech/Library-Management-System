import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Lock,
  Mail,
  User,
  Building,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BackgroundCanvas from '../components/3d/BackgroundCanvas';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: 'Artificial Intelligence & Robotics',
    phone: '',
    studentId: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      department: formData.department,
      phone: formData.phone,
      studentId: formData.studentId
    });
    setSubmitting(false);

    if (result.success) {
      if (formData.role === 'admin') navigate('/dashboard');
      else navigate('/student-portal');
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#030712] overflow-hidden py-12">
      <BackgroundCanvas />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)]">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black font-display tracking-wider shimmer-text block">
                AETHERIA
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 block -mt-1">
                Account Enrollment
              </span>
            </div>
          </Link>
          <h2 className="text-xl font-bold text-white mt-4 font-display">Create Scholar Profile</h2>
          <p className="text-xs text-slate-400 mt-1">Join the digital library network</p>
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
            {/* Role Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                Account Classification
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                    formData.role === 'student'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <GraduationCap size={15} />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                    formData.role === 'admin'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <Shield size={15} />
                  <span>Administrator</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Dr. Jordan Hayes"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jordan@campus.edu"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 019-2831"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                Department / Discipline
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Quantum Information Science"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl glass-btn-primary font-bold text-sm text-white flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50"
            >
              <span>{submitting ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-400">
            Already have credentials?{' '}
            <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
