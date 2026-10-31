import Book from '../models/Book.js';
import User from '../models/User.js';
import BorrowTransaction from '../models/BorrowTransaction.js';
import Setting from '../models/Setting.js';
import { memoryStore, getIsMockMode } from '../config/db.js';

// Helper to calculate fines dynamically
const calculateFine = (dueDate, finePerDay = 2) => {
  const now = new Date();
  const due = new Date(dueDate);
  if (now > due) {
    const diffTime = Math.abs(now - due);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * finePerDay;
  }
  return 0;
};

export const issueBook = async (req, res) => {
  try {
    const { bookId, studentId, dueDate, notes } = req.body;

    if (!bookId || !studentId) {
      return res.status(400).json({ success: false, message: 'Book ID and Student ID are required' });
    }

    if (getIsMockMode()) {
      const book = memoryStore.books.find(b => b._id.toString() === bookId.toString());
      if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
      if (book.availableCopies <= 0) {
        return res.status(400).json({ success: false, message: 'No available copies for this book' });
      }

      const student = memoryStore.users.find(
        u => (u._id.toString() === studentId.toString() || u.studentId === studentId) && u.role === 'student'
      );
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

      // Check max borrow limit
      const activeCount = memoryStore.transactions.filter(
        t => t.student.toString() === student._id.toString() && (t.status === 'issued' || t.status === 'overdue')
      ).length;

      const maxAllowed = memoryStore.settings.maxBooksPerStudent || 5;
      if (activeCount >= maxAllowed) {
        return res.status(400).json({
          success: false,
          message: `Student reached maximum limit of ${maxAllowed} simultaneously borrowed books.`
        });
      }

      // Check if already has copy of this book
      const alreadyBorrowed = memoryStore.transactions.find(
        t => t.student.toString() === student._id.toString() &&
             t.book.toString() === book._id.toString() &&
             (t.status === 'issued' || t.status === 'overdue')
      );
      if (alreadyBorrowed) {
        return res.status(400).json({
          success: false,
          message: 'Student already has an active borrowed copy of this book.'
        });
      }

      const defaultDays = memoryStore.settings.defaultBorrowDays || 14;
      const targetDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + defaultDays * 24 * 60 * 60 * 1000);

      // Decrement copies
      book.availableCopies = Math.max(0, book.availableCopies - 1);

      const newTx = {
        _id: memoryStore.generateId(),
        book: book._id,
        student: student._id,
        bookTitle: book.title,
        studentName: student.name,
        studentId: student.studentId || 'N/A',
        issueDate: new Date(),
        dueDate: targetDueDate,
        returnDate: null,
        status: 'issued',
        lateFine: 0,
        fineStatus: 'none',
        notes: notes || '',
        issuedBy: req.user?.name || 'Administrator',
        createdAt: new Date()
      };

      memoryStore.transactions.unshift(newTx);
      return res.status(201).json({ success: true, transaction: newTx, book });
    }

    // Mongo implementation
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'No available copies for this book' });
    }

    const student = await User.findOne({
      $or: [{ _id: studentId.match(/^[0-9a-fA-F]{24}$/) ? studentId : null }, { studentId: studentId }],
      role: 'student'
    });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const activeCount = await BorrowTransaction.countDocuments({
      student: student._id,
      status: { $in: ['issued', 'overdue'] }
    });

    const setting = (await Setting.findOne()) || { maxBooksPerStudent: 5, defaultBorrowDays: 14 };
    if (activeCount >= setting.maxBooksPerStudent) {
      return res.status(400).json({
        success: false,
        message: `Student reached maximum limit of ${setting.maxBooksPerStudent} books.`
      });
    }

    const alreadyBorrowed = await BorrowTransaction.findOne({
      student: student._id,
      book: book._id,
      status: { $in: ['issued', 'overdue'] }
    });
    if (alreadyBorrowed) {
      return res.status(400).json({
        success: false,
        message: 'Student already has an active copy of this book.'
      });
    }

    const targetDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + setting.defaultBorrowDays * 24 * 60 * 60 * 1000);

    book.availableCopies = Math.max(0, book.availableCopies - 1);
    await book.save();

    const transaction = await BorrowTransaction.create({
      book: book._id,
      student: student._id,
      bookTitle: book.title,
      studentName: student.name,
      studentId: student.studentId || 'N/A',
      issueDate: new Date(),
      dueDate: targetDueDate,
      status: 'issued',
      notes: notes || '',
      issuedBy: req.user?.name || 'Administrator'
    });

    res.status(201).json({ success: true, transaction, book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { transactionId, finePaid = false } = req.body;

    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required' });
    }

    const now = new Date();

    if (getIsMockMode()) {
      const tx = memoryStore.transactions.find(t => t._id.toString() === transactionId.toString());
      if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' });

      if (tx.status === 'returned') {
        return res.status(400).json({ success: false, message: 'Book is already marked as returned' });
      }

      const finePerDay = memoryStore.settings.finePerDay || 2;
      const lateFine = calculateFine(tx.dueDate, finePerDay);

      tx.returnDate = now;
      tx.status = 'returned';
      tx.lateFine = lateFine;
      tx.fineStatus = lateFine > 0 ? (finePaid ? 'paid' : 'pending') : 'none';

      // Increment available copies
      const book = memoryStore.books.find(b => b._id.toString() === tx.book.toString());
      if (book) {
        book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
      }

      return res.json({
        success: true,
        message: `Book returned successfully.${lateFine > 0 ? ` Calculated overdue fine: $${lateFine}.` : ''}`,
        transaction: tx
      });
    }

    const tx = await BorrowTransaction.findById(transactionId);
    if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' });

    if (tx.status === 'returned') {
      return res.status(400).json({ success: false, message: 'Book is already marked as returned' });
    }

    const setting = (await Setting.findOne()) || { finePerDay: 2 };
    const lateFine = calculateFine(tx.dueDate, setting.finePerDay);

    tx.returnDate = now;
    tx.status = 'returned';
    tx.lateFine = lateFine;
    tx.fineStatus = lateFine > 0 ? (finePaid ? 'paid' : 'pending') : 'none';
    await tx.save();

    await Book.findByIdAndUpdate(tx.book, { $inc: { availableCopies: 1 } });

    res.json({
      success: true,
      message: `Book returned successfully.${lateFine > 0 ? ` Overdue fine: $${lateFine}.` : ''}`,
      transaction: tx
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const { status, search } = req.query;
    const now = new Date();

    if (getIsMockMode()) {
      let txs = memoryStore.transactions.map(t => {
        // dynamically refresh overdue status if past due
        if (t.status === 'issued' && now > new Date(t.dueDate)) {
          t.status = 'overdue';
          t.lateFine = calculateFine(t.dueDate, memoryStore.settings.finePerDay || 2);
          if (t.fineStatus === 'none') t.fineStatus = 'pending';
        }
        return t;
      });

      if (status && status !== 'All') {
        txs = txs.filter(t => t.status === status);
      }

      if (search) {
        const q = search.toLowerCase();
        txs = txs.filter(t =>
          t.bookTitle.toLowerCase().includes(q) ||
          t.studentName.toLowerCase().includes(q) ||
          t.studentId.toLowerCase().includes(q)
        );
      }

      // Sort newest first
      txs.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));

      return res.json({ success: true, count: txs.length, transactions: txs });
    }

    const query = {};
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { bookTitle: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    const txs = await BorrowTransaction.find(query).sort({ issueDate: -1 });

    // Update any overdue records
    const updatedTxs = await Promise.all(
      txs.map(async t => {
        if (t.status === 'issued' && now > new Date(t.dueDate)) {
          t.status = 'overdue';
          t.lateFine = calculateFine(t.dueDate);
          if (t.fineStatus === 'none') t.fineStatus = 'pending';
          await t.save();
        }
        return t;
      })
    );

    res.json({ success: true, count: updatedTxs.length, transactions: updatedTxs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const payFine = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'paid' } = req.body;

    if (getIsMockMode()) {
      const tx = memoryStore.transactions.find(t => t._id.toString() === id.toString());
      if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' });
      tx.fineStatus = status;
      return res.json({ success: true, message: `Fine status updated to ${status}`, transaction: tx });
    }

    const tx = await BorrowTransaction.findById(id);
    if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' });
    tx.fineStatus = status;
    await tx.save();

    res.json({ success: true, message: `Fine status updated to ${status}`, transaction: tx });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentTransactions = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;

    if (getIsMockMode()) {
      const txs = memoryStore.transactions
        .filter(t => t.student.toString() === studentId.toString())
        .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
      return res.json({ success: true, count: txs.length, transactions: txs });
    }

    const txs = await BorrowTransaction.find({ student: studentId }).sort({ issueDate: -1 });
    res.json({ success: true, count: txs.length, transactions: txs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
