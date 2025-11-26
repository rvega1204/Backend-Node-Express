/**
 * Auth Middleware Unit Tests
 * 
 * Comprehensive test suite for JWT authentication middleware logic.
 * Tests cover token validation, error handling, edge cases, and database interactions.
 * 
 * @fileoverview Tests for verifyToken middleware function
 * @version 3.0
 * 
 * Test Coverage:
 * - Valid authentication with Bearer tokens
 * - Missing or invalid authorization headers
 * - Invalid and expired JWT tokens
 * - User existence verification in database
 * - Edge cases (extra spaces, case sensitivity)
 * - Database error handling
 * - Token expiration scenarios
 * 
 * Dependencies:
 * - jsonwebtoken: For JWT token generation and verification
 * - jest: Testing framework with mocking capabilities
 * 
 * Environment:
 * - JWT_SECRET: Secret key for signing tokens (defaults to 'test-secret-key')
 * 
 * Mock Objects:
 * - req: Mock Express request object with headers
 * - res: Mock Express response object with status() and json() methods
 * - next: Mock Express next middleware function
 * - User: Mock User model with findById() method
 * 
 * @function verifyToken
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.authorization - Authorization header with Bearer token
 * @param {Object} res - Express response object
 * @param {Function} res.status - Sets HTTP status code
 * @param {Function} res.json - Sends JSON response
 * @param {Function} next - Calls next middleware on success
 * @returns {Promise<void>}
 * @throws {TokenExpiredError} When JWT token has expired
 * @throws {JsonWebTokenError} When JWT token is invalid or malformed
 * @throws {Error} Other unexpected errors during user lookup
 * 
 * Response Codes:
 * - 401: Unauthorized (missing token, invalid token, expired token, user not found)
 * - 500: Internal server error (database or unexpected errors)
 * 
 * Success Behavior:
 * - Attaches authenticated user object to req.user
 * - Calls next() middleware function
 */
const jwt = require('jsonwebtoken');

describe('Auth Middleware Logic', () => {
  let req, res, next, User;
  const SECRET = process.env.JWT_SECRET || 'test-secret-key';

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();

    // Mock User model
    User = {
      findById: jest.fn(),
    };

    jest.clearAllMocks();
  });

  const verifyToken = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access token required' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, SECRET);

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }

      console.error('Auth middleware error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  describe('Valid Authentication', () => {
    it('should authenticate with valid Bearer token', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
      };

      const token = jwt.sign({ id: 'user123' }, SECRET);
      req.headers.authorization = `Bearer ${token}`;
      User.findById.mockResolvedValue(mockUser);

      await verifyToken(req, res, next);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should attach complete user object to request', async () => {
      const mockUser = {
        _id: 'user456',
        username: 'john',
        email: 'john@example.com',
        role: 'admin',
      };

      const token = jwt.sign({ id: 'user456' }, SECRET);
      req.headers.authorization = `Bearer ${token}`;
      User.findById.mockResolvedValue(mockUser);

      await verifyToken(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(req.user.role).toBe('admin');
    });
  });

  describe('Missing or Invalid Headers', () => {
    it('should reject request without authorization header', async () => {
      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access token required',
      });
      expect(next).not.toHaveBeenCalled();
      expect(User.findById).not.toHaveBeenCalled();
    });

    it('should reject empty authorization header', async () => {
      req.headers.authorization = '';

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access token required',
      });
    });

    it('should reject header without Bearer prefix', async () => {
      const token = jwt.sign({ id: 'user123' }, SECRET);
      req.headers.authorization = token; // Missing "Bearer "

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access token required',
      });
    });

    it('should reject authorization header without token', async () => {
      req.headers.authorization = 'Bearer ';

      await verifyToken(req, res, next);

      // Empty string causes jwt.verify to throw JsonWebTokenError
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid token',
      });
    });
  });

  describe('Invalid Tokens', () => {
    it('should reject completely invalid token', async () => {
      req.headers.authorization = 'Bearer invalid-token-string';

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid token',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject token signed with wrong secret', async () => {
      const token = jwt.sign({ id: 'user123' }, 'wrong-secret-key');
      req.headers.authorization = `Bearer ${token}`;

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid token',
      });
    });

    it('should reject expired token', async () => {
      const expiredToken = jwt.sign({ id: 'user123' }, SECRET, {
        expiresIn: '-1h',
      });
      req.headers.authorization = `Bearer ${expiredToken}`;

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token expired',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('User Not Found', () => {
    it('should reject if user does not exist in database', async () => {
      const token = jwt.sign({ id: 'nonexistent-user' }, SECRET);
      req.headers.authorization = `Bearer ${token}`;
      User.findById.mockResolvedValue(null); // User not found

      await verifyToken(req, res, next);

      expect(User.findById).toHaveBeenCalledWith('nonexistent-user');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle extra spaces in header', async () => {
      const token = jwt.sign({ id: 'user123' }, SECRET);
      req.headers.authorization = `Bearer  ${token}`; // Double space

      await verifyToken(req, res, next);

      // IMPORTANT: With "Bearer  token" (double space):
      // split(' ')[1] returns '' (empty string)
      // jwt.verify('') throws JsonWebTokenError
      // Middleware catches it and returns 401 "Invalid token"
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid token',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should be case-sensitive with Bearer prefix', async () => {
      const token = jwt.sign({ id: 'user123' }, SECRET);
      req.headers.authorization = `bearer ${token}`; 

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access token required',
      });
    });

    it('should not modify request if authentication fails', async () => {
      req.headers.authorization = 'Bearer invalid';

      await verifyToken(req, res, next);

      expect(req.user).toBeUndefined();
    });
  });

  describe('Database Errors', () => {
  it('should handle database errors gracefully', async () => {
    // Temporarily silence console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const token = jwt.sign({ id: 'user123' }, SECRET);
    req.headers.authorization = `Bearer ${token}`;
    User.findById.mockRejectedValue(new Error('Database connection failed'));

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal server error',
    });
    
    // Restore console.error
    consoleSpy.mockRestore();
  });
});

  describe('Token Expiration', () => {
    it('should accept freshly created token', async () => {
      const mockUser = { _id: 'user123', username: 'test' };
      const token = jwt.sign({ id: 'user123' }, SECRET, { expiresIn: '1h' });
      req.headers.authorization = `Bearer ${token}`;
      User.findById.mockResolvedValue(mockUser);

      await verifyToken(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should reject token expired by 1 second', async () => {
      const token = jwt.sign({ id: 'user123' }, SECRET, { expiresIn: '-1s' });
      req.headers.authorization = `Bearer ${token}`;

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token expired',
      });
    });
  });
});