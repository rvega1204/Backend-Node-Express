/**
 * @module DataTransformationUtils
 * 
 * This module contains utility functions for data transformation and sanitization.
 * 
 * @function sanitizePost
 * @param {Object} postData - The post data to sanitize.
 * @returns {Object} The sanitized post data with trimmed strings and a numeric age.
 * 
 * @function sanitizeUser
 * @param {Object} userData - The user data to sanitize.
 * @returns {Object} The sanitized user data with trimmed and lowercased username and email.
 * 
 * @function removeUndefined
 * @param {Object} obj - The object from which to remove undefined properties.
 * @returns {Object} A new object without undefined properties.
 * 
 * @function pickFields
 * @param {Object} obj - The object from which to pick fields.
 * @param {Array<string>} fields - The fields to pick from the object.
 * @returns {Object} A new object containing only the specified fields.
 * 
 * @function omitFields
 * @param {Object} obj - The object from which to omit fields.
 * @param {Array<string>} fields - The fields to omit from the object.
 * @returns {Object} A new object without the omitted fields.
 * 
 * @function formatPostResponse
 * @param {Object} post - The post object to format for response.
 * @returns {Object} The formatted post response object.
 * 
 * @function formatUserResponse
 * @param {Object} user - The user object to format for response.
 * @returns {Object} The formatted user response object.
 */

/**
 * @module StringUtilities
 * 
 * This module contains utility functions for string manipulation.
 * 
 * @function truncate
 * @param {string} str - The string to truncate.
 * @param {number} length - The maximum length of the truncated string.
 * @returns {string} The truncated string with '...' appended if it exceeds the length.
 * 
 * @function capitalize
 * @param {string} str - The string to capitalize.
 * @returns {string} The string with the first letter capitalized and the rest lowercased.
 * 
 * @function slugify
 * @param {string} str - The string to convert into a URL-friendly slug.
 * @returns {string} The slugified version of the string.
 */
