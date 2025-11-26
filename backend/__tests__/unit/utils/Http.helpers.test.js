
/**
 * @module HttpHelpers
 * @description A set of helper functions for sending HTTP responses in a standardized format.
 * 
 * @function success
 * @param {Object} res - The response object from the Express framework.
 * @param {Object} data - The data to be sent in the response.
 * @param {string} [message='Success'] - An optional message to include in the response.
 * @returns {Object} The response object for method chaining.

 * @function created
 * @param {Object} res - The response object from the Express framework.
 * @param {Object} data - The data to be sent in the response.
 * @param {string} [message='Created successfully'] - An optional message to include in the response.
 * @returns {Object} The response object for method chaining.

 * @function badRequest
 * @param {Object} res - The response object from the Express framework.
 * @param {string} [message='Bad request'] - An optional message to include in the response.
 * @returns {Object} The response object for method chaining.

 * @function unauthorized
 * @param {Object} res - The response object from the Express framework.
 * @param {string} [message='Unauthorized'] - An optional message to include in the response.
 * @returns {Object} The response object for method chaining.

 * @function notFound
 * @param {Object} res - The response object from the Express framework.
 * @param {string} [message='Not found'] - An optional message to include in the response.
 * @returns {Object} The response object for method chaining.

 * @function serverError
 * @param {Object} res - The response object from the Express framework.
 * @param {string} [message='Internal server error'] - An optional message to include in the response.
 * @returns {Object} The response object for method chaining.

 * @description Unit tests for HTTP response helper functions.
 * 
 * - Tests for successful responses (2xx) including default and custom messages.
 * - Tests for client error responses (4xx) with default and custom messages.
 * - Tests for server error responses (5xx) with default and custom messages.
 * - Tests for response chaining to ensure methods can be called in succession.
 * - Tests for handling various data types including arrays, null, and complex objects.
 * - Tests for edge cases such as undefined data and special characters in messages.
 */
describe('HTTP Response Helpers', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  // Helper functions
  const responseHelpers = {
    success: (res, data, message = 'Success') => {
      return res.status(200).json({
        success: true,
        message,
        data,
      });
    },

    created: (res, data, message = 'Created successfully') => {
      return res.status(201).json({
        success: true,
        message,
        data,
      });
    },

    badRequest: (res, message = 'Bad request') => {
      return res.status(400).json({
        success: false,
        message,
      });
    },

    unauthorized: (res, message = 'Unauthorized') => {
      return res.status(401).json({
        success: false,
        message,
      });
    },

    notFound: (res, message = 'Not found') => {
      return res.status(404).json({
        success: false,
        message,
      });
    },

    serverError: (res, message = 'Internal server error') => {
      return res.status(500).json({
        success: false,
        message,
      });
    },
  };

  describe('Success Responses (2xx)', () => {
    it('should return 200 success response', () => {
      const data = { id: 1, name: 'Test' };
      responseHelpers.success(res, data);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data,
      });
    });

    it('should return 200 with custom message', () => {
      const data = { posts: [] };
      responseHelpers.success(res, data, 'Posts retrieved');

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Posts retrieved',
        data,
      });
    });

    it('should return 201 created response', () => {
      const newPost = { id: 1, name: 'New Post' };
      responseHelpers.created(res, newPost);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Created successfully',
        data: newPost,
      });
    });

    it('should return 201 with custom message', () => {
      const data = { id: 1 };
      responseHelpers.created(res, data, 'User registered');

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered',
        data,
      });
    });
  });

  describe('Client Error Responses (4xx)', () => {
    it('should return 400 bad request', () => {
      responseHelpers.badRequest(res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Bad request',
      });
    });

    it('should return 400 with custom message', () => {
      responseHelpers.badRequest(res, 'Invalid email format');

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email format',
      });
    });

    it('should return 401 unauthorized', () => {
      responseHelpers.unauthorized(res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized',
      });
    });

    it('should return 401 with custom message', () => {
      responseHelpers.unauthorized(res, 'Invalid token');

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token',
      });
    });

    it('should return 404 not found', () => {
      responseHelpers.notFound(res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not found',
      });
    });

    it('should return 404 with custom message', () => {
      responseHelpers.notFound(res, 'Post not found');

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Post not found',
      });
    });
  });

  describe('Server Error Responses (5xx)', () => {
    it('should return 500 server error', () => {
      responseHelpers.serverError(res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
    });

    it('should return 500 with custom message', () => {
      responseHelpers.serverError(res, 'Database connection failed');

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database connection failed',
      });
    });
  });

  describe('Response Chaining', () => {
    it('should allow method chaining', () => {
      const result = responseHelpers.success(res, { id: 1 });

      expect(result).toBe(res);
    });

    it('should call status and json methods', () => {
      responseHelpers.success(res, {});

      // Verify both methods were called
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it('should call status with correct code', () => {
      responseHelpers.success(res, {});
      responseHelpers.created(res, {});
      responseHelpers.badRequest(res);

      // status should be called 3 times with different codes
      expect(res.status).toHaveBeenNthCalledWith(1, 200);
      expect(res.status).toHaveBeenNthCalledWith(2, 201);
      expect(res.status).toHaveBeenNthCalledWith(3, 400);
    });
  });

  describe('Data Types', () => {
    it('should handle array data', () => {
      const data = [1, 2, 3, 4, 5];
      responseHelpers.success(res, data);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data,
      });
    });

    it('should handle null data', () => {
      responseHelpers.success(res, null);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data: null,
      });
    });

    it('should handle empty object', () => {
      responseHelpers.success(res, {});

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data: {},
      });
    });

    it('should handle string data', () => {
      responseHelpers.success(res, 'Simple string');

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data: 'Simple string',
      });
    });

    it('should handle complex nested objects', () => {
      const complexData = {
        user: { id: 1, name: 'Test' },
        posts: [{ id: 1 }, { id: 2 }],
        metadata: { page: 1, total: 2 },
      };

      responseHelpers.success(res, complexData);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data: complexData,
      });
    });
  });

  describe('Multiple Response Types', () => {
    it('should handle success followed by error', () => {
      responseHelpers.success(res, { id: 1 });
      
      // Reset mocks
      res.status.mockClear();
      res.json.mockClear();
      
      responseHelpers.badRequest(res, 'Error');

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error',
      });
    });

    it('should handle multiple success responses', () => {
      responseHelpers.success(res, { id: 1 });
      responseHelpers.success(res, { id: 2 });

      expect(res.status).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined data', () => {
      responseHelpers.success(res, undefined);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data: undefined,
      });
    });

    it('should handle empty string message', () => {
      responseHelpers.success(res, {}, '');

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: '',
        data: {},
      });
    });

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      responseHelpers.badRequest(res, longMessage);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: longMessage,
      });
    });

    it('should handle special characters in message', () => {
      const specialMessage = 'Error: <script>alert("xss")</script>';
      responseHelpers.badRequest(res, specialMessage);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: specialMessage,
      });
    });
  });
});