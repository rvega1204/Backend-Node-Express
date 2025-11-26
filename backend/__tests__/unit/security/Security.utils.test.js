
/**
 * Security Utils Test Suite
 * 
 * Comprehensive test suite for security utilities including:
 * - Password hashing and comparison using bcryptjs
 * - Password strength validation with multiple criteria
 * - Input sanitization and XSS prevention
 * - HTML escaping for safe output
 * - Email validation and sanitization
 * - Rate limiting logic to prevent abuse
 * 
 * @module Security.utils.test
 * @requires bcryptjs - For secure password hashing
 * 
 * @description
 * Tests cover critical security functions:
 * 1. Password Security - Ensures passwords are properly hashed with bcrypt
 *    and validates strength requirements (length, uppercase, lowercase, numbers, special chars)
 * 2. Input Sanitization - Prevents XSS attacks through HTML escaping and script removal
 * 3. Email Validation - Validates email format and sanitizes input
 * 4. Rate Limiting - Prevents brute force attacks by limiting requests per time window
 * 
 * @example
 * // Password validation example
 * const result = passwordUtils.validateStrength('MyPassword123!');
 * // Returns: { isValid: true, errors: [] }
 * 
 * @example
 * // XSS prevention example
 * const sanitized = sanitizer.removeXSS('<script>alert("XSS")</script>');
 * // Returns: ''
 * 
 * @example
 * // Rate limiting example
 * const limiter = new RateLimiter(5, 60000); // 5 requests per minute
 * if (limiter.isAllowed('userId')) {
 *   // Process request
 * }
 */
const bcrypt = require('bcryptjs');

