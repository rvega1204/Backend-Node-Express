/**
 * JWT Utilities Test Suite
 * 
 * Comprehensive test suite for JWT (JSON Web Token) operations including:
 * - Token creation and generation
 * - Token verification and validation
 * - Token decoding
 * - Token expiration handling
 * 
 * @requires jsonwebtoken - JWT library for signing and verifying tokens
 * 
 * @test {JWT} Token Creation - Validates JWT token generation with proper structure and payload
 * @test {JWT} Token Verification - Ensures tokens are verified correctly with appropriate secret keys
 * @test {JWT} Token Decoding - Tests token decoding without verification
 * @test {JWT} Token Expiration - Validates token expiration timestamps and calculations
 * 
 * @constant {string} SECRET - JWT secret key from environment or default test key
 * @constant {string} EXPIRED_SECRET - Legacy secret key for testing secret mismatch scenarios
 * 
 * @example
 * // Running the test suite
 * npm test -- Jwt.utils.test.js
 */
const jwt = require('jsonwebtoken');

describe('JWT Utilities', () => {
  const SECRET = process.env.JWT_SECRET || 'test-secret-key';
  const EXPIRED_SECRET = 'old-secret';

  describe('Token Creation', () => {
    it('should create a valid JWT token', () => {
      const payload = { id: 'user123', email: 'test@example.com' };
      const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include user data in token', () => {
      const payload = { id: 'user123', email: 'test@example.com' };
      const token = jwt.sign(payload, SECRET);

      const decoded = jwt.verify(token, SECRET);

      expect(decoded.id).toBe('user123');
      expect(decoded.email).toBe('test@example.com');
    });

    it('should create different tokens for different users', () => {
      const user1 = jwt.sign({ id: 'user1' }, SECRET);
      const user2 = jwt.sign({ id: 'user2' }, SECRET);

      expect(user1).not.toBe(user2);
    });
  });

  describe('Token Verification', () => {
    it('should verify valid token', () => {
      const payload = { id: 'user123' };
      const token = jwt.sign(payload, SECRET);

      const decoded = jwt.verify(token, SECRET);

      expect(decoded.id).toBe('user123');
    });

    it('should reject token with wrong secret', () => {
      const token = jwt.sign({ id: 'user123' }, 'wrong-secret');

      expect(() => {
        jwt.verify(token, SECRET);
      }).toThrow();
    });

    it('should reject malformed token', () => {
      expect(() => {
        jwt.verify('not-a-valid-token', SECRET);
      }).toThrow();
    });

    it('should reject expired token', () => {
      const token = jwt.sign({ id: 'user123' }, SECRET, { expiresIn: '-1h' });

      expect(() => {
        jwt.verify(token, SECRET);
      }).toThrow('jwt expired');
    });

    it('should accept non-expired token', () => {
      const token = jwt.sign({ id: 'user123' }, SECRET, { expiresIn: '1h' });

      expect(() => {
        jwt.verify(token, SECRET);
      }).not.toThrow();
    });
  });

  describe('Token Decoding', () => {
    it('should decode token without verification', () => {
      const payload = { id: 'user123', role: 'admin' };
      const token = jwt.sign(payload, SECRET);

      const decoded = jwt.decode(token);

      expect(decoded.id).toBe('user123');
      expect(decoded.role).toBe('admin');
    });

    it('should decode expired token (without verify)', () => {
      const payload = { id: 'user123' };
      const token = jwt.sign(payload, SECRET, { expiresIn: '-1h' });

      const decoded = jwt.decode(token);

      expect(decoded.id).toBe('user123');
    });
  });

  describe('Token Expiration', () => {
    it('should set expiration time', () => {
      const token = jwt.sign({ id: 'user123' }, SECRET, { expiresIn: '1h' });
      const decoded = jwt.decode(token);

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });

    it('should calculate correct expiration', () => {
      const now = Math.floor(Date.now() / 1000);
      const token = jwt.sign({ id: 'user123' }, SECRET, { expiresIn: '1h' });
      const decoded = jwt.decode(token);

      const oneHour = 60 * 60;
      expect(decoded.exp - decoded.iat).toBe(oneHour);
    });
  });
});