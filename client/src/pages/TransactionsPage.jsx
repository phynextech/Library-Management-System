import React, { useState, useEffect } from 'react';
import {
  ReceiptText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import api from '../services/api';

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'All') queryParams.append('status', statusFilter);
      if (searchTerm) queryParams.append('search', searchTerm);

      const res = await api.get(`/transactions?${queryParams.toString()}`);
      if (res.success) setTransactions(res.transactions);
    } catch (err) {
      console.error('Failed to load ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
            Audit Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            Circulation Transactions Log
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable chronological record of book issues, returns, and accrued late penalties
          </p>
        </div>

        <button
          onClick={fetchTransactions}
          className="p-2 rounded-xl glass-btn-secondary text-slate-300 hover:text-white self-start sm:self-auto"
          title="Refresh Ledger"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions by title, student name, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-20 py-2 text-xs rounded-xl glass-input placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          {['All', 'issued', 'returned', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase font-mono border transition-all ${
                statusFilter === status
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono bg-white/[0.02]">
                <th className="py-3.5 px-4 font-semibold">Volume Title</th>
                <th className="py-3.5 px-4 font-semibold">Scholar</th>
                <th className="py-3.5 px-4 font-semibold">Issue Date</th>
                <th className="py-3.5 px-4 font-semibold">Due Date</th>
                <th className="py-3.5 px-4 font-semibold">Return Date</th>
                <th className="py-3.5 px-4 font-semibold">Circulation Status</th>
                <th className="py-3.5 px-4 font-semibold">Fine Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white max-w-[200px] truncate">
                    {tx.bookTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200">{tx.studentName}</div>
                    <div className="text-[10px] font-mono text-cyan-400">{tx.studentId}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">
                    {new Date(tx.issueDate).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">
                    {new Date(tx.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {tx.returnDate ? (
                      <span className="text-emerald-400">{new Date(tx.returnDate).toLocaleDateString()}</span>
                    ) : (
                      <span className="text-slate-500 italic">In Circulation</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                        tx.status === 'returned'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : tx.status === 'overdue'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {tx.lateFine > 0 ? (
                      <span className={tx.fineStatus === 'paid' ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                        ${tx.lateFine} ({tx.fineStatus})
                      </span>
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div className="py-16 text-center text-xs text-slate-500">
              <ReceiptText size={36} className="mx-auto text-slate-600 mb-2" />
              <span>No transactions recorded.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
