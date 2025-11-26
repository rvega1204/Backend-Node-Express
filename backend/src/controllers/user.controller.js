import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

/**
 * Generates a JWT token for the given user ID.
 * @param {string} userId - The user's MongoDB _id
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Register a new user.
 *
 * Validates incoming request body for username, password and email. If validation
 * passes, checks whether an existing user with the normalized (lowercased)
 * email already exists. If not, creates a new user document and returns
 * a JWT token along with basic user info.
 *
 * Response behavior:
 *  - 400 Bad Request: when username, password or email is missing
 *  - 409 Conflict: when an account with the normalized email already exists
 *  - 201 Created: when the user is created successfully (returns id, email, username, token)
 *  - 500 Internal Server Error: on unexpected errors
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const newUser = await User.create({
      username: username.toLowerCase().trim(),
      password,
      email: email.toLowerCase().trim(),
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Log in an existing user.
 *
 * Validates incoming request body for email and password. If validation
 * passes, attempts to find a user with the normalized (lowercased) email.
 * If found, compares the provided password with the stored hashed password.
 * If the password matches, returns a JWT token along with basic user info.
 *
 * Response behavior:
 *  - 400 Bad Request: when email or password is missing
 *  - 401 Unauthorized: when user is not found or password does not match
 *  - 200 OK: when login is successful (returns id, email, username, token)
 *  - 500 Internal Server Error: on unexpected errors
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/** Log out user (dummy implementation as JWT is stateless).
 * In a real-world scenario, you might handle token blacklisting or
 * implement short-lived tokens with refresh tokens.
 */
const logoutUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Get current user profile.
 * Requires authentication via verifyToken middleware.
 */
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
      },
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { registerUser, loginUser, getProfile, logoutUser };