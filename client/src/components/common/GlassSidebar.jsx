import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  ReceiptText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const GlassSidebar = ({ overdueCount = 0 }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, adminOnly: true },
    { name: 'Student Portal', path: '/student-portal', icon: GraduationCap, studentOnly: true },
    { name: 'Books', path: '/books', icon: BookOpen },
    { name: 'Categories', path: '/categories', icon: FolderTree },
    { name: 'Students', path: '/students', icon: Users, adminOnly: true },
    { name: 'Issue Books', path: '/issue', icon: ArrowUpRight, adminOnly: true },
    { name: 'Return Books', path: '/return', icon: ArrowDownLeft, badge: overdueCount > 0 ? overdueCount : null, badgeColor: 'bg-rose-500/80', adminOnly: true },
    { name: 'Transactions', path: '/transactions', icon: ReceiptText },
    { name: 'Reports', path: '/reports', icon: BarChart3, adminOnly: true },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const filteredNav = navItems.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.studentOnly && !isStudent) return false;
    return true;
  });

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:flex flex-col h-screen sticky top-0 z-40 bg-slate-950/70 backdrop-blur-2xl border-r border-white/10 select-none shadow-[4px_0_30px_rgba(0,0,0,0.5)]"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-white/10">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="whitespace-nowrap"
              >
                <div className="text-base font-extrabold tracking-wider font-display shimmer-text">
                  AETHERIA
                </div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-cyan-400/80">
                  Digital Library
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="whitespace-nowrap flex-1"
                    >
                      {item.name}
                    </motion.span>
                  )}

                  {/* Badge */}
                  {item.badge && !collapsed && (
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-full text-white shadow-sm ${
                        item.badgeColor || 'bg-cyan-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip on collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-slate-100 text-xs rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                      {item.name}
                      {item.badge && ` (${item.badge})`}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-white/10">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name || 'User'}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-500/30 shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 truncate">
                {user?.role || 'Guest'}
              </div>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default GlassSidebar;
