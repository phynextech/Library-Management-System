import express from 'express';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getCategories
} from '../controllers/bookController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/categories', getCategories);
router.get('/:id', getBookById);
router.post('/', protect, authorize('admin'), createBook);
router.put('/:id', protect, authorize('admin'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);

export default router;
