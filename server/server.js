import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getIsMockMode } from './config/db.js';
import { initMemoryStore, seedMongoIfEmpty } from './services/dataService.js';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingRoutes);

// System Health & Info Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: getIsMockMode() ? 'in-memory-file-fallback' : 'mongodb',
    timestamp: new Date().toISOString(),
    service: 'Aetheria Library Management API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const startServer = async () => {
  try {
    const isMongoConnected = await connectDB();
    if (isMongoConnected) {
      await seedMongoIfEmpty();
    } else {
      await initMemoryStore();
    }

    app.listen(PORT, () => {
      console.log(`\x1b[35m===================================================\x1b[0m`);
      console.log(`\x1b[36m🚀 AETHERIA LIBRARY BACKEND RUNNING ON PORT ${PORT}\x1b[0m`);
      console.log(`\x1b[33m⚡ Mode: ${getIsMockMode() ? 'In-Memory / Zero-Config Mock Store' : 'Active MongoDB'}\x1b[0m`);
      console.log(`\x1b[32m✔ Ready for requests at http://localhost:${PORT}/api/health\x1b[0m`);
      console.log(`\x1b[35m===================================================\x1b[0m`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

startServer();
