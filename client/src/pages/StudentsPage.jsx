import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building,
  GraduationCap,
  BookOpen,
  AlertCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Receipt
} from 'lucide-react';
import Modal from '../components/common/Modal';
import api from '../services/api';

export const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Artificial Intelligence & Robotics',
    phone: '',
    studentId: '',
    password: 'student123'
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (departmentFilter !== 'All') queryParams.append('department', departmentFilter);

      const res = await api.get(`/students?${queryParams.toString()}`);
      if (res.success) setStudents(res.students);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [departmentFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      department: 'Artificial Intelligence & Robotics',
      phone: '',
      studentId: `STU-2026-${Math.floor(100 + Math.random() * 900)}`,
      password: 'student123'
    });
    setFormError('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      department: student.department || 'General',
      phone: student.phone || '',
      studentId: student.studentId || '',
      status: student.status || 'active'
    });
    setFormError('');
  };

  const handleViewProfile = async (student) => {
    setViewingStudent(student);
    try {
      const res = await api.get(`/students/${student._id}`);
      if (res.success && res.transactions) {
        setStudentHistory(res.transactions);
      }
    } catch (err) {
      console.error('Failed to fetch student transactions:', err);
    }
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, formData);
        setEditingStudent(null);
      } else {
        await api.post('/students', formData);
        setIsAddOpen(false);
      }
      fetchStudents();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;
    setSubmitting(true);
    try {
      await api.delete(`/students/${deletingStudent._id}`);
      setDeletingStudent(null);
      fetchStudents();
    } catch (err) {
      alert(err.message || 'Could not delete student');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
            Scholar Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            Student Management & Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {students.length} scholars enrolled in the library ecosystem
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl glass-btn-primary text-xs font-semibold flex items-center gap-2 self-start sm:self-auto shadow-lg"
        >
          <Plus size={16} />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-20 py-2 text-xs rounded-xl glass-input placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold"
          >
            Filter
          </button>
        </form>

        <button
          onClick={fetchStudents}
          className="p-2 rounded-xl glass-btn-secondary text-slate-300 hover:text-white"
          title="Refresh List"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Students Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono bg-white/[0.02]">
                <th className="py-3.5 px-4 font-semibold">Scholar Info</th>
                <th className="py-3.5 px-4 font-semibold">Student ID</th>
                <th className="py-3.5 px-4 font-semibold">Department</th>
                <th className="py-3.5 px-4 font-semibold">Active Loans</th>
                <th className="py-3.5 px-4 font-semibold">Pending Fines</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-cyan-500/30 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white text-xs">{student.name}</div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-cyan-300 font-semibold">
                    {student.studentId || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {student.department || 'General Science'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold ${
                        student.activeLoansCount > 0
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {student.activeLoansCount || 0} Books
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {student.unpaidFine > 0 ? (
                      <span className="text-rose-400 font-bold">${student.unpaidFine}</span>
                    ) : (
                      <span className="text-emerald-400">$0.00</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {student.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleViewProfile(student)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="View Profile & Borrow History"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(student)}
                        className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition-colors"
                        title="Edit Student"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeletingStudent(student)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isAddOpen || !!editingStudent}
        onClose={() => {
          setIsAddOpen(false);
          setEditingStudent(null);
        }}
        title={editingStudent ? 'Edit Scholar Information' : 'Enroll New Scholar'}
        maxWidth="max-w-lg"
      >
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSaveStudent} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Student Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Elena Rostova"
              className="w-full px-3 py-2 text-xs rounded-xl glass-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="elena@campus.edu"
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Student ID *
              </label>
              <input
                type="text"
                required
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="STU-2026-088"
                className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Computer Science & AI"
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 234-5678"
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>
          </div>

          {!editingStudent && (
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Default Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsAddOpen(false);
                setEditingStudent(null);
              }}
              className="px-4 py-2 rounded-xl glass-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl glass-btn-primary text-xs font-semibold shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingStudent ? 'Update Scholar' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Student Profile & History Modal */}
      <Modal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        title="Scholar Dossier & Circulation Audit"
        maxWidth="max-w-2xl"
      >
        {viewingStudent && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <img
                src={viewingStudent.avatar}
                alt={viewingStudent.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-cyan-500/40"
              />
              <div className="flex-1">
                <div className="text-base font-bold text-white">{viewingStudent.name}</div>
                <div className="text-xs text-slate-400">{viewingStudent.email} • {viewingStudent.phone}</div>
                <div className="flex items-center gap-2 mt-1 text-xs font-mono">
                  <span className="text-cyan-400 font-bold">{viewingStudent.studentId}</span>
                  <span>•</span>
                  <span className="text-slate-300">{viewingStudent.department}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase text-slate-300 font-bold mb-3 flex items-center gap-2">
                <BookOpen size={14} className="text-cyan-400" />
                <span>Borrowing Transactions ({studentHistory.length})</span>
              </h4>

              {studentHistory.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 border border-white/5 rounded-xl">
                  No previous or active borrowing transactions on record.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {studentHistory.map((tx) => (
                    <div
                      key={tx._id}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{tx.bookTitle}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Issued: {new Date(tx.issueDate).toLocaleDateString()} • Due: {new Date(tx.dueDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                            tx.status === 'returned'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : tx.status === 'overdue'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-cyan-500/20 text-cyan-300'
                          }`}
                        >
                          {tx.status}
                        </span>
                        {tx.lateFine > 0 && (
                          <div className="text-[10px] font-mono text-amber-400 mt-1">
                            Fine: ${tx.lateFine} ({tx.fineStatus})
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 rounded-xl glass-btn-secondary text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        title="Confirm Scholar Removal"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to remove <span className="text-white font-bold">{deletingStudent?.name}</span>? They must not have any currently borrowed books.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => setDeletingStudent(null)}
              className="px-4 py-2 rounded-xl glass-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteStudent}
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Removing...' : 'Confirm Remove'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentsPage;
