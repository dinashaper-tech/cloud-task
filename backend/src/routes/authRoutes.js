const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

// Public routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

// Protected routes
router.get('/profile', authenticate, authController.getProfile.bind(authController));


router.post('/register', validate('registerUser'), authController.register.bind(authController));
module.exports = router;