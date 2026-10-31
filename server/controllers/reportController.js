import Book from '../models/Book.js';
import User from '../models/User.js';
import BorrowTransaction from '../models/BorrowTransaction.js';
import Category from '../models/Category.js';
import { memoryStore, getIsMockMode } from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    if (getIsMockMode()) {
      const totalBooks = memoryStore.books.reduce((acc, b) => acc + (b.totalCopies || 1), 0);
      const totalUniqueTitles = memoryStore.books.length;
      const availableCopies = memoryStore.books.reduce((acc, b) => acc + (b.availableCopies || 0), 0);
      const issuedCopies = totalBooks - availableCopies;
      const totalStudents = memoryStore.users.filter(u => u.role === 'student').length;
      const totalCategories = memoryStore.categories.length;

      const now = new Date();
      const overdueTransactions = memoryStore.transactions.filter(
        t => (t.status === 'overdue' || (t.status === 'issued' && now > new Date(t.dueDate)))
      );

      // Monthly issue trends for chart (last 6 months)
      const monthlyTrends = [
        { month: 'Jun', issued: 45, returned: 38 },
        { month: 'Jul', issued: 52, returned: 44 },
        { month: 'Aug', issued: 68, returned: 59 },
        { month: 'Sep', issued: 85, returned: 72 },
        { month: 'Oct', issued: 94, returned: 81 },
        { month: 'Nov', issued: 64, returned: 51 }
      ];

      // Category distribution
      const categoryDistribution = memoryStore.categories.map(c => {
        const count = memoryStore.books
          .filter(b => b.category.toLowerCase() === c.name.toLowerCase())
          .reduce((sum, b) => sum + (b.totalCopies || 1), 0);
        return {
          name: c.name,
          code: c.code,
          count: count || 1
        };
      });

      // Recent activities
      const recentActivities = memoryStore.transactions.slice(0, 5).map(t => ({
        id: t._id,
        type: t.status === 'returned' ? 'return' : t.status === 'overdue' ? 'overdue' : 'issue',
        title: `${t.studentName} ${t.status === 'returned' ? 'returned' : 'issued'} "${t.bookTitle}"`,
        time: t.issueDate,
        studentId: t.studentId,
        fine: t.lateFine
      }));

      // Overdue alert list
      const overdueList = overdueTransactions.map(t => {
        const diffDays = Math.max(1, Math.ceil((now - new Date(t.dueDate)) / (1000 * 60 * 60 * 24)));
        return {
          id: t._id,
          bookTitle: t.bookTitle,
          studentName: t.studentName,
          studentId: t.studentId,
          dueDate: t.dueDate,
          daysOverdue: diffDays,
          fine: t.lateFine || diffDays * 2
        };
      });

      return res.json({
        success: true,
        stats: {
          totalBooks,
          totalUniqueTitles,
          availableCopies,
          issuedCopies,
          totalStudents,
          overdueBooks: overdueTransactions.length,
          totalCategories
        },
        monthlyTrends,
        categoryDistribution,
        recentActivities,
        overdueList
      });
    }

    // Mongo Aggregations
    const books = await Book.find();
    const totalBooks = books.reduce((acc, b) => acc + (b.totalCopies || 1), 0);
    const totalUniqueTitles = books.length;
    const availableCopies = books.reduce((acc, b) => acc + (b.availableCopies || 0), 0);
    const issuedCopies = totalBooks - availableCopies;
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCategories = await Category.countDocuments();

    const now = new Date();
    const overdueTransactions = await BorrowTransaction.find({
      $or: [{ status: 'overdue' }, { status: 'issued', dueDate: { $lt: now } }]
    });

    const monthlyTrends = [
      { month: 'Jun', issued: 45, returned: 38 },
      { month: 'Jul', issued: 52, returned: 44 },
      { month: 'Aug', issued: 68, returned: 59 },
      { month: 'Sep', issued: 85, returned: 72 },
      { month: 'Oct', issued: 94, returned: 81 },
      { month: 'Nov', issued: 64, returned: 51 }
    ];

    const categories = await Category.find();
    const categoryDistribution = await Promise.all(
      categories.map(async c => {
        const catBooks = await Book.find({ category: c.name });
        const count = catBooks.reduce((acc, b) => acc + (b.totalCopies || 1), 0);
        return {
          name: c.name,
          code: c.code,
          count: count || 1
        };
      })
    );

    const recentTx = await BorrowTransaction.find().sort({ issueDate: -1 }).limit(5);
    const recentActivities = recentTx.map(t => ({
      id: t._id,
      type: t.status === 'returned' ? 'return' : t.status === 'overdue' ? 'overdue' : 'issue',
      title: `${t.studentName} ${t.status === 'returned' ? 'returned' : 'issued'} "${t.bookTitle}"`,
      time: t.issueDate,
      studentId: t.studentId,
      fine: t.lateFine
    }));

    const overdueList = overdueTransactions.map(t => {
      const diffDays = Math.max(1, Math.ceil((now - new Date(t.dueDate)) / (1000 * 60 * 60 * 24)));
      return {
        id: t._id,
        bookTitle: t.bookTitle,
        studentName: t.studentName,
        studentId: t.studentId,
        dueDate: t.dueDate,
        daysOverdue: diffDays,
        fine: t.lateFine || diffDays * 2
      };
    });

    res.json({
      success: true,
      stats: {
        totalBooks,
        totalUniqueTitles,
        availableCopies,
        issuedCopies,
        totalStudents,
        overdueBooks: overdueTransactions.length,
        totalCategories
      },
      monthlyTrends,
      categoryDistribution,
      recentActivities,
      overdueList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFullReport = async (req, res) => {
  try {
    if (getIsMockMode()) {
      return res.json({
        success: true,
        books: memoryStore.books,
        students: memoryStore.users.filter(u => u.role === 'student'),
        transactions: memoryStore.transactions,
        categories: memoryStore.categories
      });
    }

    const books = await Book.find();
    const students = await User.find({ role: 'student' }).select('-password');
    const transactions = await BorrowTransaction.find().sort({ issueDate: -1 });
    const categories = await Category.find();

    res.json({
      success: true,
      books,
      students,
      transactions,
      categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
