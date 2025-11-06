import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/env.js';

/**
 * Middleware to protect routes - verify JWT token
 * Usage: Add this middleware to routes that require authentication
 * Example: router.get('/profile', protect, getUserProfile)
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <token>"
      [, token] = req.headers.authorization.split(' ');

      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error.message);

      let message = 'Not authorized, token failed';

      if (error.name === 'TokenExpiredError') {
        message = 'Token expired, please login again';
      } else if (error.name === 'JsonWebTokenError') {
        message = 'Invalid token';
      }

      return res.status(401).json({
        success: false,
        message,
      });
    }
  }

  // If no token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

/**
 * Middleware to check if user has specific role (for future use)
 * Usage: router.delete('/user/:id', protect, authorize('admin'), deleteUser)
 */
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
