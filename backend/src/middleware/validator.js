const { AppError } = require('./errorHandler');

// Validation schemas
const schemas = {
  registerUser: {
    email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: 'string', required: true, minLength: 8 },
    firstName: { type: 'string', required: true, minLength: 2 },
    lastName: { type: 'string', required: true, minLength: 2 }
  },
  
  createTask: {
    title: { type: 'string', required: true, minLength: 1, maxLength: 255 },
    description: { type: 'string', required: false },
    priority: { type: 'string', required: false, enum: ['low', 'medium', 'high', 'urgent'] },
    status: { type: 'string', required: false, enum: ['todo', 'in_progress', 'completed', 'archived'] },
    projectId: { type: 'string', required: false, pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/ }
  }
};

// Validation middleware factory
function validate(schemaName) {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return next(new AppError('Invalid validation schema', 500));
    }

    const errors = [];
    const data = req.body;

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      // Check required
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      // Skip further validation if not required and empty
      if (!rules.required && !value) continue;

      // Type check
      if (rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be a ${rules.type}`);
      }

      // Length checks
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must not exceed ${rules.maxLength} characters`);
      }

      // Pattern check
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }

      // Enum check
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return next(new AppError(errors.join('; '), 400));
    }

    next();
  };
}

module.exports = { validate };