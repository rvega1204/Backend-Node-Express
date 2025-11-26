
/**
 * @module validationTests
 * @description Unit tests for validating post and user data.
 */

/**
 * @function validatePost
 * @param {Object} postData - The post data to validate.
 * @param {string} postData.name - The name of the post.
 * @param {number} [postData.age] - The age associated with the post.
 * @returns {Object} Validation result containing:
 * @returns {boolean} isValid - Indicates if the post data is valid.
 * @returns {Array<string>} errors - List of validation error messages.
 */

/**
 * @function validateUser
 * @param {Object} userData - The user data to validate.
 * @param {string} userData.email - The email of the user.
 * @param {string} userData.password - The password of the user.
 * @param {string} userData.username - The username of the user.
 * @returns {Object} Validation result containing:
 * @returns {boolean} isValid - Indicates if the user data is valid.
 * @returns {Array<string>} errors - List of validation error messages.
 */

/**
 * @describe Post Data Validation
 * @description Tests for validating post data including required fields, name and age field validation, and handling multiple errors.
 */

/**
 * @describe User Data Validation
 * @description Tests for validating user data including email format, password length, and username length.
 */
describe('Post Data Validation', () => {
  const validatePost = (postData) => {
    const errors = [];

    if (!postData.name || postData.name.trim() === '') {
      errors.push('Name is required');
    }

    if (postData.name && postData.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }

    if (postData.age && typeof postData.age !== 'number') {
      errors.push('Age must be a number');
    }

    if (postData.age && postData.age < 0) {
      errors.push('Age must be positive');
    }

    // Check if age is greater than 150 and add an error if it is
    if (postData.age && postData.age > 150) {
      errors.push('Age must be realistic');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  describe('Required Fields', () => {
    it('should require name field', () => {
      const post = { description: 'Test', age: 25 };
      const result = validatePost(post);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required');
    });

    it('should accept post with name', () => {
      const post = { name: 'Valid Post', age: 25 };
      const result = validatePost(post);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty name', () => {
      const post = { name: '', age: 25 };
      const result = validatePost(post);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required');
    });

    it('should reject name with only spaces', () => {
      const post = { name: '   ', age: 25 };
      const result = validatePost(post);

      expect(result.isValid).toBe(false);
    });
  });

  describe('Name Field Validation', () => {
    it('should accept valid name', () => {
      const post = { name: 'Valid Post Name' };
      const result = validatePost(post);

      expect(result.isValid).toBe(true);
    });

    it('should reject name over 100 characters', () => {
      const longName = 'a'.repeat(101);
      const post = { name: longName };
      const result = validatePost(post);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name must be less than 100 characters');
    });

    it('should accept name with exactly 100 characters', () => {
      const name = 'a'.repeat(100);
      const post = { name };
      const result = validatePost(post);

      expect(result.isValid).toBe(true);
    });
  });

  describe('Age Field Validation', () => {
    it('should accept valid age', () => {
      const post = { name: 'Test', age: 25 };
      const result = validatePost(post);

      expect(result.isValid).toBe(true);
    });

    it('should reject negative age', () => {
      const post = { name: 'Test', age: -5 };
      const result = validatePost(post);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Age must be positive');
    });

    it('should reject age over 150', () => {
      const post = { name: 'Test', age: 200 };
      const result = validatePost(post);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Age must be realistic');
    });

    it('should reject non-numeric age', () => {
      const post = { name: 'Test', age: '25' };
      const result = validatePost(post);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Age must be a number');
    });

    it('should accept zero age', () => {
      const post = { name: 'Test', age: 0 };
      const result = validatePost(post);

      expect(result.isValid).toBe(true);
    });

    it('should accept age boundary values', () => {
      const post1 = { name: 'Test', age: 0 };
      const post2 = { name: 'Test', age: 150 };

      expect(validatePost(post1).isValid).toBe(true);
      expect(validatePost(post2).isValid).toBe(true);
    });
  });

  describe('Multiple Errors', () => {
    it('should return all validation errors', () => {
      const post = { name: '', age: -5 };
      const result = validatePost(post);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    it('should validate all fields independently', () => {
      const post = { name: 'a'.repeat(101), age: 200 };
      const result = validatePost(post);

      expect(result.errors).toContain('Name must be less than 100 characters');
      expect(result.errors).toContain('Age must be realistic');
    });
  });

  describe('Optional Fields', () => {
    it('should accept post without age', () => {
      const post = { name: 'Test Post' };
      const result = validatePost(post);

      expect(result.isValid).toBe(true);
    });

    it('should accept post without description', () => {
      const post = { name: 'Test', age: 25 };
      const result = validatePost(post);

      expect(result.isValid).toBe(true);
    });
  });
});

describe('User Data Validation', () => {
  const validateUser = (userData) => {
    const errors = [];

    if (!userData.email || !userData.email.includes('@')) {
      errors.push('Valid email is required');
    }

    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    if (!userData.username || userData.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  it('should validate email format', () => {
    const user = { email: 'invalid', password: '123456', username: 'test' };
    const result = validateUser(user);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Valid email is required');
  });

  it('should validate password length', () => {
    const user = { email: 'test@example.com', password: '123', username: 'test' };
    const result = validateUser(user);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 6 characters');
  });

  it('should validate username length', () => {
    const user = { email: 'test@example.com', password: '123456', username: 'ab' };
    const result = validateUser(user);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Username must be at least 3 characters');
  });

  it('should accept valid user', () => {
    const user = {
      email: 'test@example.com',
      password: 'securepassword',
      username: 'testuser',
    };
    const result = validateUser(user);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});