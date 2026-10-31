import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isMockMode = false;

// Mock Store for fallback if MongoDB is not running locally
class MemoryStore {
  constructor() {
    this.users = [];
    this.books = [];
    this.categories = [];
    this.transactions = [];
    this.settings = {
      libraryName: 'Aetheria Digital Library',
      maxBooksPerStudent: 5,
      defaultBorrowDays: 14,
      finePerDay: 2,
      currencySymbol: '$',
      contactEmail: 'admin@aetheria.library'
    };
    this.isLoaded = false;
  }

  generateId() {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }
}

export const memoryStore = new MemoryStore();

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_management';
  
  try {
    mongoose.set('strictQuery', false);
    // Try connecting with a short timeout so we quickly fallback if mongod is absent
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    console.log(`\x1b[32m✔ MongoDB Connected Successfully: ${conn.connection.host}\x1b[0m`);
    isMockMode = false;
    return true;
  } catch (error) {
    console.log(`\x1b[33m⚠ MongoDB connection unavailable (${error.message}).\x1b[0m`);
    console.log(`\x1b[36m⚡ Activating Built-in Resilient In-Memory & File-Backed Mock Datastore with Full Seed Data.\x1b[0m`);
    isMockMode = true;
    return false;
  }
};

export const getIsMockMode = () => isMockMode;
