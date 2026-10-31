import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  BarChart3,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Users,
  RefreshCw,
  FolderDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import api from '../services/api';

export const ReportsPage = () => {
  const [reportType, setReportType] = useState('all_books'); // 'all_books', 'issued', 'returned', 'overdue', 'students', 'categories'
  const [fullData, setFullData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/full');
      if (res.success) {
        setFullData(res);
      }
    } catch (err) {
      console.error('Failed to load report dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  // Compute table rows based on selected report type
  const getReportRows = () => {
    if (!fullData) return [];

    switch (reportType) {
      case 'all_books':
        return fullData.books.map(b => ({
          col1: b.title,
          col2: b.author,
          col3: b.isbn,
          col4: b.category,
          col5: `${b.availableCopies} / ${b.totalCopies}`
        }));
      case 'issued':
        return fullData.transactions
          .filter(t => t.status === 'issued')
          .map(t => ({
            col1: t.bookTitle,
            col2: t.studentName,
            col3: t.studentId,
            col4: new Date(t.issueDate).toLocaleDateString(),
            col5: new Date(t.dueDate).toLocaleDateString()
          }));
      case 'returned':
        return fullData.transactions
          .filter(t => t.status === 'returned')
          .map(t => ({
            col1: t.bookTitle,
            col2: t.studentName,
            col3: t.studentId,
            col4: new Date(t.issueDate).toLocaleDateString(),
            col5: new Date(t.returnDate).toLocaleDateString()
          }));
      case 'overdue':
        return fullData.transactions
          .filter(t => t.status === 'overdue' || (t.status === 'issued' && new Date() > new Date(t.dueDate)))
          .map(t => ({
            col1: t.bookTitle,
            col2: t.studentName,
            col3: t.studentId,
            col4: new Date(t.dueDate).toLocaleDateString(),
            col5: `$${t.lateFine || 0}`
          }));
      case 'students':
        return fullData.students.map(s => ({
          col1: s.name,
          col2: s.studentId || 'N/A',
          col3: s.email,
          col4: s.department || 'General',
          col5: s.status || 'Active'
        }));
      case 'categories':
        return fullData.categories.map(c => {
          const count = fullData.books.filter(b => b.category === c.name).length;
          return {
            col1: c.name,
            col2: c.code || 'N/A',
            col3: c.description,
            col4: `${count} Titles`,
            col5: 'Active'
          };
        });
      default:
        return [];
    }
  };

  const getHeaders = () => {
    switch (reportType) {
      case 'all_books':
        return ['Title', 'Author', 'ISBN', 'Category', 'Available / Total'];
      case 'issued':
        return ['Book Title', 'Scholar Name', 'Student ID', 'Issue Date', 'Due Date'];
      case 'returned':
        return ['Book Title', 'Scholar Name', 'Student ID', 'Issue Date', 'Return Date'];
      case 'overdue':
        return ['Book Title', 'Scholar Name', 'Student ID', 'Scheduled Due Date', 'Accrued Fine'];
      case 'students':
        return ['Scholar Name', 'Student ID', 'Email', 'Department', 'Enrollment Status'];
      case 'categories':
        return ['Category Name', 'Code', 'Faculty Description', 'Book Count', 'Status'];
      default:
        return ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5'];
    }
  };

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    const headers = [getHeaders()];
    const rows = getReportRows().map(r => [r.col1, r.col2, r.col3, r.col4, r.col5]);

    // Title & Header info
    doc.setFontSize(18);
    doc.setTextColor(6, 182, 212);
    doc.text('AETHERIA DIGITAL LIBRARY', 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Official Intelligence & Circulation Audit Report — ${reportType.toUpperCase()}`, 14, 28);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      }
    });

    doc.save(`Aetheria_Report_${reportType}_${Date.now()}.pdf`);
  };

  // Export to Excel (xlsx)
  const exportExcel = () => {
    const headers = getHeaders();
    const rows = getReportRows().map(r => ({
      [headers[0]]: r.col1,
      [headers[1]]: r.col2,
      [headers[2]]: r.col3,
      [headers[3]]: r.col4,
      [headers[4]]: r.col5
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Library Report');
    XLSX.writeFile(workbook, `Aetheria_Report_${reportType}_${Date.now()}.xlsx`);
  };

  const headers = getHeaders();
  const rows = getReportRows();

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
            Analytics & Auditing
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            Reports & Formal Ledger Exports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate and export institutional circulation reports to PDF and Excel (XLSX)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportPDF}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <Download size={15} />
            <span>Export PDF</span>
          </button>
          <button
            onClick={exportExcel}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <FolderDown size={15} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 text-xs">
        {[
          { id: 'all_books', label: 'All Catalog Books', icon: BookOpen },
          { id: 'issued', label: 'Currently Issued', icon: CheckCircle2 },
          { id: 'returned', label: 'Returned Books', icon: RefreshCw },
          { id: 'overdue', label: 'Overdue Books', icon: AlertTriangle },
          { id: 'students', label: 'Student Activity', icon: Users },
          { id: 'categories', label: 'Category Reports', icon: BarChart3 }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap border transition-all ${
                reportType === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Summary Card */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold">
            {rows.length}
          </div>
          <div>
            <div className="font-bold text-white">Records Compiled in Report</div>
            <div className="text-[11px] text-slate-400">Timestamp: {new Date().toLocaleString()}</div>
          </div>
        </div>

        <span className="text-[11px] text-cyan-400 font-mono">
          Ready for PDF / Excel Export
        </span>
      </div>

      {/* Report Table Preview */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono bg-white/[0.03]">
                {headers.map((h, i) => (
                  <th key={i} className="py-3.5 px-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-medium text-white max-w-[200px] truncate">{row.col1}</td>
                  <td className="py-3 px-4 text-slate-300 truncate max-w-[160px]">{row.col2}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{row.col3}</td>
                  <td className="py-3 px-4 text-slate-300">{row.col4}</td>
                  <td className="py-3 px-4 text-cyan-300 font-semibold">{row.col5}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="py-16 text-center text-xs text-slate-500">
              No entries compiled for this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
