import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please add an author name'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    trim: true
  },
  publisher: {
    type: String,
    default: 'Aetheria Press'
  },
  publicationYear: {
    type: Number,
    default: () => new Date().getFullYear()
  },
  description: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  shelfLocation: {
    type: String,
    default: 'Section A - Shelf 01'
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  pages: {
    type: Number,
    default: 320
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
