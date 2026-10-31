import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Send,
  RefreshCw
} from 'lucide-react';
import Card3DTilt from '../components/3d/Card3DTilt';
import Modal from '../components/common/Modal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const StudentPortalPage = () => {
  const { user } = useAuth();
  const [activeLoans, setActiveLoans] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [requestMsg, setRequestMsg] = useState('');
  const [submittingBorrow, setSubmittingBorrow] = useState(false);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const [txRes, booksRes] = await Promise.all([
        api.get('/transactions/my'),
        api.get('/books')
      ]);

      if (txRes.success && txRes.transactions) {
        const active = txRes.transactions.filter(t => t.status === 'issued' || t.status === 'overdue');
        const history = txRes.transactions.filter(t => t.status === 'returned');
        setActiveLoans(active);
        setBorrowHistory(history);
      }

      if (booksRes.success && booksRes.books) {
        setCatalog(booksRes.books);
      }
    } catch (err) {
      console.error('Failed to load student portal telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({ particleCount: 70, spread: 55, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleBorrowRequest = async (book) => {
    setSubmittingBorrow(true);
    setRequestMsg('');
    try {
      const defaultDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      const res = await api.post('/transactions/issue', {
        bookId: book._id,
        studentId: user?._id || user?.id,
        dueDate: defaultDueDate,
        notes: 'Self-borrowed via Student Portal'
      });

      if (res.success) {
        triggerConfetti();
        setRequestMsg(`Success! Volume "${book.title}" added to your borrowed collection.`);
        setSelectedBook(null);
        fetchStudentData();
      }
    } catch (err) {
      setRequestMsg(err.message || 'Borrow request declined');
    } finally {
      setSubmittingBorrow(false);
    }
  };

  const handleReturnSelf = async (txId) => {
    try {
      const res = await api.post('/transactions/return', {
        transactionId: txId,
        finePaid: true
      });
      if (res.success) {
        triggerConfetti();
        fetchStudentData();
      }
    } catch (err) {
      alert(err.message || 'Return failed');
    }
  };

  const filteredCatalog = catalog.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/20 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase tracking-wider font-bold">
                  Scholar Workspace
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{user?.studentId || 'ID: STU-2026'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 font-display">
                Welcome back, {user?.name || 'Scholar'}
              </h1>
              <p className="text-xs text-slate-300">{user?.department || 'Department of Applied Sciences'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <div className="text-lg font-bold text-white font-mono">{activeLoans.length} / 5</div>
              <div className="text-[10px] uppercase font-mono text-cyan-400">Active Loans</div>
            </div>
            <button
              onClick={fetchStudentData}
              className="p-2.5 rounded-xl glass-btn-secondary text-slate-300 hover:text-white"
              title="Sync Portal"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {requestMsg && (
        <div className="p-4 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" />
            <span>{requestMsg}</span>
          </div>
          <button onClick={() => setRequestMsg('')} className="text-slate-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* SECTION 1: MY BORROWED BOOKS (WITH COUNTDOWN/OVERDUE STATUS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <BookOpen size={18} className="text-cyan-400" />
              <span>My Currently Borrowed Volumes</span>
            </h2>
            <p className="text-xs text-slate-400">Books currently in your possession and their due dates</p>
          </div>
        </div>

        {activeLoans.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center border border-white/10">
            <BookOpen size={36} className="mx-auto text-slate-600 mb-2" />
            <div className="text-sm font-semibold text-white">No Active Loans</div>
            <p className="text-xs text-slate-400 mt-1">
              Browse the catalog below to check out scientific volumes and research papers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeLoans.map((loan) => {
              const isOverdue = loan.status === 'overdue' || new Date() > new Date(loan.dueDate);
              const dueDate = new Date(loan.dueDate);
              const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={loan._id}
                  className={`p-5 rounded-2xl glass-card border flex flex-col justify-between ${
                    isOverdue ? 'border-rose-500/40 bg-rose-500/[0.04]' : 'border-cyan-500/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          isOverdue
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {isOverdue ? 'Overdue' : 'Active Loan'}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {isOverdue ? (
                          <span className="text-rose-400 font-bold">{Math.abs(daysLeft)} days late</span>
                        ) : (
                          <span className="text-emerald-400 font-bold">{daysLeft} days remaining</span>
                        )}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-1">{loan.bookTitle}</h3>
                    <div className="text-[11px] text-slate-400 mt-1 space-y-0.5 font-mono">
                      <div>Issued: {new Date(loan.issueDate).toLocaleDateString()}</div>
                      <div>Due Date: {dueDate.toLocaleDateString()}</div>
                    </div>

                    {isOverdue && loan.lateFine > 0 && (
                      <div className="mt-2.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center justify-between">
                        <span>Accrued Penalty:</span>
                        <span className="font-mono font-bold">${loan.lateFine}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Standard Desk Return</span>
                    <button
                      onClick={() => handleReturnSelf(loan._id)}
                      className="px-3 py-1.5 rounded-xl glass-btn-primary text-xs font-semibold"
                    >
                      Return Volume
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: CATALOG EXPLORER & INSTANT BORROW */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              Explore & Check Out Catalog Volumes
            </h2>
            <p className="text-xs text-slate-400">Select any available publication to borrow immediately</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCatalog.map((book) => {
            const isAvail = book.availableCopies > 0;
            const isAlreadyBorrowed = activeLoans.some(
              l => l.bookTitle === book.title || l.book === book._id
            );

            return (
              <Card3DTilt key={book._id} className="h-full">
                <div className="h-full glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
                      {book.category.split(' ')[0]}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{book.author}</p>
                      <p className="text-[11px] text-slate-300 line-clamp-2 mt-2 font-light">
                        {book.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400">
                        {book.availableCopies} available
                      </span>

                      {isAlreadyBorrowed ? (
                        <span className="text-[10px] font-semibold text-purple-400">Already in Possession</span>
                      ) : (
                        <button
                          onClick={() => handleBorrowRequest(book)}
                          disabled={!isAvail || submittingBorrow}
                          className="px-3 py-1.5 rounded-lg glass-btn-primary text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
                        >
                          <Send size={12} />
                          <span>Borrow</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card3DTilt>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: BORROW HISTORY */}
      {borrowHistory.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider font-mono text-slate-300">
            Past Completed Loans
          </h3>
          <div className="glass-panel rounded-2xl border border-white/10 p-4">
            <div className="space-y-2">
              {borrowHistory.map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{tx.bookTitle}</div>
                    <div className="text-[11px] text-slate-400">
                      Borrowed: {new Date(tx.issueDate).toLocaleDateString()} • Returned: {new Date(tx.returnDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Returned
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortalPage;
