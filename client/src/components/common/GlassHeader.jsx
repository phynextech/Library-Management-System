import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Clock,
  User as UserIcon,
  LogOut,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Menu,
  X,
  RefreshCw,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const GlassHeader = ({ onMobileMenuToggle, overdueCount = 0 }) => {
  const { user, logout, demoLogin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRoleToggle = async () => {
    if (isAdmin) {
      await demoLogin('student');
      navigate('/student-portal');
    } else {
      await demoLogin('admin');
      navigate('/dashboard');
    }
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="sticky top-0 z-30 h-20 px-4 md:px-8 bg-slate-950/60 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
        >
          <Menu size={20} />
        </button>

        {/* Global Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search books, authors, ISBN, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2 text-sm rounded-xl glass-input placeholder:text-slate-500 font-sans"
          />
          <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded">
            ↵ Enter
          </kbd>
        </form>
      </div>

      {/* Right: Date/Time, Quick Role Switcher, Notifications, Profile */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        {/* Date & Time display */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 font-mono">
          <Clock size={14} className="text-cyan-400" />
          <span>{formattedDate}</span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-300 font-semibold">{formattedTime}</span>
        </div>

        {/* Demo Role Switcher Button */}
        <button
          onClick={handleRoleToggle}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-sm transition-all"
          title="Instantly switch between Admin and Student demo perspective"
        >
          <RefreshCw size={13} className="animate-spin-slow" />
          <span>Switch to {isAdmin ? 'Student' : 'Admin'}</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <Bell size={18} />
            {overdueCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                {overdueCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel p-4 shadow-2xl z-50">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell size={16} className="text-cyan-400" />
                  <span>Library Notifications</span>
                </div>
                <span className="text-[11px] text-cyan-400 font-mono">Real-time</span>
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {overdueCount > 0 && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-3 text-xs">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-rose-300">Overdue Books Warning</div>
                      <div className="text-slate-300 text-[11px] mt-0.5">
                        There are {overdueCount} books past their return due date requiring attention.
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex gap-3 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-cyan-300">System Telemetry Operational</div>
                    <div className="text-slate-300 text-[11px] mt-0.5">
                      All catalog nodes, fine calculations, and borrowing engines active.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex gap-3 text-xs">
                  <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-purple-300">New Arrivals Cataloged</div>
                    <div className="text-slate-300 text-[11px] mt-0.5">
                      8 cutting-edge scientific texts available in physical & holographic format.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-400/40"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">{user?.name?.split(' ')[0] || 'User'}</div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-cyan-400">{user?.role || 'User'}</div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-panel p-2 shadow-2xl z-50">
              <div className="p-3 border-b border-white/10">
                <div className="text-xs font-bold text-white truncate">{user?.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                <div className="mt-1 inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {user?.role}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <UserIcon size={14} />
                  <span>Profile Settings</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default GlassHeader;
