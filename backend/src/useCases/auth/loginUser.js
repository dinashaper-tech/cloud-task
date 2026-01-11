const UserRepository = require('../../repositories/UserRepository');
const { comparePassword } = require('../../utils/password');
const { generateToken } = require('../../utils/jwt');
const { AppError } = require('../../middleware/errorHandler');

//Authenticate user and generate token
async function loginUser({ email, password }) {
  
  // Validate input
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Find user by email
  const user = await UserRepository.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate authentication token
  const token = generateToken(user.id);

  return {
    user: user.toJSON(),
    token,
  };
}

module.exports = loginUser;