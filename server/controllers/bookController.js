import Book from '../models/Book.js';
import BorrowTransaction from '../models/BorrowTransaction.js';
import Category from '../models/Category.js';
import { memoryStore, getIsMockMode } from '../config/db.js';

export const getAllBooks = async (req, res) => {
  try {
    const { search, category, availability } = req.query;

    if (getIsMockMode()) {
      let books = [...memoryStore.books];

      if (search) {
        const query = search.toLowerCase();
        books = books.filter(b => 
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query) ||
          b.isbn.toLowerCase().includes(query) ||
          (b.description && b.description.toLowerCase().includes(query))
        );
      }

      if (category && category !== 'All') {
        books = books.filter(b => b.category.toLowerCase() === category.toLowerCase());
      }

      if (availability === 'available') {
        books = books.filter(b => b.availableCopies > 0);
      } else if (availability === 'borrowed') {
        books = books.filter(b => b.availableCopies < b.totalCopies);
      } else if (availability === 'out_of_stock') {
        books = books.filter(b => b.availableCopies === 0);
      }

      return res.json({
        success: true,
        count: books.length,
        books
      });
    }

    // Mongo Query
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (availability === 'available') {
      query.availableCopies = { $gt: 0 };
    } else if (availability === 'out_of_stock') {
      query.availableCopies = 0;
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsMockMode()) {
      const book = memoryStore.books.find(b => b._id.toString() === id.toString());
      if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

      const transactions = memoryStore.transactions
        .filter(t => t.book.toString() === id.toString())
        .slice(0, 5);

      return res.json({ success: true, book, transactions });
    }

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    const transactions = await BorrowTransaction.find({ book: id }).sort({ issueDate: -1 }).limit(5);

    res.json({ success: true, book, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const {
      title, author, isbn, category, publisher,
      publicationYear, description, coverImage,
      totalCopies, shelfLocation, pages, tags
    } = req.body;

    if (!title || !author || !isbn || !category) {
      return res.status(400).json({ success: false, message: 'Title, Author, ISBN, and Category are required' });
    }

    const copies = parseInt(totalCopies) || 1;

    if (getIsMockMode()) {
      const existing = memoryStore.books.find(b => b.isbn === isbn);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Book with this ISBN already exists' });
      }

      const newBook = {
        _id: memoryStore.generateId(),
        title,
        author,
        isbn,
        category,
        publisher: publisher || 'Aetheria Press',
        publicationYear: parseInt(publicationYear) || new Date().getFullYear(),
        description: description || '',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        totalCopies: copies,
        availableCopies: copies,
        shelfLocation: shelfLocation || 'Section A - Bay 01',
        rating: 4.8,
        pages: parseInt(pages) || 300,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
        createdAt: new Date()
      };

      memoryStore.books.unshift(newBook);
      return res.status(201).json({ success: true, book: newBook });
    }

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ success: false, message: 'Book with this ISBN already exists' });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      publisher: publisher || 'Aetheria Press',
      publicationYear: parseInt(publicationYear) || new Date().getFullYear(),
      description,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      totalCopies: copies,
      availableCopies: copies,
      shelfLocation: shelfLocation || 'Section A - Bay 01',
      pages: parseInt(pages) || 300,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [])
    });

    res.status(201).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (getIsMockMode()) {
      const index = memoryStore.books.findIndex(b => b._id.toString() === id.toString());
      if (index === -1) return res.status(404).json({ success: false, message: 'Book not found' });

      const book = memoryStore.books[index];
      
      // If total copies changed, adjust available copies accordingly
      if (updates.totalCopies !== undefined) {
        const diff = parseInt(updates.totalCopies) - book.totalCopies;
        book.availableCopies = Math.max(0, book.availableCopies + diff);
        book.totalCopies = parseInt(updates.totalCopies);
      }

      Object.assign(book, updates);
      return res.json({ success: true, book });
    }

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    if (updates.totalCopies !== undefined) {
      const diff = parseInt(updates.totalCopies) - book.totalCopies;
      book.availableCopies = Math.max(0, book.availableCopies + diff);
    }

    Object.assign(book, updates);
    await book.save();

    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsMockMode()) {
      // Check if there are active loans
      const activeLoans = memoryStore.transactions.filter(
        t => t.book.toString() === id.toString() && (t.status === 'issued' || t.status === 'overdue')
      );
      if (activeLoans.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete book: Copies are currently borrowed by students.'
        });
      }

      memoryStore.books = memoryStore.books.filter(b => b._id.toString() !== id.toString());
      return res.json({ success: true, message: 'Book removed successfully' });
    }

    const activeLoans = await BorrowTransaction.find({
      book: id,
      status: { $in: ['issued', 'overdue'] }
    });

    if (activeLoans.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete book: Copies are currently borrowed by students.'
      });
    }

    await Book.findByIdAndDelete(id);
    res.json({ success: true, message: 'Book removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    if (getIsMockMode()) {
      const categoriesWithCount = memoryStore.categories.map(cat => {
        const count = memoryStore.books.filter(b => b.category.toLowerCase() === cat.name.toLowerCase()).length;
        return {
          ...cat,
          bookCount: count
        };
      });
      return res.json({ success: true, categories: categoriesWithCount });
    }

    const categories = await Category.find();
    const categoriesWithCount = await Promise.all(
      categories.map(async cat => {
        const count = await Book.countDocuments({ category: cat.name });
        return {
          ...cat.toObject(),
          bookCount: count
        };
      })
    );

    res.json({ success: true, categories: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
