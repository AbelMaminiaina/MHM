import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
let isConnected = false;

async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
}

// Connect to database on cold start
await connectToDatabase();

// Import app after database connection
const { default: app } = await import('../src/app.js');

// Export the Express app for Vercel
export default app;
