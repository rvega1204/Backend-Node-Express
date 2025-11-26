/**
 * @module index
 * @description Entry point for the application. This module initializes environment variables,
 * connects to the database, and starts the server.
 * 
 * @function startServer
 * @async
 * @throws {Error} Throws an error if the server fails to start or if the database connection fails.
 * 
 * @example
 * // To start the server, simply call the startServer function.
 * startServer();
 */
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import app from './app.js';

dotenv.config({
    path: './.env'
});

const startServer = async () => {
    try {
        await connectDB();
        app.on("error", (error) => {
            console.error('Server error:', error);
            throw error;
        });

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();