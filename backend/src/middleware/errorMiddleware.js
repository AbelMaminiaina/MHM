import logger from '../config/logger.js';

/**
 * Handle 404 - Route not found
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  logger.warn(`404 - Not Found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next(error);
};

/**
 * Global error handler middleware
 * This should be the last middleware in the chain
 */
export const errorHandler = (err, req, res, next) => {
  // Set status code (if not already set)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle specific Mongoose errors
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(', ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log error with Winston
  logger.error(`${statusCode} - ${message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    stack: err.stack,
    body: req.body,
  });

  res.status(statusCode).json({
    success: false,
    message,
    // Only include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
