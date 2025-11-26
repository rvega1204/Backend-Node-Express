// Error Handling Tests
// Using standard Jest matchers and correct async patterns

describe('Error Handling Utils', () => {
  // Custom error class
  class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
    }
  }

  const errorHandler = {
    createError: (message, statusCode) => {
      return new AppError(message, statusCode);
    },

    handleValidationError: (error) => {
      if (error.name === 'ValidationError') {
        return {
          statusCode: 400,
          message: 'Validation Error',
          errors: Object.values(error.errors || {}).map((err) => err.message),
        };
      }
      return null;
    },

    handleCastError: (error) => {
      if (error.name === 'CastError') {
        return {
          statusCode: 400,
          message: `Invalid ${error.path}: ${error.value}`,
        };
      }
      return null;
    },

    handleDuplicateError: (error) => {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0];
        return {
          statusCode: 400,
          message: `Duplicate field value: ${field}`,
        };
      }
      return null;
    },

    handleJWTError: (error) => {
      if (error.name === 'JsonWebTokenError') {
        return {
          statusCode: 401,
          message: 'Invalid token',
        };
      }
      if (error.name === 'TokenExpiredError') {
        return {
          statusCode: 401,
          message: 'Token expired',
        };
      }
      return null;
    },

    formatErrorResponse: (error) => {
      return {
        success: false,
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || 500,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      };
    },
  };

  describe('Create Custom Errors', () => {
    it('should create error with message and status code', () => {
      const error = errorHandler.createError('Not found', 404);

      expect(error.message).toBe('Not found');
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
    });

    it('should create validation error', () => {
      const error = errorHandler.createError('Validation failed', 400);

      expect(error.statusCode).toBe(400);
      expect(error instanceof Error).toBe(true);
    });

    it('should create unauthorized error', () => {
      const error = errorHandler.createError('Unauthorized', 401);

      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Unauthorized');
    });

    it('should extend Error class', () => {
      const error = errorHandler.createError('Test', 500);

      expect(error instanceof Error).toBe(true);
      expect(error.name).toBe('Error');
    });
  });

  describe('Validation Error Handling', () => {
    it('should handle validation errors', () => {
      const error = {
        name: 'ValidationError',
        errors: {
          name: { message: 'Name is required' },
          email: { message: 'Email is invalid' },
        },
      };

      const result = errorHandler.handleValidationError(error);

      expect(result.statusCode).toBe(400);
      expect(result.message).toBe('Validation Error');
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain('Name is required');
      expect(result.errors).toContain('Email is invalid');
    });

    it('should return null for non-validation errors', () => {
      const error = { name: 'SomeOtherError' };

      const result = errorHandler.handleValidationError(error);

      expect(result).toBeNull();
    });

    it('should handle empty errors object', () => {
      const error = {
        name: 'ValidationError',
        errors: {},
      };

      const result = errorHandler.handleValidationError(error);

      expect(result.errors).toHaveLength(0);
    });

    it('should handle missing errors property', () => {
      const error = {
        name: 'ValidationError',
      };

      const result = errorHandler.handleValidationError(error);

      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Cast Error Handling', () => {
    it('should handle cast errors', () => {
      const error = {
        name: 'CastError',
        path: 'id',
        value: 'invalid-id',
      };

      const result = errorHandler.handleCastError(error);

      expect(result.statusCode).toBe(400);
      expect(result.message).toBe('Invalid id: invalid-id');
    });

    it('should return null for non-cast errors', () => {
      const error = { name: 'OtherError' };

      const result = errorHandler.handleCastError(error);

      expect(result).toBeNull();
    });

    it('should handle different field types', () => {
      const error = {
        name: 'CastError',
        path: '_id',
        value: '12345',
      };

      const result = errorHandler.handleCastError(error);

      expect(result.message).toBe('Invalid _id: 12345');
    });
  });

  describe('Duplicate Error Handling', () => {
    it('should handle duplicate key errors', () => {
      const error = {
        code: 11000,
        keyValue: { email: 'test@example.com' },
      };

      const result = errorHandler.handleDuplicateError(error);

      expect(result.statusCode).toBe(400);
      expect(result.message).toBe('Duplicate field value: email');
    });

    it('should return null for non-duplicate errors', () => {
      const error = { code: 1001 };

      const result = errorHandler.handleDuplicateError(error);

      expect(result).toBeNull();
    });

    it('should handle empty keyValue', () => {
      const error = {
        code: 11000,
        keyValue: {},
      };

      const result = errorHandler.handleDuplicateError(error);

      expect(result.message).toContain('Duplicate field value');
    });

    it('should handle multiple fields in keyValue', () => {
      const error = {
        code: 11000,
        keyValue: { username: 'test', email: 'test@example.com' },
      };

      const result = errorHandler.handleDuplicateError(error);

      // Gets first field
      expect(result.message).toBe('Duplicate field value: username');
    });
  });

  describe('JWT Error Handling', () => {
    it('should handle invalid JWT', () => {
      const error = { name: 'JsonWebTokenError' };

      const result = errorHandler.handleJWTError(error);

      expect(result.statusCode).toBe(401);
      expect(result.message).toBe('Invalid token');
    });

    it('should handle expired token', () => {
      const error = { name: 'TokenExpiredError' };

      const result = errorHandler.handleJWTError(error);

      expect(result.statusCode).toBe(401);
      expect(result.message).toBe('Token expired');
    });

    it('should return null for non-JWT errors', () => {
      const error = { name: 'SomeOtherError' };

      const result = errorHandler.handleJWTError(error);

      expect(result).toBeNull();
    });
  });

  describe('Format Error Response', () => {
    it('should format error response', () => {
      const error = {
        message: 'Something went wrong',
        statusCode: 500,
        stack: 'Error stack trace',
      };

      const result = errorHandler.formatErrorResponse(error);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Something went wrong');
      expect(result.statusCode).toBe(500);
    });

    it('should use default status code', () => {
      const error = {
        message: 'Error without status code',
      };

      const result = errorHandler.formatErrorResponse(error);

      expect(result.statusCode).toBe(500);
    });

    it('should use default message', () => {
      const error = {};

      const result = errorHandler.formatErrorResponse(error);

      expect(result.message).toBe('Internal server error');
    });

    it('should include stack in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const error = {
        message: 'Error',
        stack: 'Stack trace',
      };

      const result = errorHandler.formatErrorResponse(error);

      expect(result.stack).toBe('Stack trace');
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const error = {
        message: 'Error',
        stack: 'Stack trace',
      };

      const result = errorHandler.formatErrorResponse(error);

      expect(result.stack).toBeUndefined();
      
      process.env.NODE_ENV = originalEnv;
    });
  });
});

