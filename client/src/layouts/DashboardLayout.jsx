import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlassSidebar from '../components/common/GlassSidebar';
import GlassHeader from '../components/common/GlassHeader';
import BackgroundCanvas from '../components/3d/BackgroundCanvas';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, BookOpen, LayoutDashboard, FolderTree, Users, ArrowUpRight, ArrowDownLeft, ReceiptText, BarChart3, Settings, GraduationCap } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [overdueCount, setOverdueCount] = useState(0);
  const location = useLocation();
  const { user, isAdmin, isStudent } = useAuth();

  useEffect(() => {
    // Fetch stats for overdue badge
    const fetchStats = async () => {
      try {
        const res = await api.get('/reports/dashboard');
        if (res.success && res.stats) {
          setOverdueCount(res.stats.overdueBooks || 0);
        }
      } catch (err) {
        // Silently catch
      }
    };
    fetchStats();
  }, [location.pathname]);

  const mobileNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, adminOnly: true },
    { name: 'Student Portal', path: '/student-portal', icon: GraduationCap, studentOnly: true },
    { name: 'Books', path: '/books', icon: BookOpen },
    { name: 'Categories', path: '/categories', icon: FolderTree },
    { name: 'Students', path: '/students', icon: Users, adminOnly: true },
    { name: 'Issue Books', path: '/issue', icon: ArrowUpRight, adminOnly: true },
    { name: 'Return Books', path: '/return', icon: ArrowDownLeft, adminOnly: true },
    { name: 'Transactions', path: '/transactions', icon: ReceiptText },
    { name: 'Reports', path: '/reports', icon: BarChart3, adminOnly: true },
    { name: 'Settings', path: '/settings', icon: Settings },
  ].filter(i => (!i.adminOnly || isAdmin) && (!i.studentOnly || isStudent));

  return (
    <div className="relative min-h-screen flex bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient 3D canvas */}
      <BackgroundCanvas />

      {/* Desktop Glass Sidebar */}
      <GlassSidebar overdueCount={overdueCount} />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 h-full bg-slate-950/90 border-r border-white/10 p-4 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                      <BookOpen size={16} className="text-white" />
                    </div>
                    <span className="font-extrabold font-display shimmer-text">AETHERIA</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 space-y-1">
                  {mobileNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                            isActive
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`
                        }
                      >
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-400">
                Logged in as <span className="text-cyan-300 font-semibold">{user?.name}</span> ({user?.role})
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <GlassHeader onMobileMenuToggle={() => setMobileMenuOpen(true)} overdueCount={overdueCount} />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
