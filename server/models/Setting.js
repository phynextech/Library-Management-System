import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  libraryName: {
    type: String,
    default: 'Aetheria Digital Library'
  },
  maxBooksPerStudent: {
    type: Number,
    default: 5
  },
  defaultBorrowDays: {
    type: Number,
    default: 14
  },
  finePerDay: {
    type: Number,
    default: 2.0
  },
  currencySymbol: {
    type: String,
    default: '$'
  },
  contactEmail: {
    type: String,
    default: 'admin@aetheria.library'
  },
  allowStudentBorrowRequest: {
    type: Boolean,
    default: true
  },
  systemNotification: {
    type: String,
    default: 'Welcome to Aetheria Library Management v2.0 - All systems operational.'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