describe('Data Transformation Utils', () => {
  const dataUtils = {
    sanitizePost: (postData) => {
      return {
        name: postData.name?.trim() || '',
        description: postData.description?.trim() || '',
        age: typeof postData.age === 'number' ? postData.age : parseInt(postData.age) || 0,
      };
    },

    sanitizeUser: (userData) => {
      return {
        username: userData.username?.trim().toLowerCase() || '',
        email: userData.email?.trim().toLowerCase() || '',
        password: userData.password,
      };
    },

    removeUndefined: (obj) => {
      const cleaned = {};
      for (const key in obj) {
        if (obj[key] !== undefined) {
          cleaned[key] = obj[key];
        }
      }
      return cleaned;
    },

    pickFields: (obj, fields) => {
      const picked = {};
      fields.forEach((field) => {
        if (obj[field] !== undefined) {
          picked[field] = obj[field];
        }
      });
      return picked;
    },

    omitFields: (obj, fields) => {
      const omitted = { ...obj };
      fields.forEach((field) => {
        delete omitted[field];
      });
      return omitted;
    },

    formatPostResponse: (post) => {
      return {
        id: post._id,
        name: post.name,
        description: post.description,
        age: post.age,
        createdAt: post.createdAt,
      };
    },

    formatUserResponse: (user) => {
      return {
        id: user._id,
        username: user.username,
        email: user.email,

      };
    },
  };

  describe('Post Sanitization', () => {
    it('should trim whitespace from strings', () => {
      const input = {
        name: '  Test Post  ',
        description: '  Description  ',
        age: 25,
      };

      const result = dataUtils.sanitizePost(input);

      expect(result.name).toBe('Test Post');
      expect(result.description).toBe('Description');
    });

    it('should handle missing fields', () => {
      const input = {};
      const result = dataUtils.sanitizePost(input);

      expect(result.name).toBe('');
      expect(result.description).toBe('');
      expect(result.age).toBe(0);
    });

    it('should convert string age to number', () => {
      const input = {
        name: 'Test',
        age: '25',
      };

      const result = dataUtils.sanitizePost(input);

      expect(result.age).toBe(25);
      expect(typeof result.age).toBe('number');
    });

    it('should handle invalid age', () => {
      const input = {
        name: 'Test',
        age: 'invalid',
      };

      const result = dataUtils.sanitizePost(input);

      expect(result.age).toBe(0);
    });

    it('should keep numeric age as is', () => {
      const input = {
        name: 'Test',
        age: 30,
      };

      const result = dataUtils.sanitizePost(input);

      expect(result.age).toBe(30);
    });
  });

  describe('User Sanitization', () => {
    it('should lowercase email', () => {
      const input = {
        email: 'TEST@EXAMPLE.COM',
        username: 'TestUser',
        password: 'secret',
      };

      const result = dataUtils.sanitizeUser(input);

      expect(result.email).toBe('test@example.com');
    });

    it('should lowercase username', () => {
      const input = {
        email: 'test@example.com',
        username: 'TestUser',
        password: 'secret',
      };

      const result = dataUtils.sanitizeUser(input);

      expect(result.username).toBe('testuser');
    });

    it('should trim email and username', () => {
      const input = {
        email: '  test@example.com  ',
        username: '  testuser  ',
        password: 'secret',
      };

      const result = dataUtils.sanitizeUser(input);

      expect(result.email).toBe('test@example.com');
      expect(result.username).toBe('testuser');
    });

    it('should not modify password', () => {
      const password = 'MyS3cur3P@ss';
      const input = {
        email: 'test@example.com',
        username: 'testuser',
        password,
      };

      const result = dataUtils.sanitizeUser(input);

      expect(result.password).toBe(password);
    });
  });

  describe('Remove Undefined', () => {
    it('should remove undefined values', () => {
      const input = {
        name: 'Test',
        description: undefined,
        age: 25,
        extra: undefined,
      };

      const result = dataUtils.removeUndefined(input);

      expect(result).toEqual({
        name: 'Test',
        age: 25,
      });
      expect(result.description).toBeUndefined();
    });

    it('should keep null values', () => {
      const input = {
        name: 'Test',
        description: null,
      };

      const result = dataUtils.removeUndefined(input);

      expect(result.description).toBe(null);
    });

    it('should keep empty strings', () => {
      const input = {
        name: '',
        age: 0,
      };

      const result = dataUtils.removeUndefined(input);

      expect(result.name).toBe('');
      expect(result.age).toBe(0);
    });
  });

  describe('Pick Fields', () => {
    it('should pick specified fields', () => {
      const input = {
        name: 'Test',
        description: 'Desc',
        age: 25,
        extra: 'Remove this',
      };

      const result = dataUtils.pickFields(input, ['name', 'age']);

      expect(result).toEqual({
        name: 'Test',
        age: 25,
      });
    });

    it('should ignore non-existent fields', () => {
      const input = {
        name: 'Test',
      };

      const result = dataUtils.pickFields(input, ['name', 'nonexistent']);

      expect(result).toEqual({
        name: 'Test',
      });
    });

    it('should handle empty fields array', () => {
      const input = {
        name: 'Test',
        age: 25,
      };

      const result = dataUtils.pickFields(input, []);

      expect(result).toEqual({});
    });
  });

  describe('Omit Fields', () => {
    it('should omit specified fields', () => {
      const input = {
        name: 'Test',
        password: 'secret',
        email: 'test@example.com',
      };

      const result = dataUtils.omitFields(input, ['password']);

      expect(result).toEqual({
        name: 'Test',
        email: 'test@example.com',
      });
      expect(result.password).toBeUndefined();
    });

    it('should omit multiple fields', () => {
      const input = {
        name: 'Test',
        password: 'secret',
        token: 'abc123',
        email: 'test@example.com',
      };

      const result = dataUtils.omitFields(input, ['password', 'token']);

      expect(result).toEqual({
        name: 'Test',
        email: 'test@example.com',
      });
    });

    it('should handle omitting non-existent fields', () => {
      const input = {
        name: 'Test',
      };

      const result = dataUtils.omitFields(input, ['nonexistent']);

      expect(result).toEqual({
        name: 'Test',
      });
    });
  });

  describe('Format Responses', () => {
    it('should format post for response', () => {
      const post = {
        _id: '123',
        name: 'Test Post',
        description: 'Desc',
        age: 25,
        createdAt: '2024-01-01',
        __v: 0,
      };

      const result = dataUtils.formatPostResponse(post);

      expect(result).toEqual({
        id: '123',
        name: 'Test Post',
        description: 'Desc',
        age: 25,
        createdAt: '2024-01-01',
      });
      expect(result.__v).toBeUndefined();
    });

    it('should format user for response', () => {
      const user = {
        _id: '456',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed-password',
        __v: 0,
      };

      const result = dataUtils.formatUserResponse(user);

      expect(result).toEqual({
        id: '456',
        username: 'testuser',
        email: 'test@example.com',
      });
      expect(result.password).toBeUndefined();
    });
  });
});

describe('String Utilities', () => {
  const stringUtils = {
    truncate: (str, length) => {
      if (str.length <= length) return str;
      return str.substring(0, length) + '...';
    },

    capitalize: (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    slugify: (str) => {
      return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    },
  };

  describe('Truncate', () => {
    it('should truncate long strings', () => {
      const result = stringUtils.truncate('This is a long string', 10);
      expect(result).toBe('This is a ...');
    });

    it('should not truncate short strings', () => {
      const result = stringUtils.truncate('Short', 10);
      expect(result).toBe('Short');
    });

    it('should handle exact length', () => {
      const result = stringUtils.truncate('Exact', 5);
      expect(result).toBe('Exact');
    });
  });

  describe('Capitalize', () => {
    it('should capitalize first letter', () => {
      expect(stringUtils.capitalize('hello')).toBe('Hello');
    });

    it('should lowercase rest of string', () => {
      expect(stringUtils.capitalize('HELLO')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(stringUtils.capitalize('a')).toBe('A');
    });
  });

  describe('Slugify', () => {
    it('should create URL-friendly slug', () => {
      expect(stringUtils.slugify('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(stringUtils.slugify('Hello @World!')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(stringUtils.slugify('Hello    World')).toBe('hello-world');
    });

    it('should trim dashes', () => {
      expect(stringUtils.slugify('  Hello World  ')).toBe('hello-world');
    });
  });
});