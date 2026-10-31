import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Layers,
  Calendar,
  Hash,
  Bookmark,
  Building,
  MapPin,
  Star,
  RefreshCw
} from 'lucide-react';
import Card3DTilt from '../components/3d/Card3DTilt';
import Modal from '../components/common/Modal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80'
];

export const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availability, setAvailability] = useState('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(searchParams.get('action') === 'new');
  const [editingBook, setEditingBook] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science & AI',
    publisher: 'Aetheria Press',
    publicationYear: 2025,
    description: '',
    coverImage: PRESET_COVERS[0],
    totalCopies: 5,
    shelfLocation: 'Section A - Bay 01',
    pages: 350
  });

  const { isAdmin } = useAuth();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (availability !== 'all') queryParams.append('availability', availability);

      const [booksRes, catsRes] = await Promise.all([
        api.get(`/books?${queryParams.toString()}`),
        api.get('/books/categories')
      ]);

      if (booksRes.success) setBooks(booksRes.books);
      if (catsRes.success) setCategories(catsRes.categories);
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [selectedCategory, availability]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      author: '',
      isbn: `978-0-${Math.floor(100 + Math.random() * 900)}-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1 + Math.random() * 9)}`,
      category: categories[0]?.name || 'Computer Science & AI',
      publisher: 'Aetheria Press',
      publicationYear: new Date().getFullYear(),
      description: '',
      coverImage: PRESET_COVERS[Math.floor(Math.random() * PRESET_COVERS.length)],
      totalCopies: 5,
      shelfLocation: 'Section A - Bay 01',
      pages: 320
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      publisher: book.publisher || 'Aetheria Press',
      publicationYear: book.publicationYear || 2024,
      description: book.description || '',
      coverImage: book.coverImage,
      totalCopies: book.totalCopies,
      shelfLocation: book.shelfLocation || 'Section A - Bay 01',
      pages: book.pages || 300
    });
    setFormError('');
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, formData);
        setEditingBook(null);
      } else {
        await api.post('/books', formData);
        setIsAddModalOpen(false);
      }
      fetchBooks();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!deletingBook) return;
    setSubmitting(true);
    try {
      await api.delete(`/books/${deletingBook._id}`);
      setDeletingBook(null);
      fetchBooks();
    } catch (err) {
      alert(err.message || 'Could not delete book');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
            Catalog Central
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            Book Inventory & Knowledge Index
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {books.length} publications actively synchronized with inventory mesh
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl glass-btn-primary text-xs font-semibold flex items-center gap-2 self-start sm:self-auto shadow-lg"
          >
            <Plus size={16} />
            <span>Catalog New Volume</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, author, ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-20 py-2 text-xs rounded-xl glass-input placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category & Availability Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl glass-input bg-slate-900/90 text-slate-200"
          >
            <option value="All">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl glass-input bg-slate-900/90 text-slate-200"
          >
            <option value="all">All Status</option>
            <option value="available">In Stock & Available</option>
            <option value="borrowed">Circulating</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          <button
            onClick={fetchBooks}
            className="p-2 rounded-xl glass-btn-secondary text-slate-300 hover:text-white"
            title="Refresh List"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <div className="text-xs text-slate-400 font-mono">Querying digital library matrix...</div>
        </div>
      ) : books.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border border-white/10">
          <BookOpen size={40} className="mx-auto text-slate-500 mb-3" />
          <h3 className="text-base font-bold text-white">No Matching Volumes Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search query, clearing filters, or catalog a new book.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => {
            const isAvailable = book.availableCopies > 0;
            return (
              <Card3DTilt key={book._id} className="h-full">
                <div className="h-full glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group">
                  {/* Image & Badges */}
                  <div className="relative h-60 overflow-hidden bg-slate-900">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Category Pill */}
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                      {book.category}
                    </div>

                    {/* Stock Pill */}
                    <div
                      className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border backdrop-blur-md ${
                        isAvailable
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {book.availableCopies} / {book.totalCopies} Available
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{book.author}</p>
                      
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                        <span className="flex items-center gap-1">
                          <Hash size={12} className="text-cyan-400" />
                          <span className="truncate max-w-[110px]">{book.isbn}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-purple-400" />
                          <span className="truncate max-w-[100px]">{book.shelfLocation}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 mt-2.5 font-light leading-relaxed">
                        {book.description || 'No description cataloged.'}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => setViewingBook(book)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>

                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(book)}
                            className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition-colors"
                            title="Edit Book Details"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setDeletingBook(book)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
                            title="Remove Book"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card3DTilt>
            );
          })}
        </div>
      )}

      {/* Add / Edit Book Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingBook}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBook(null);
        }}
        title={editingBook ? 'Edit Book Specifications' : 'Catalog New Book Volume'}
        maxWidth="max-w-2xl"
      >
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSaveBook} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Book Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Quantum Tensor Fields"
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Author(s) *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Dr. Eleanor Vance"
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                ISBN *
              </label>
              <input
                type="text"
                required
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="978-0-12-345678-9"
                className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input bg-slate-900"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Total Copies
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.totalCopies}
                onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Publisher
              </label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                placeholder="MIT Quantum Press"
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Publication Year
              </label>
              <input
                type="number"
                value={formData.publicationYear}
                onChange={(e) => setFormData({ ...formData, publicationYear: parseInt(e.target.value) || 2024 })}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Shelf Location
              </label>
              <input
                type="text"
                value={formData.shelfLocation}
                onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                placeholder="Section A - Bay 02"
                className="w-full px-3 py-2 text-xs rounded-xl glass-input"
              />
            </div>
          </div>

          {/* Cover Selection */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl glass-input"
            />
            {/* Presets */}
            <div className="mt-2 flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-[11px] text-slate-400 shrink-0">Presets:</span>
              {PRESET_COVERS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, coverImage: url })}
                  className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    formData.coverImage === url ? 'border-cyan-400 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Abstract & Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed overview of the book's core concepts..."
              className="w-full px-3 py-2 text-xs rounded-xl glass-input"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingBook(null);
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
              {submitting ? 'Saving...' : editingBook ? 'Save Changes' : 'Catalog Book'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Book Inspection Modal */}
      <Modal
        isOpen={!!viewingBook}
        onClose={() => setViewingBook(null)}
        title="Volume Telemetry & Details"
        maxWidth="max-w-2xl"
      >
        {viewingBook && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={viewingBook.coverImage}
                alt={viewingBook.title}
                className="w-36 h-48 object-cover rounded-xl shadow-lg ring-1 ring-white/10 shrink-0"
              />
              <div className="flex-1 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                  {viewingBook.category}
                </span>
                <h3 className="text-lg font-bold text-white font-display">{viewingBook.title}</h3>
                <p className="text-xs text-slate-300 font-medium">By {viewingBook.author}</p>
                
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-mono text-[11px]">ISBN:</span>
                    <div className="text-white font-mono text-xs">{viewingBook.isbn}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[11px]">Publisher:</span>
                    <div className="text-white text-xs">{viewingBook.publisher} ({viewingBook.publicationYear})</div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[11px]">Location:</span>
                    <div className="text-white text-xs">{viewingBook.shelfLocation}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[11px]">Availability:</span>
                    <div className="text-cyan-300 font-semibold text-xs">
                      {viewingBook.availableCopies} of {viewingBook.totalCopies} copies ready
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-1">
                Abstract & Synopsis
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                {viewingBook.description || 'No synopsis provided.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setViewingBook(null)}
                className="px-4 py-2 rounded-xl glass-btn-secondary text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        title="Confirm Volume Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to permanently remove <span className="text-white font-bold">"{deletingBook?.title}"</span> from the catalog? This action cannot be reversed.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => setDeletingBook(null)}
              className="px-4 py-2 rounded-xl glass-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteBook}
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Removing...' : 'Confirm Remove'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BooksPage;
