import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ArrowUpRight,
  ArrowDownLeft,
  BookOpen,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Receipt,
  Search,
  DollarSign
} from 'lucide-react';
import api from '../services/api';

export const IssueReturnPage = ({ defaultTab = 'issue' }) => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(defaultTab); // 'issue' or 'return'
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTransactions, setActiveTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Issue Form State
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [dueDateDays, setDueDateDays] = useState(14);
  const [issueNotes, setIssueNotes] = useState('');
  const [issueMessage, setIssueMessage] = useState(null);
  const [submittingIssue, setSubmittingIssue] = useState(false);

  // Return State
  const [returnFilter, setReturnFilter] = useState('all'); // 'all', 'overdue'
  const [returnSearch, setReturnSearch] = useState('');
  const [returnMessage, setReturnMessage] = useState(null);
  const [processingReturnId, setProcessingReturnId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [booksRes, studentsRes, txRes] = await Promise.all([
        api.get('/books'),
        api.get('/students'),
        api.get('/transactions')
      ]);

      if (booksRes.success) setBooks(booksRes.books);
      if (studentsRes.success) setStudents(studentsRes.students);
      if (txRes.success) {
        // filter active transactions (issued or overdue)
        const active = txRes.transactions.filter(t => t.status === 'issued' || t.status === 'overdue');
        setActiveTransactions(active);
      }
    } catch (err) {
      console.error('Failed to load circulation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookId || !selectedStudentId) return;

    setSubmittingIssue(true);
    setIssueMessage(null);

    try {
      const targetDueDate = new Date(Date.now() + dueDateDays * 24 * 60 * 60 * 1000);
      const res = await api.post('/transactions/issue', {
        bookId: selectedBookId,
        studentId: selectedStudentId,
        dueDate: targetDueDate,
        notes: issueNotes
      });

      if (res.success) {
        setIssueMessage({
          type: 'success',
          text: `Volume "${res.transaction.bookTitle}" successfully checked out to ${res.transaction.studentName}. Due on ${new Date(targetDueDate).toLocaleDateString()}.`
        });
        triggerConfetti();
        setSelectedBookId('');
        setSelectedStudentId('');
        setIssueNotes('');
        loadData();
      }
    } catch (err) {
      setIssueMessage({ type: 'error', text: err.message || 'Issue failed' });
    } finally {
      setSubmittingIssue(false);
    }
  };

  const handleReturnSubmit = async (transactionId, finePaid = true) => {
    setProcessingReturnId(transactionId);
    setReturnMessage(null);

    try {
      const res = await api.post('/transactions/return', {
        transactionId,
        finePaid
      });

      if (res.success) {
        setReturnMessage({
          type: 'success',
          text: res.message
        });
        triggerConfetti();
        loadData();
      }
    } catch (err) {
      setReturnMessage({ type: 'error', text: err.message || 'Return failed' });
    } finally {
      setProcessingReturnId(null);
    }
  };

  const filteredReturnList = activeTransactions.filter(tx => {
    if (returnFilter === 'overdue' && tx.status !== 'overdue') return false;
    if (returnSearch) {
      const q = returnSearch.toLowerCase();
      return (
        tx.bookTitle.toLowerCase().includes(q) ||
        tx.studentName.toLowerCase().includes(q) ||
        tx.studentId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
            Circulation Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            Book Checkout & Return Terminal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time loan issuance, duration tracking, and automatic fine settlement
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl glass-panel border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('issue')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'issue'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight size={14} />
            <span>Issue Book</span>
          </button>
          <button
            onClick={() => setActiveTab('return')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'return'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft size={14} />
            <span>Return Books ({activeTransactions.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ISSUE WORKFLOW */}
      {activeTab === 'issue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Issue Form */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-base font-bold text-white font-display mb-1 flex items-center gap-2">
              <ArrowUpRight className="text-cyan-400" size={18} />
              <span>Checkout Authorization Form</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Select scholar and available publication volume. Quantities decrement automatically.
            </p>

            {issueMessage && (
              <div
                className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                  issueMessage.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}
              >
                {issueMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                <span>{issueMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleIssueSubmit} className="space-y-4">
              {/* Select Student */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  1. Select Scholar *
                </label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input bg-slate-900 text-slate-200"
                >
                  <option value="">-- Choose registered student --</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.studentId}) — {s.department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Book */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  2. Select Available Book *
                </label>
                <select
                  required
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input bg-slate-900 text-slate-200"
                >
                  <option value="">-- Choose volume from catalog --</option>
                  {books.map((b) => (
                    <option
                      key={b._id}
                      value={b._id}
                      disabled={b.availableCopies <= 0}
                    >
                      {b.title} — {b.availableCopies > 0 ? `(${b.availableCopies} available)` : '(Out of Stock)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Loan Duration Presets */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  3. Borrow Duration (Due Date)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { days: 7, label: '7 Days (Short Term)' },
                    { days: 14, label: '14 Days (Standard)' },
                    { days: 30, label: '30 Days (Semester)' },
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => setDueDateDays(preset.days)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                        dueDateDays === preset.days
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  4. Circulation Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={issueNotes}
                  onChange={(e) => setIssueNotes(e.target.value)}
                  placeholder="e.g., Course module reference, dissertation research..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingIssue || !selectedBookId || !selectedStudentId}
                className="w-full py-3 rounded-xl glass-btn-primary font-bold text-xs text-white flex items-center justify-center gap-2 mt-4 shadow-lg disabled:opacity-50"
              >
                <span>{submittingIssue ? 'Processing Checkout...' : 'Authorize Book Issue'}</span>
                <ArrowUpRight size={16} />
              </button>
            </form>
          </div>

          {/* Book Preview Side Panel */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-display mb-1">
                Volume Selected for Checkout
              </h3>
              <p className="text-xs text-slate-400 mb-4">Real-time availability status</p>

              {selectedBookId ? (
                (() => {
                  const b = books.find(book => book._id === selectedBookId);
                  if (!b) return null;
                  return (
                    <div className="space-y-4">
                      <div className="h-48 rounded-xl overflow-hidden relative shadow-lg">
                        <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200">
                            {b.category}
                          </span>
                          <div className="text-sm font-bold text-white mt-1 truncate">{b.title}</div>
                          <div className="text-xs text-slate-300 truncate">{b.author}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white/[0.02] p-3 rounded-xl border border-white/5">
                        <div>
                          <span className="text-slate-400 text-[10px]">ISBN:</span>
                          <div className="text-white text-[11px] truncate">{b.isbn}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">Location:</span>
                          <div className="text-white text-[11px] truncate">{b.shelfLocation}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">Stock Status:</span>
                          <div className="text-emerald-400 font-bold">{b.availableCopies} available</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">Return Due:</span>
                          <div className="text-cyan-300 font-bold">
                            {new Date(Date.now() + dueDateDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="py-16 text-center text-xs text-slate-500 border border-dashed border-white/10 rounded-xl">
                  <BookOpen size={36} className="mx-auto text-slate-600 mb-2" />
                  <span>Choose a book from the form to view real-time inventory telemetry</span>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center gap-2 mt-4">
              <Sparkles size={16} className="shrink-0" />
              <span>Due date alarms trigger 24h prior to return cutoff.</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RETURN WORKFLOW */}
      {activeTab === 'return' && (
        <div className="space-y-4">
          {returnMessage && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                returnMessage.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}
            >
              {returnMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{returnMessage.text}</span>
            </div>
          )}

          {/* Search & Filter */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search active loans by title, student name, ID..."
                value={returnSearch}
                onChange={(e) => setReturnSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setReturnFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  returnFilter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-white/5 text-slate-400 border-white/10'
                }`}
              >
                All Loans ({activeTransactions.length})
              </button>
              <button
                onClick={() => setReturnFilter('overdue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  returnFilter === 'overdue'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-white/5 text-slate-400 border-white/10'
                }`}
              >
                Overdue Only ({activeTransactions.filter(t => t.status === 'overdue').length})
              </button>
            </div>
          </div>

          {/* Active Loans Table */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono bg-white/[0.02]">
                    <th className="py-3.5 px-4 font-semibold">Publication</th>
                    <th className="py-3.5 px-4 font-semibold">Scholar</th>
                    <th className="py-3.5 px-4 font-semibold">Issue Date</th>
                    <th className="py-3.5 px-4 font-semibold">Due Date</th>
                    <th className="py-3.5 px-4 font-semibold">Status / Fine</th>
                    <th className="py-3.5 px-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredReturnList.map((tx) => {
                    const isOverdue = tx.status === 'overdue';
                    return (
                      <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs">{tx.bookTitle}</div>
                          {tx.notes && <div className="text-[10px] text-slate-400 italic">"{tx.notes}"</div>}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-200">{tx.studentName}</div>
                          <div className="text-[10px] font-mono text-cyan-400">{tx.studentId}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-mono">
                          {new Date(tx.issueDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span className={isOverdue ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {new Date(tx.dueDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                                isOverdue
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                              }`}
                            >
                              {tx.status}
                            </span>
                            {tx.lateFine > 0 && (
                              <span className="text-[11px] font-mono text-amber-400 font-bold">
                                ${tx.lateFine}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleReturnSubmit(tx._id, true)}
                            disabled={processingReturnId === tx._id}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                              isOverdue
                                ? 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white'
                                : 'glass-btn-primary text-white'
                            }`}
                          >
                            {processingReturnId === tx._id ? 'Processing...' : isOverdue ? 'Collect & Clear Fine' : 'Process Return'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredReturnList.length === 0 && (
                <div className="py-16 text-center text-xs text-slate-500">
                  <CheckCircle2 size={36} className="mx-auto text-emerald-400/80 mb-2" />
                  <span>No active transactions matching current filter criteria.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueReturnPage;
