/**
 * Express router defining user authentication and profile routes.
 *
 * @module routes/user.route
 *
 * @requires express.Router
 * @requires ../controllers/user.controller.js
 * @requires ../middlewares/auth.middleware.js
 *
 * Public routes:
 * - POST /register
 *   - Controller: registerUser
 *   - Purpose: Register a new user.
 *   - Expected input: JSON body (e.g., { name, email, password }).
 *   - Response: Created user data or error (validation, duplicate email, etc.).
 *
 * - POST /login
 *   - Controller: loginUser
 *   - Purpose: Authenticate a user and issue a session/token.
 *   - Expected input: JSON body (e.g., { email, password }).
 *   - Response: Authentication token (e.g., JWT in cookie or body) or error.
 *
 * - POST /logout
 *   - Controller: logoutUser
 *   - Purpose: Invalidate user session / clear authentication token.
 *   - Expected input: (may use cookies or auth header depending on implementation).
 *   - Response: Success confirmation or error.
 *
 * Protected route:
 * - GET /profile
 *   - Middleware: verifyToken
 *   - Controller: getProfile
 *   - Purpose: Return the authenticated user's profile.
 *   - Behavior: verifyToken validates the JWT (or other auth) and attaches user info to req;
 *               getProfile reads req.user and returns profile data.
 *
 * Export:
 * @returns {import('express').Router} Configured Express router with the above routes.
 */
import { Router } from 'express';
import { loginUser, registerUser, getProfile, logoutUser } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected route
router.get('/profile', verifyToken, getProfile);

export default router;