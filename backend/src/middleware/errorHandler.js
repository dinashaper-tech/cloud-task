// backend/src/middleware/errorHandler.js

// Custom error class for application errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle database-specific errors
const handleDatabaseError = (err) => {
  // PostgreSQL unique constraint violation
  if (err.code === '23505') {
    return new AppError('Duplicate entry. Resource already exists.', 409);
  }
  
  // Foreign key violation
  if (err.code === '23503') {
    return new AppError('Referenced resource does not exist.', 400);
  }
  
  // Invalid UUID
  if (err.code === '22P02') {
    return new AppError('Invalid ID format.', 400);
  }
  
  return err;
};

// Handle JWT errors
const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpiredError = () => new AppError('Token expired. Please log in again.', 401);

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Handle specific error types
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if (err.code && err.code.startsWith('23')) error = handleDatabaseError(err);

  // Set default status code and status
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  // Send appropriate response based on environment
  if (process.env.NODE_ENV === 'development') {
    // Detailed error in development
    res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
    });
  } else {
    // Clean error in production
    if (error.isOperational) {
      // Operational, trusted error: send message to client
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      // Programming or unknown error: don't leak error details
      console.error('ERROR', error);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  }
};

module.exports = { AppError, errorHandler };