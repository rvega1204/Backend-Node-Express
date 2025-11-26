/**
 * Connects to MongoDB database using Mongoose.
 * 
 * This function establishes an asynchronous connection to MongoDB using the
 * connection URI provided in the MONGODB_URI environment variable.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 * 
 * @throws {Error} If the MongoDB connection fails, logs the error and exits the process with code 1.
 * 
 * @example
 * // Import and call the function
 * import connectDB from './config/database.js';
 * await connectDB();
 * 
 * @description
 * - Attempts to connect to MongoDB using the MONGODB_URI environment variable
 * - Logs the connection host on successful connection
 * - Logs error details and terminates the process on connection failure
 */
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
