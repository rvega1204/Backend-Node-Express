/**
 * @fileOverview Main application file for the Express server.
 * @module app
 * @requires express
 * @requires ./routes/user.route
 * @requires ./routes/post.route
 */

import express from 'express';
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';

/**
 * Initializes the Express application.
 * @constant {Object} app - The Express application instance.
 */

// Middleware to parse JSON request bodies
/**
 * Middleware to parse incoming JSON request bodies.
 * @function
 * @returns {void}
 */
app.use(express.json());

// API routes
/**
 * User-related routes.
 * @route {GET|POST|PUT|DELETE} /api/v1/users
 * @param {Object} userRouter - The router for user-related endpoints.
 */
app.use('/api/v1/users', userRouter);

/**
 * Post-related routes.
 * @route {GET|POST|PUT|DELETE} /api/v1/posts
 * @param {Object} postRouter - The router for post-related endpoints.
 */
app.use('/api/v1/posts', postRouter);

// Export app instance
/**
 * Exports the Express application instance for use in other modules.
 * @exports app
 */
export default app;