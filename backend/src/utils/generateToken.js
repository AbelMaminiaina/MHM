import jwt from 'jsonwebtoken';
import config from '../config/env.js';

/**
 * Generate JWT token for user authentication
 * @param {string} userId - User ID to encode in token
 * @param {string} email - User email to encode in token
 * @param {string} role - User role to encode in token
 * @returns {string} JWT token
 */
const generateToken = (userId, email, role) =>
  jwt.sign({ id: userId, email, role }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export default generateToken;
