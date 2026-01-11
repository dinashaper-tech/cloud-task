const { verifyToken } = require('../utils/jwt');
const { AppError } = require('./errorHandler');
const UserRepository = require('../repositories/UserRepository');

// protect routes requiring authentication
async function authenticate(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      throw new AppError('Invalid or expired token', 401);
    }

    // Attach user to request
    const user = await UserRepository.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authenticate };