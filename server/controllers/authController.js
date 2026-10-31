import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { memoryStore, getIsMockMode } from '../config/db.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    if (getIsMockMode()) {
      const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken(user._id, user.role);
      const { password: pwd, ...userWithoutPassword } = user;
      return res.json({
        success: true,
        token,
        user: userWithoutPassword
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);
    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      token,
      user: userObj
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password, role, department, phone, studentId } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  try {
    if (getIsMockMode()) {
      const existing = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: memoryStore.generateId(),
        name,
        email,
        password: hashedPassword,
        role: role || 'student',
        studentId: studentId || (role === 'admin' ? undefined : `STU-2026-${Math.floor(100 + Math.random() * 900)}`),
        department: department || 'General Science',
        phone: phone || '',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80`,
        status: 'active',
        createdAt: new Date()
      };

      memoryStore.users.push(newUser);
      const token = generateToken(newUser._id, newUser.role);
      const { password: pwd, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        success: true,
        token,
        user: userWithoutPassword
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const assignedStudentId = studentId || (role === 'admin' ? undefined : `STU-2026-${Math.floor(100 + Math.random() * 900)}`);
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      studentId: assignedStudentId,
      department: department || 'General Science',
      phone: phone || ''
    });

    const token = generateToken(user._id, user.role);
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      token,
      user: userObj
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide email address' });
  }

  // Simulated password reset token
  res.json({
    success: true,
    message: 'Password reset link sent to registered email address (simulated)'
  });
};

export const updateProfile = async (req, res) => {
  const { name, phone, department, avatar, password } = req.body;
  const userId = req.user._id || req.user.id;

  try {
    if (getIsMockMode()) {
      const user = memoryStore.users.find(u => u._id.toString() === userId.toString());
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (department) user.department = department;
      if (avatar) user.avatar = avatar;
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      const { password: pwd, ...userWithoutPassword } = user;
      return res.json({ success: true, user: userWithoutPassword });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (department) user.department = department;
    if (avatar) user.avatar = avatar;
    if (password) user.password = password;

    await user.save();
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, user: userObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
