import mongoose from 'mongoose';

const borrowTransactionSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookTitle: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['issued', 'returned', 'overdue'],
    default: 'issued'
  },
  lateFine: {
    type: Number,
    default: 0
  },
  fineStatus: {
    type: String,
    enum: ['none', 'pending', 'paid', 'waived'],
    default: 'none'
  },
  notes: {
    type: String,
    default: ''
  },
  issuedBy: {
    type: String,
    default: 'Admin Staff'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BorrowTransaction = mongoose.model('BorrowTransaction', borrowTransactionSchema);
export default BorrowTransaction;
