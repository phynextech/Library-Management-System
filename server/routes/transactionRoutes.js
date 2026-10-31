import express from 'express';
import {
  issueBook,
  returnBook,
  getAllTransactions,
  getStudentTransactions,
  payFine
} from '../controllers/transactionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllTransactions);
router.get('/my', protect, getStudentTransactions);
router.post('/issue', protect, issueBook);
router.post('/return', protect, returnBook);
router.put('/:id/fine', protect, authorize('admin'), payFine);

export default router;
