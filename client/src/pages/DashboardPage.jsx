import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  FolderTree,
  Users,
  ArrowUpRight,
  PlusCircle,
  FileText,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import StatCard from '../components/common/StatCard';
import api from '../services/api';

const PIE_COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentBooks, setRecentBooks] = useState([]);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, booksRes] = await Promise.all([
        api.get('/reports/dashboard'),
        api.get('/books')
      ]);

      if (statsRes.success) {
        setData(statsRes);
      }
      if (booksRes.success && booksRes.books) {
        setRecentBooks(booksRes.books.slice(0, 4));
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = data?.stats || {
    totalBooks: 0,
    availableCopies: 0,
    issuedCopies: 0,
    totalStudents: 0,
    overdueBooks: 0,
    totalCategories: 0
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
            Administrative Control Deck
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            Library Intelligence Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/issue"
            className="px-4 py-2 rounded-xl glass-btn-primary text-xs font-semibold flex items-center gap-2 shadow-lg"
          >
            <ArrowUpRight size={15} />
            <span>Issue Book</span>
          </Link>
          <Link
            to="/books?action=new"
            className="px-4 py-2 rounded-xl glass-btn-secondary text-xs font-medium text-slate-200 hover:text-white flex items-center gap-2"
          >
            <PlusCircle size={15} className="text-cyan-400" />
            <span>Add Book</span>
          </Link>
          <Link
            to="/reports"
            className="px-4 py-2 rounded-xl glass-btn-secondary text-xs font-medium text-slate-200 hover:text-white flex items-center gap-2"
          >
            <FileText size={15} className="text-purple-400" />
            <span>Audit Reports</span>
          </Link>
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl glass-btn-secondary text-slate-300 hover:text-white"
            title="Refresh Telemetry"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Overdue Notification Banner if any */}
      {stats.overdueBooks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <ShieldAlert size={20} className="text-rose-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Attention: {stats.overdueBooks} Active Borrow Loans Are Overdue!
              </div>
              <div className="text-xs text-rose-300/90 mt-0.5">
                Students have surpassed scheduled return dates. Automatic fine calculations are actively accumulating.
              </div>
            </div>
          </div>
          <Link
            to="/return"
            className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors shrink-0 text-center shadow-lg"
          >
            Inspect Overdue Queue
          </Link>
        </motion.div>
      )}

      {/* 6 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          subtitle="Physical & Digital volumes"
          icon={BookOpen}
          gradient="from-blue-500/20 to-cyan-500/10"
          borderColor="border-blue-500/30"
          glowColor="rgba(59,130,246,0.3)"
          trend={8.4}
        />
        <StatCard
          title="Available"
          value={stats.availableCopies}
          subtitle="On shelves & ready"
          icon={CheckCircle}
          gradient="from-emerald-500/20 to-teal-500/10"
          borderColor="border-emerald-500/30"
          glowColor="rgba(16,185,129,0.3)"
        />
        <StatCard
          title="Issued"
          value={stats.issuedCopies}
          subtitle="In active circulation"
          icon={ArrowUpRight}
          gradient="from-cyan-500/20 to-blue-500/10"
          borderColor="border-cyan-500/30"
          glowColor="rgba(6,182,212,0.3)"
          trend={12.1}
        />
        <StatCard
          title="Overdue"
          value={stats.overdueBooks}
          subtitle="Action required"
          icon={AlertTriangle}
          gradient="from-rose-500/20 to-red-500/10"
          borderColor="border-rose-500/40"
          glowColor="rgba(244,63,94,0.4)"
        />
        <StatCard
          title="Students"
          value={stats.totalStudents}
          subtitle="Registered scholars"
          icon={Users}
          gradient="from-purple-500/20 to-indigo-500/10"
          borderColor="border-purple-500/30"
          glowColor="rgba(168,85,247,0.3)"
          trend={5.2}
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          subtitle="Knowledge faculties"
          icon={FolderTree}
          gradient="from-amber-500/20 to-orange-500/10"
          borderColor="border-amber-500/30"
          glowColor="rgba(245,158,11,0.3)"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Circulation Area Chart */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Circulation Velocity & Return Trends
              </h2>
              <p className="text-xs text-slate-400">Monthly book checkouts vs completed returns</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-slate-300">Issued</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span className="text-slate-300">Returned</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyTrends || []}>
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="issued"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cyanGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="returned"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#purpleGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Donut Chart */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Category Distribution
            </h2>
            <p className="text-xs text-slate-400">Inventory proportion by discipline</p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.categoryDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {(data?.categoryDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="rgba(0,0,0,0.4)" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Mini Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
            {(data?.categoryDistribution || []).slice(0, 4).map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="text-slate-300 truncate">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overdue Book Notice Queue & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overdue Items Table */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                <AlertTriangle size={18} className="text-rose-400" />
                <span>Overdue Books Registry</span>
              </h2>
              <p className="text-xs text-slate-400">Transactions exceeding return deadlines</p>
            </div>
            <Link to="/return" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
              Manage All
            </Link>
          </div>

          {data?.overdueList && data.overdueList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono">
                    <th className="pb-3 font-semibold">Book Title</th>
                    <th className="pb-3 font-semibold">Borrower</th>
                    <th className="pb-3 font-semibold">Overdue By</th>
                    <th className="pb-3 font-semibold">Accrued Fine</th>
                    <th className="pb-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.overdueList.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-medium text-white max-w-[180px] truncate">
                        {item.bookTitle}
                      </td>
                      <td className="py-3 text-slate-300">
                        <div>{item.studentName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{item.studentId}</div>
                      </td>
                      <td className="py-3 font-mono text-rose-400 font-bold">
                        {item.daysOverdue} days
                      </td>
                      <td className="py-3 font-mono text-amber-400 font-bold">
                        ${item.fine}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to="/return"
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-semibold"
                        >
                          Return Now
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              <CheckCircle size={32} className="mx-auto text-emerald-400/80 mb-2" />
              <span>All circulation records are up to date. Zero overdue books!</span>
            </div>
          )}
        </div>

        {/* Recent Activity Timeline */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Real-Time Activity Stream
              </h2>
              <p className="text-xs text-slate-400">Recent checkouts, returns & logs</p>
            </div>
            <Link to="/transactions" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
              Full Ledger
            </Link>
          </div>

          <div className="space-y-4">
            {(data?.recentActivities || []).map((act, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    act.type === 'return'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : act.type === 'overdue'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                  }`}
                >
                  {act.type === 'return' ? (
                    <CheckCircle size={16} />
                  ) : act.type === 'overdue' ? (
                    <AlertTriangle size={16} />
                  ) : (
                    <ArrowUpRight size={16} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{act.title}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="font-mono">{act.studentId}</span>
                    <span>•</span>
                    <span>{new Date(act.time).toLocaleDateString()}</span>
                  </div>
                </div>

                {act.fine > 0 && (
                  <span className="text-[11px] font-mono text-amber-400 font-semibold">
                    ${act.fine} fine
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Added Books Showcase */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Recently Cataloged Volumes
            </h2>
            <p className="text-xs text-slate-400">Latest additions to the academic index</p>
          </div>
          <Link to="/books" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
            Manage Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentBooks.map((book) => (
            <div
              key={book._id}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all flex gap-3 group"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-16 h-20 object-cover rounded-lg shadow shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{book.author}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-cyan-400">{book.availableCopies} avail</span>
                  <span className="text-slate-500">{book.category.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
