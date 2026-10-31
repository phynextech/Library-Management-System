import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Category from '../models/Category.js';
import BorrowTransaction from '../models/BorrowTransaction.js';
import Setting from '../models/Setting.js';
import { memoryStore, getIsMockMode } from '../config/db.js';
import { initialAdmin, initialStudents, initialBooks, initialCategories } from '../scripts/seedData.js';

// Seed In-Memory Store
export const initMemoryStore = async () => {
  if (memoryStore.isLoaded) return;

  const adminHash = await bcrypt.hash(initialAdmin.password, 10);
  const adminObj = {
    ...initialAdmin,
    _id: 'admin_usr_001',
    password: adminHash,
    createdAt: new Date()
  };
  memoryStore.users.push(adminObj);

  for (let i = 0; i < initialStudents.length; i++) {
    const s = initialStudents[i];
    const sHash = await bcrypt.hash(s.password, 10);
    const stuObj = {
      ...s,
      _id: `stu_usr_00${i + 1}`,
      password: sHash,
      createdAt: new Date()
    };
    memoryStore.users.push(stuObj);
  }

  for (let i = 0; i < initialCategories.length; i++) {
    const c = initialCategories[i];
    memoryStore.categories.push({
      ...c,
      _id: `cat_00${i + 1}`,
      createdAt: new Date()
    });
  }

  for (let i = 0; i < initialBooks.length; i++) {
    const b = initialBooks[i];
    memoryStore.books.push({
      ...b,
      _id: `book_00${i + 1}`,
      createdAt: new Date()
    });
  }

  // Create initial demo transactions
  const now = new Date();
  const past5Days = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const past20Days = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000);
  const past15Days = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  const past2Days = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const future10Days = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

  memoryStore.transactions.push(
    {
      _id: 'tx_001',
      book: memoryStore.books[0]._id,
      student: memoryStore.users[1]._id,
      bookTitle: memoryStore.books[0].title,
      studentName: memoryStore.users[1].name,
      studentId: memoryStore.users[1].studentId,
      issueDate: past5Days,
      dueDate: future10Days,
      returnDate: null,
      status: 'issued',
      lateFine: 0,
      fineStatus: 'none',
      notes: 'Semester AI module reference'
    },
    {
      _id: 'tx_002',
      book: memoryStore.books[1]._id,
      student: memoryStore.users[2]._id,
      bookTitle: memoryStore.books[1].title,
      studentName: memoryStore.users[2].name,
      studentId: memoryStore.users[2].studentId,
      issueDate: past20Days,
      dueDate: past5Days,
      returnDate: null,
      status: 'overdue',
      lateFine: 10,
      fineStatus: 'pending',
      notes: 'Overdue by 5 days. Sent auto-reminder email.'
    },
    {
      _id: 'tx_003',
      book: memoryStore.books[2]._id,
      student: memoryStore.users[1]._id,
      bookTitle: memoryStore.books[2].title,
      studentName: memoryStore.users[1].name,
      studentId: memoryStore.users[1].studentId,
      issueDate: past15Days,
      dueDate: past2Days,
      returnDate: past2Days,
      status: 'returned',
      lateFine: 0,
      fineStatus: 'none',
      notes: 'Returned in pristine condition'
    },
    {
      _id: 'tx_004',
      book: memoryStore.books[3]._id,
      student: memoryStore.users[3]._id,
      bookTitle: memoryStore.books[3].title,
      studentName: memoryStore.users[3].name,
      studentId: memoryStore.users[3].studentId,
      issueDate: past15Days,
      dueDate: past1Days(now),
      returnDate: null,
      status: 'overdue',
      lateFine: 4,
      fineStatus: 'pending',
      notes: 'Overdue by 2 days.'
    }
  );

  memoryStore.isLoaded = true;
};

function past1Days(d) {
  return new Date(d.getTime() - 2 * 24 * 60 * 60 * 1000);
}

// Ensure MongoDB database is seeded if connected
export const seedMongoIfEmpty = async () => {
  if (getIsMockMode()) return;

  try {
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      console.log('Seeding initial dataset into MongoDB...');
      
      const adminExists = await User.findOne({ email: initialAdmin.email });
      let adminId;
      if (!adminExists) {
        const createdAdmin = await User.create(initialAdmin);
        adminId = createdAdmin._id;
      } else {
        adminId = adminExists._id;
      }

      const createdStudents = [];
      for (const s of initialStudents) {
        const existing = await User.findOne({ email: s.email });
        if (!existing) {
          const created = await User.create(s);
          createdStudents.push(created);
        } else {
          createdStudents.push(existing);
        }
      }

      await Category.deleteMany({});
      const createdCats = await Category.insertMany(initialCategories);

      await Book.deleteMany({});
      const createdBooks = await Book.insertMany(initialBooks);

      const now = new Date();
      await BorrowTransaction.deleteMany({});
      await BorrowTransaction.create([
        {
          book: createdBooks[0]._id,
          student: createdStudents[0]._id,
          bookTitle: createdBooks[0].title,
          studentName: createdStudents[0].name,
          studentId: createdStudents[0].studentId,
          issueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          dueDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
          status: 'issued',
          lateFine: 0,
          fineStatus: 'none',
          notes: 'Standard semester issue'
        },
        {
          book: createdBooks[1]._id,
          student: createdStudents[1]._id,
          bookTitle: createdBooks[1].title,
          studentName: createdStudents[1].name,
          studentId: createdStudents[1].studentId,
          issueDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
          dueDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
          status: 'overdue',
          lateFine: 8,
          fineStatus: 'pending',
          notes: 'Overdue notice sent'
        }
      ]);

      const settingExists = await Setting.findOne();
      if (!settingExists) {
        await Setting.create({
          libraryName: 'Aetheria Digital Library',
          maxBooksPerStudent: 5,
          defaultBorrowDays: 14,
          finePerDay: 2,
          currencySymbol: '$',
          contactEmail: 'admin@aetheria.library'
        });
      }

      console.log('MongoDB Seed complete!');
    }
  } catch (err) {
    console.error('Error during MongoDB seed:', err.message);
  }
};