describe('Password Security', () => {
  const passwordUtils = {
    hash: async (password) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    },

    compare: async (password, hash) => {
      return bcrypt.compare(password, hash);
    },

    validateStrength: (password) => {
      const errors = [];

      if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
      }

      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }

      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }

      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
      }

      if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain at least one special character');
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
  };

  describe('Password Hashing', () => {
    it('should hash password', async () => {
      const password = 'MySecurePassword123!';
      const hash = await passwordUtils.hash(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should create different hashes for same password', async () => {
      const password = 'SamePassword123!';
      const hash1 = await passwordUtils.hash(password);
      const hash2 = await passwordUtils.hash(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should hash long passwords', async () => {
      const longPassword = 'a'.repeat(100) + 'A1!';
      const hash = await passwordUtils.hash(longPassword);

      expect(hash).toBeDefined();
    });
  });

  describe('Password Comparison', () => {
    it('should verify correct password', async () => {
      const password = 'CorrectPassword123!';
      const hash = await passwordUtils.hash(password);

      const isMatch = await passwordUtils.compare(password, hash);

      expect(isMatch).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'CorrectPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hash = await passwordUtils.hash(password);

      const isMatch = await passwordUtils.compare(wrongPassword, hash);

      expect(isMatch).toBe(false);
    });

    it('should be case sensitive', async () => {
      const password = 'Password123!';
      const hash = await passwordUtils.hash(password);

      const isMatch = await passwordUtils.compare('password123!', hash);

      expect(isMatch).toBe(false);
    });

    it('should reject empty password', async () => {
      const password = 'ValidPassword123!';
      const hash = await passwordUtils.hash(password);

      const isMatch = await passwordUtils.compare('', hash);

      expect(isMatch).toBe(false);
    });
  });

  describe('Password Strength Validation', () => {
    it('should accept strong password', () => {
      const password = 'StrongP@ss123';
      const result = passwordUtils.validateStrength(password);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short password', () => {
      const password = 'Short1!';
      const result = passwordUtils.validateStrength(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters');
    });

    it('should require uppercase letter', () => {
      const password = 'lowercase123!';
      const result = passwordUtils.validateStrength(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Password must contain at least one uppercase letter'
      );
    });

    it('should require lowercase letter', () => {
      const password = 'UPPERCASE123!';
      const result = passwordUtils.validateStrength(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Password must contain at least one lowercase letter'
      );
    });

    it('should require number', () => {
      const password = 'NoNumbers!';
      const result = passwordUtils.validateStrength(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should require special character', () => {
      const password = 'NoSpecial123';
      const result = passwordUtils.validateStrength(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Password must contain at least one special character'
      );
    });

    it('should return multiple errors', () => {
      const password = 'weak';
      const result = passwordUtils.validateStrength(password);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(2);
    });
  });
});

describe('Input Sanitization', () => {
  const sanitizer = {
    escapeHtml: (str) => {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
      };
      return str.replace(/[&<>"'/]/g, (char) => map[char]);
    },

    removeXSS: (str) => {
      return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/onerror=/gi, '')
        .replace(/onclick=/gi, '');
    },

    sanitizeEmail: (email) => {
      return email.toLowerCase().trim();
    },

    isValidEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
  };

  describe('HTML Escaping', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const result = sanitizer.escapeHtml(input);

      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('should escape quotes', () => {
      const input = 'He said "hello"';
      const result = sanitizer.escapeHtml(input);

      expect(result).toContain('&quot;');
    });

    it('should escape ampersands', () => {
      const input = 'Tom & Jerry';
      const result = sanitizer.escapeHtml(input);

      expect(result).toBe('Tom &amp; Jerry');
    });
  });

  describe('XSS Prevention', () => {
    it('should remove script tags', () => {
      const input = 'Hello <script>alert("XSS")</script> World';
      const result = sanitizer.removeXSS(input);

      expect(result).not.toContain('<script>');
      expect(result).toBe('Hello  World');
    });

    it('should remove javascript: protocol', () => {
      const input = '<a href="javascript:alert()">Click</a>';
      const result = sanitizer.removeXSS(input);

      expect(result).not.toContain('javascript:');
    });

    it('should remove event handlers', () => {
      const input = '<img onerror="alert()" onclick="hack()">';
      const result = sanitizer.removeXSS(input);

      expect(result).not.toContain('onerror=');
      expect(result).not.toContain('onclick=');
    });
  });

  describe('Email Validation', () => {
    it('should validate correct email', () => {
      expect(sanitizer.isValidEmail('test@example.com')).toBe(true);
      expect(sanitizer.isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(sanitizer.isValidEmail('invalid')).toBe(false);
      expect(sanitizer.isValidEmail('invalid@')).toBe(false);
      expect(sanitizer.isValidEmail('@domain.com')).toBe(false);
      expect(sanitizer.isValidEmail('test@.com')).toBe(false);
    });

    it('should sanitize email', () => {
      const email = '  TEST@EXAMPLE.COM  ';
      const result = sanitizer.sanitizeEmail(email);

      expect(result).toBe('test@example.com');
    });
  });
});

describe('Rate Limiting Logic', () => {
  class RateLimiter {
    constructor(maxRequests, windowMs) {
      this.maxRequests = maxRequests;
      this.windowMs = windowMs;
      this.requests = new Map();
    }

    isAllowed(identifier) {
      const now = Date.now();
      const userRequests = this.requests.get(identifier) || [];

      const validRequests = userRequests.filter(
        (timestamp) => now - timestamp < this.windowMs
      );

      if (validRequests.length >= this.maxRequests) {
        return false;
      }

      validRequests.push(now);
      this.requests.set(identifier, validRequests);
      return true;
    }

    reset(identifier) {
      this.requests.delete(identifier);
    }
  }

  it('should allow requests under limit', () => {
    const limiter = new RateLimiter(3, 1000);

    expect(limiter.isAllowed('user1')).toBe(true);
    expect(limiter.isAllowed('user1')).toBe(true);
    expect(limiter.isAllowed('user1')).toBe(true);
  });

  it('should block requests over limit', () => {
    const limiter = new RateLimiter(2, 1000);

    limiter.isAllowed('user1');
    limiter.isAllowed('user1');

    expect(limiter.isAllowed('user1')).toBe(false);
  });

  it('should track different users separately', () => {
    const limiter = new RateLimiter(2, 1000);

    limiter.isAllowed('user1');
    limiter.isAllowed('user1');
    
    expect(limiter.isAllowed('user2')).toBe(true);
  });

  it('should reset after window expires', async () => {
    const limiter = new RateLimiter(2, 100); // 100ms window

    limiter.isAllowed('user1');
    limiter.isAllowed('user1');
    
    expect(limiter.isAllowed('user1')).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(limiter.isAllowed('user1')).toBe(true);
  }, 10000);
});