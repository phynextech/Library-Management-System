import express from 'express';
import { getDashboardStats, getFullReport } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardStats);
router.get('/full', protect, authorize('admin'), getFullReport);

export default router;
