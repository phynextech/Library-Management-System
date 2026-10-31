import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import BorrowTransaction from '../models/BorrowTransaction.js';
import { memoryStore, getIsMockMode } from '../config/db.js';

export const getAllStudents = async (req, res) => {
  try {
    const { search, department, status } = req.query;

    if (getIsMockMode()) {
      let students = memoryStore.users.filter(u => u.role === 'student');

      if (search) {
        const q = search.toLowerCase();
        students = students.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.studentId && s.studentId.toLowerCase().includes(q))
        );
      }

      if (department && department !== 'All') {
        students = students.filter(s => s.department === department);
      }

      if (status && status !== 'All') {
        students = students.filter(s => s.status === status);
      }

      // Append active borrowed count and unpaid fines
      const enrichedStudents = students.map(s => {
        const { password, ...sData } = s;
        const studentLoans = memoryStore.transactions.filter(
          t => t.student.toString() === s._id.toString()
        );
        const activeLoans = studentLoans.filter(t => t.status === 'issued' || t.status === 'overdue');
        const unpaidFine = studentLoans.reduce((acc, curr) => (curr.fineStatus === 'pending' ? acc + (curr.lateFine || 0) : acc), 0);

        return {
          ...sData,
          activeLoansCount: activeLoans.length,
          totalBorrowedCount: studentLoans.length,
          unpaidFine
        };
      });

      return res.json({ success: true, count: enrichedStudents.length, students: enrichedStudents });
    }

    const query = { role: 'student' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }
    if (department && department !== 'All') query.department = department;
    if (status && status !== 'All') query.status = status;

    const students = await User.find(query).select('-password').sort({ createdAt: -1 });

    const enrichedStudents = await Promise.all(
      students.map(async s => {
        const sObj = s.toObject();
        const activeLoansCount = await BorrowTransaction.countDocuments({
          student: s._id,
          status: { $in: ['issued', 'overdue'] }
        });
        const totalBorrowedCount = await BorrowTransaction.countDocuments({ student: s._id });
        const pendingFines = await BorrowTransaction.find({
          student: s._id,
          fineStatus: 'pending'
        });
        const unpaidFine = pendingFines.reduce((acc, curr) => acc + (curr.lateFine || 0), 0);

        return {
          ...sObj,
          activeLoansCount,
          totalBorrowedCount,
          unpaidFine
        };
      })
    );

    res.json({ success: true, count: enrichedStudents.length, students: enrichedStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsMockMode()) {
      const student = memoryStore.users.find(u => u._id.toString() === id.toString() && u.role === 'student');
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

      const transactions = memoryStore.transactions
        .filter(t => t.student.toString() === id.toString())
        .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));

      const { password, ...studentData } = student;
      return res.json({ success: true, student: studentData, transactions });
    }

    const student = await User.findById(id).select('-password');
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const transactions = await BorrowTransaction.find({ student: id }).sort({ issueDate: -1 });
    res.json({ success: true, student, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, email, department, phone, studentId, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const defaultPass = password || 'student123';
    const assignedStudentId = studentId || `STU-2026-${Math.floor(100 + Math.random() * 900)}`;

    if (getIsMockMode()) {
      const existing = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

      const hashedPassword = await bcrypt.hash(defaultPass, 10);
      const newStudent = {
        _id: memoryStore.generateId(),
        name,
        email,
        password: hashedPassword,
        role: 'student',
        studentId: assignedStudentId,
        department: department || 'Computer Science',
        phone: phone || '',
        avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=250&q=80`,
        status: 'active',
        createdAt: new Date()
      };

      memoryStore.users.push(newStudent);
      const { password: pwd, ...stuWithoutPassword } = newStudent;
      return res.status(201).json({ success: true, student: stuWithoutPassword });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    const student = await User.create({
      name,
      email,
      password: defaultPass,
      role: 'student',
      studentId: assignedStudentId,
      department: department || 'Computer Science',
      phone: phone || ''
    });

    const stuObj = student.toObject();
    delete stuObj.password;
    res.status(201).json({ success: true, student: stuObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, phone, status, studentId } = req.body;

    if (getIsMockMode()) {
      const student = memoryStore.users.find(u => u._id.toString() === id.toString());
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

      if (name) student.name = name;
      if (email) student.email = email;
      if (department) student.department = department;
      if (phone !== undefined) student.phone = phone;
      if (status) student.status = status;
      if (studentId) student.studentId = studentId;

      const { password, ...stuWithoutPassword } = student;
      return res.json({ success: true, student: stuWithoutPassword });
    }

    const student = await User.findById(id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    if (name) student.name = name;
    if (email) student.email = email;
    if (department) student.department = department;
    if (phone !== undefined) student.phone = phone;
    if (status) student.status = status;
    if (studentId) student.studentId = studentId;

    await student.save();
    const stuObj = student.toObject();
    delete stuObj.password;

    res.json({ success: true, student: stuObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsMockMode()) {
      const activeLoans = memoryStore.transactions.filter(
        t => t.student.toString() === id.toString() && (t.status === 'issued' || t.status === 'overdue')
      );
      if (activeLoans.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete student: Currently has borrowed books that need to be returned.'
        });
      }

      memoryStore.users = memoryStore.users.filter(u => u._id.toString() !== id.toString());
      return res.json({ success: true, message: 'Student deleted successfully' });
    }

    const activeLoans = await BorrowTransaction.find({
      student: id,
      status: { $in: ['issued', 'overdue'] }
    });

    if (activeLoans.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete student: Currently has borrowed books that need to be returned.'
      });
    }

    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
