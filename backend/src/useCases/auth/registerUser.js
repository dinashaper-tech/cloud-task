const UserRepository = require('../../repositories/UserRepository');
const User = require('../../entities/User');
const { hashPassword } = require('../../utils/password');
const { generateToken } = require('../../utils/jwt');
const { AppError } = require('../../middleware/errorHandler');

// Register a new user
async function registerUser({ email, password, firstName, lastName }) {
  
  // Validate input
  if (!email || !password || !firstName || !lastName) {
    throw new AppError('All fields are required', 400);
  }

  if (!User.isValidEmail(email)) {
    throw new AppError('Invalid email format', 400);
  }

  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters', 400);
  }

  // Check if user already exists
  const existingUser = await UserRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password);
  const user = await UserRepository.create({
    email,
    passwordHash,
    firstName,
    lastName,
  });

  // Generate authentication token
  const token = generateToken(user.id);

  return {
    user: user.toJSON(),
    token,
  };
}

module.exports = registerUser;