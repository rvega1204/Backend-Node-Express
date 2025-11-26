/**
 * Mongoose model schema for a "Post" document.
 *
 * @module models/post.model
 * @requires mongoose
 *
 * @typedef {Object} PostDocument
 * @property {string} _id - MongoDB ObjectId (string representation).
 * @property {string} name - Name for the post. Required. Trimmed. Maximum length 100 characters.
 * @property {string} description - Description for the post. Required. Trimmed.
 * @property {number} age - Age associated with the post. Required. Must be between 0 and 150.
 * @property {Date} createdAt - Creation timestamp (added automatically by schema timestamps).
 * @property {Date} updatedAt - Last update timestamp (added automatically by schema timestamps).
 *
 * @description
 * The Post schema enforces validation rules:
 * - name: required, trimmed, maxlength 100.
 * - description: required, trimmed.
 * - age: required, numeric, minimum 0, maximum 150.
 *
 * Schema options:
 * - timestamps: true (automatically adds createdAt and updatedAt).
 * - versionKey: false (disables the __v version field).
 *
 * @example
 * // Creating a new Post document
 * const post = new Post({
 *   name: 'John Doe',
 *   description: 'Sample description',
 *   age: 42
 * });
 * await post.save();
 *
 * @exports Post
 * Mongoose model created via mongoose.model('Post', postSchema)
 */
import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      max: [150, "Age seems unrealistic"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Post = mongoose.model("Post", postSchema);
