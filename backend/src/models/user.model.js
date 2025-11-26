/**
 * User model schema for MongoDB using Mongoose.
 * 
 * @module User
 * 
 * @typedef {Object} User
 * @property {string} username - The unique username of the user. Required, must be lowercase and trimmed.
 * @property {string} email - The unique email address of the user. Required, must match a valid email format.
 * @property {string} password - The user's password. Required, must be at least 6 characters long and is not returned in queries by default.
 * @property {Date} createdAt - Timestamp of when the user was created. Automatically generated.
 * @property {Date} updatedAt - Timestamp of when the user was last updated. Automatically generated.
 * 
 * @function comparePassword
 * @param {string} candidatePassword - The password to compare with the user's stored password.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the passwords match, otherwise false.
 * 
 * @function pre-save hook
 * @description Hashes the password before saving the user to the database if the password is modified or if the user is new.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") && !this.isNew) return;

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;