import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Set default values for serverless environment
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '3000';

// Force disable file logging in serverless environment (read-only filesystem)
process.env.DISABLE_FILE_LOGGING = 'true';

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
let isConnected = false;

async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined');
    throw new Error('MONGO_URI environment variable is required');
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    isConnected = false;
    throw error;
  }
}

// Wrapper function to handle errors gracefully
async function initializeApp() {
  try {
    // Connect to database on cold start
    await connectToDatabase();

    // Import app after database connection
    const { default: app } = await import('../src/app.js');

    console.log('✅ App initialized successfully');
    return app;
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);

    // Return a minimal error-handling Express app
    const express = (await import('express')).default;
    const errorApp = express();

    errorApp.use((req, res) => {
      res.status(500).json({
        success: false,
        message: 'Server initialization failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    });

    return errorApp;
  }
}

// Export the initialized app
export default await initializeApp();
