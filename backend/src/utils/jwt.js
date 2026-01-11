const jwt = require('jsonwebtoken');
const config = require('../config');

// Generate JWT token for authenticated user
function generateToken(userId) {
  return jwt.sign(
    { userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

// Verify and decode JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };