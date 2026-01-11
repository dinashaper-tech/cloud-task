const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const authRoutes = require('./routes/authRoutes');


// Create Express application
const app = express();

// Security and parsing middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Custom middleware
app.use(requestLogger); // Log all requests
app.use('/api/v1/auth', authRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'CloudTask API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Welcome to CloudTask API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1',
    },
  });
});

// 404 handler (NO wildcard path)
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
