const registerUser = require('../useCases/auth/registerUser');
const loginUser = require('../useCases/auth/loginUser');

//  HTTP request/response for authentication
class AuthController {
  
  // Handle user registration
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      const result = await registerUser({ email, password, firstName, lastName });
      
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Handle user login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const result = await loginUser({ email, password });
      
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  async getProfile(req, res, next) {
    try {
      res.status(200).json({
        status: 'success',
        data: { user: req.user.toJSON() },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();