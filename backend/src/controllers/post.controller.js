/**
 * Controller for Post resource.
 * Provides CRUD operations and list retrieval with pagination, sorting, field projection and simple text search.
 * @module controllers/post.controller
 */

/**
 * Create a new Post.
 *
 * Expects body: { name: string, description: string, age: number }.
 * - Validates that name and description are strings and age is a number.
 * - Returns 201 with created post on success.
 * - Returns 400 for validation/missing fields.
 * - Returns 500 for internal server errors.
 *
 * @async
 * @param {import('express').Request} req - Express request object. Body must contain name, description, age.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with status code and message/post data.
 */

/**
 * Retrieve a paginated list of posts.
 *
 * Query parameters supported:
 * - page {number} (default: 1) — 1-based page number, normalized to >= 1
 * - limit {number} (default: 10, max: 100) — items per page
 * - sort {string} (default: "-createdAt") — mongoose sort string (e.g. "-createdAt,name")
 * - fields {string} — comma-separated fields to include (projection)
 * - q {string} — simple case-insensitive text search applied to name and description
 *
 * Response:
 * - 200 with JSON { data: [...], meta: { total, count, page, pages, limit } }
 * - 500 for internal server errors.
 *
 * Notes:
 * - Uses lean() for faster read-only queries.
 * - total is computed with the same filter used for the data query.
 *
 * @async
 * @param {import('express').Request} req - Express request object. Query contains pagination/sort/fields/q.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends JSON response containing data array and meta information.
 */

/**
 * Update an existing Post by id.
 *
 * Path params:
 * - id {string} — the Post _id to update
 *
 * Body may contain any subset of: { name?: string, description?: string, age?: number }.
 * - If body is empty, returns 400.
 * - Validates provided fields' types (name & description must be strings, age must be a number).
 * - Uses findByIdAndUpdate with { new: true, runValidators: true } to return the updated document and apply schema validators.
 * - Returns 200 with updated post on success.
 * - Returns 404 if post not found.
 * - Returns 400 for invalid input.
 * - Returns 500 for internal server errors.
 *
 * @async
 * @param {import('express').Request} req - Express request object. Params.id is required. Body contains update fields.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with status and updated post or error message.
 */

/**
 * Delete a Post by id.
 *
 * Path params:
 * - id {string} — the Post _id to delete
 *
 * Behavior:
 * - Attempts to delete the document using findByIdAndDelete.
 * - Returns 200 with the deleted document on success.
 * - Returns 404 if post not found.
 * - Returns 500 for internal server errors.
 *
 * @async
 * @param {import('express').Request} req - Express request object. Params.id required.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends JSON response confirming deletion or error message.
 */

/**
 * Get a single Post by id.
 *
 * Path params:
 * - id {string} — the Post _id to fetch
 *
 * Behavior:
 * - Uses findById().lean() to retrieve a plain JS object.
 * - Returns 200 with { post } when found.
 * - Returns 404 if post not found.
 * - Returns 500 for internal server errors.
 *
 * @async
 * @param {import('express').Request} req - Express request object. Params.id required.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends JSON response with the found post or an error message.
 */
import { Post } from "../models/post.model.js";

const createPost = async (req, res) => {
  try {
    const { name, description, age } = req.body;
    // Check if all required fields are provided
    if (!name || !description || age === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate data types
    if (typeof name !== 'string' || typeof description !== 'string' || typeof age !== 'number') {
      return res.status(400).json({ message: "Invalid data types" });
    }

    // Create a new post in the database
    const newPost = await Post.create({ name, description, age });
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    // Query params: page, limit, sort (e.g. -createdAt,name), fields (comma separated), q (search)
    let { page = 1, limit = 10, sort = "-createdAt", fields, q } = req.query;
    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100); // cap to 100
    const skip = (page - 1) * limit;

    const projection = fields ? fields.split(",").join(" ") : "";
    const filter = {};
    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }

    const [total, posts] = await Promise.all([
      Post.countDocuments(filter),
      Post.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(projection)
        .lean(),
    ]);

    const pages = Math.max(Math.ceil(total / limit), 1);
    res.status(200).json({
      data: posts,
      meta: {
        total,
        count: posts.length,
        page,
        pages,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  try {
    if (!Object.keys(req.body).length) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    const { id } = req.params;
    const { name, description, age } = req.body;

    // Validate data types
    if (name && typeof name !== 'string') {
      return res.status(400).json({ message: "Invalid data type for name" });
    }
    if (description && typeof description !== 'string') {
      return res.status(400).json({ message: "Invalid data type for description" });
    }
    if (age !== undefined && typeof age !== 'number') {
      return res.status(400).json({ message: "Invalid data type for age" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { name, description, age },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ 
      message: "Post deleted successfully",
      post: deletedPost 
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).lean();
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createPost, getAllPosts, updatePost, deletePost, getPostById };
