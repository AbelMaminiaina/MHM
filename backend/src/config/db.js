import mongoose from 'mongoose';
import config from './env.js';

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      // Remove deprecated options (no longer needed in Mongoose 6+)
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err.message}`);
});

export default connectDB;
