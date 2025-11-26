/**
 * Router: / (exported as default)
 *
 * This router defines endpoints for managing "posts". Each route is protected
 * by the verifyToken middleware which should validate the user and attach
 * authentication info to the request (e.g., req.user).
 *
 * Routes:
 *
 * POST /create
 *   - Description: Create a new post.
 *   - Middleware: verifyToken (requires authenticated user)
 *   - Request Body: { title: string, content: string, ... } (controller should validate)
 *   - Controller: createPost
 *   - Typical Responses:
 *       201 - Created: returns created post object
 *       400 - Bad Request: validation or missing fields
 *       401 - Unauthorized: token missing/invalid
 *
 * GET /getPosts
 *   - Description: Retrieve a list of posts (may be scoped to the authenticated user
 *                  depending on controller implementation).
 *   - Middleware: verifyToken
 *   - Query Parameters: optional pagination/filter params (e.g., page, limit)
 *   - Controller: getAllPosts
 *   - Typical Responses:
 *       200 - OK: returns an array of post objects
 *       401 - Unauthorized
 *
 * GET /getPost/:id
 *   - Description: Retrieve a single post by ID.
 *   - Middleware: verifyToken
 *   - URL Params:
 *       id (string) - ID of the post to retrieve
 *   - Controller: getPostById
 *   - Typical Responses:
 *       200 - OK: returns the requested post object
 *       404 - Not Found: post with given id does not exist
 *       401 - Unauthorized
 *
 * PATCH /update/:id
 *   - Description: Update an existing post (partial updates supported).
 *   - Middleware: verifyToken
 *   - URL Params:
 *       id (string) - ID of the post to update
 *   - Request Body: partial post object with fields to update (e.g., { title, content })
 *   - Controller: updatePost
 *   - Typical Responses:
 *       200 - OK: returns the updated post object
 *       400 - Bad Request: invalid update data
 *       404 - Not Found: post not found
 *       401 - Unauthorized
 *
 * DELETE /delete/:id
 *   - Description: Delete a post by ID.
 *   - Middleware: verifyToken
 *   - URL Params:
 *       id (string) - ID of the post to delete
 *   - Controller: deletePost
 *   - Typical Responses:
 *       204 - No Content: deletion successful
 *       404 - Not Found: post not found
 *       401 - Unauthorized
 *
 * Usage:
 *   - Import and mount in your Express app, for example:
 *       app.use('/posts', postRouter);
 *
 * Implementation notes:
 *   - Controllers referenced here (createPost, getAllPosts, getPostById, updatePost, deletePost)
 *     are responsible for input validation, business logic, and sending appropriate responses.
 *   - verifyToken middleware is expected to handle authentication errors and populate req.user.
 */
import { Router } from "express";
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "../controllers/post.controller.js";
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/create', verifyToken, createPost);
router.get('/getPosts', verifyToken, getAllPosts);
router.get('/getPost/:id', verifyToken, getPostById);
router.patch('/update/:id', verifyToken, updatePost);
router.delete('/delete/:id', verifyToken, deletePost);

export default router;