describe('Async Error Wrapper', () => {
  const asyncWrapper = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };

  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should catch async errors', async () => {
    const asyncFunction = async (req, res, next) => {
      throw new Error('Async error');
    };

    const wrapped = asyncWrapper(asyncFunction);
    await wrapped(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Async error');
  });

  it('should pass through successful execution', async () => {
    const asyncFunction = async (req, res, next) => {
      res.status(200).json({ success: true });
    };

    const wrapped = asyncWrapper(asyncFunction);
    await wrapped(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle promise rejections', async () => {
    const asyncFunction = () => {
      return Promise.reject(new Error('Rejected'));
    };

    const wrapped = asyncWrapper(asyncFunction);
    await wrapped(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Rejected');
  });

  it('should preserve error details', async () => {
    class CustomError extends Error {
      constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
      }
    }

    const asyncFunction = async () => {
      throw new CustomError('Custom error', 404);
    };

    const wrapped = asyncWrapper(asyncFunction);
    await wrapped(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error.message).toBe('Custom error');
    expect(error.statusCode).toBe(404);
  });

  it('should not call next if no error occurs', async () => {
    const asyncFunction = async (req, res) => {
      res.status(200).json({ data: 'success' });
    };

    const wrapped = asyncWrapper(asyncFunction);
    await wrapped(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ data: 'success' });
  });
});