import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { memoryStore, getIsMockMode } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aetheria_super_secret_jwt_key_2026';

export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (getIsMockMode()) {
      const user = memoryStore.users.find(u => u._id.toString() === decoded.id.toString());
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found in session' });
      }
      req.user = user;
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role || 'Guest'}) is not permitted to perform this operation`
      });
    }
    next();
  };
};
